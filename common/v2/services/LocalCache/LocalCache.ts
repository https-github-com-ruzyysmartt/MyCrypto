import * as utils from 'v2/libs';
import * as types from 'v2/services';
import { CACHE_INIT, CACHE_KEY, ENCRYPTED_CACHE_KEY, LocalCache } from './constants';
import { Fiats } from 'config';
import { ContractsData, AssetsData } from 'v2/config/cacheData';
import { WalletTypes, SecureWalletName } from 'v2/config';
import { NODE_CONFIGS } from 'libs/nodes';
import { STATIC_NETWORKS_INITIAL_STATE } from 'features/config/networks/static/reducer';
import { isDevelopment } from 'v2/utils/environment';
import { InsecureWalletName } from 'v2/features/Wallets/types';

// Initialization
export const initializeCache = () => {
  const check = localStorage.getItem(CACHE_KEY);
  if (!check || check === '[]' || check === '{}') {
    hardRefreshCache();

    initFiatCurrencies();

    initNetworks();

    initNodeOptions();

    initWallets();

    initSettings();

    initContracts();

    initAssets();

    if (isDevelopment) {
      initTestAccounts();
    }
  }
};

export const hardRefreshCache = () => {
  setCache(CACHE_INIT);
};

export const initSettings = () => {
  const newStorage = getCacheRaw();
  newStorage.settings = {
    fiatCurrency: 'USD',
    darkMode: false,
    dashboardAccounts: [],
    inactivityTimer: 1800000
  };
  setCache(newStorage);
};

export const initWallets = () => {
  const newStorage = getCacheRaw();
  const wallets: Record<string, types.Wallet> = WalletTypes;
  newStorage.wallets = wallets;
  setCache(newStorage);
};

export const initNodeOptions = () => {
  const newStorage = getCacheRaw();
  const nodeData: Record<string, types.NodeOptions[]> = NODE_CONFIGS;
  Object.keys(nodeData).map(en => {
    const networkNodes = nodeData[en];
    networkNodes.map(entry => {
      const newNode: types.NodeOptions = {
        name: entry.name,
        type: entry.type,
        service: entry.service,
        url: entry.url
      };
      newStorage.networks[en].nodes.push(newNode);
    });
  });
  setCache(newStorage);
};

export const initNetworks = () => {
  const newStorage = getCacheRaw();
  const allNetworks: string[] = Object.keys(STATIC_NETWORKS_INITIAL_STATE);
  allNetworks.map((en: any) => {
    const newContracts: string[] = [];
    const newAssets: string[] = [];
    Object.keys(newStorage.contracts).map(entry => {
      if (newStorage.contracts[entry].networkId === en) {
        newContracts.push(entry);
      }
    });
    Object.keys(newStorage.assets).map(entry => {
      if (newStorage.assets[entry].networkId === en) {
        newAssets.push(entry);
      }
    });
    const baseAssetID = utils.generateUUID();
    const newLocalNetwork: types.Network = {
      contracts: newContracts,
      assets: [...newAssets],
      nodes: [],
      baseAsset: baseAssetID,
      id: STATIC_NETWORKS_INITIAL_STATE[en].id,
      name: STATIC_NETWORKS_INITIAL_STATE[en].name,
      chainId: STATIC_NETWORKS_INITIAL_STATE[en].chainId,
      isCustom: STATIC_NETWORKS_INITIAL_STATE[en].isCustom,
      color: STATIC_NETWORKS_INITIAL_STATE[en].color,
      dPaths: {
        ...STATIC_NETWORKS_INITIAL_STATE[en].dPathFormats,
        default: STATIC_NETWORKS_INITIAL_STATE[en].dPathFormats[InsecureWalletName.MNEMONIC_PHRASE]
      },
      gasPriceSettings: STATIC_NETWORKS_INITIAL_STATE[en].gasPriceSettings,
      shouldEstimateGasPrice: STATIC_NETWORKS_INITIAL_STATE[en].shouldEstimateGasPrice
    };
    const newLocalAssetOption: types.Asset = {
      uuid: baseAssetID,
      name: STATIC_NETWORKS_INITIAL_STATE[en].name,
      networkId: en,
      ticker: en,
      type: 'base',
      decimal: 18
    };
    newStorage.networks[en] = newLocalNetwork;
    newStorage.assets[baseAssetID] = newLocalAssetOption;
  });
  setCache(newStorage);
};

export const initAssets = () => {
  const newStorage = getCacheRaw();
  const assets = AssetsData();
  Object.keys(assets).map(en => {
    if (assets[en] && assets[en].networkId) {
      const uuid = utils.generateUUID();
      const networkName = assets[en].networkId;
      assets[en].uuid = uuid;
      newStorage.assets[uuid] = assets[en];
      if (networkName) {
        newStorage.networks[networkName].assets.push(uuid);
      }
    }
  });
  setCache(newStorage);
};

export const initContracts = () => {
  const newStorage = getCacheRaw();
  const contracts = ContractsData();
  Object.keys(contracts).map(en => {
    newStorage.contracts[en] = contracts[en];
    newStorage.networks[contracts[en].networkId].contracts.push(en);
  });
  setCache(newStorage);
};

export const initFiatCurrencies = () => {
  const newStorage = getCacheRaw();
  Fiats.map(en => {
    const uuid = utils.generateUUID();
    newStorage.assets[uuid] = {
      uuid,
      ticker: en.code,
      name: en.name,
      networkId: undefined,
      type: 'fiat',
      decimal: 0
    };
  });
  setCache(newStorage);
};

/* Not deleting in case we need it later.
export const initDerivationPathOptions = () => {
  const newStorage = getCacheRaw();
  DPaths.map(en => {
    newStorage.derivationPathOptions[en.label] = {
      name: en.label,
      derivationPath: en.value,
      active: false
    };
  });
  setCache(newStorage);
};
*/

// Low level operations

const getCacheRaw = (): LocalCache => {
  const text = localStorage.getItem(CACHE_KEY);
  return text ? JSON.parse(text) : CACHE_INIT;
};

export const getCache = (): LocalCache => {
  initializeCache();
  return getCacheRaw();
};

export const setCache = (newCache: LocalCache) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify(newCache));
};

export const destroyCache = () => {
  localStorage.removeItem(CACHE_KEY);
};

export const getEncryptedCache = (): string => {
  return localStorage.getItem(ENCRYPTED_CACHE_KEY) || '';
};

export const setEncryptedCache = (newEncryptedCache: string) => {
  localStorage.setItem(ENCRYPTED_CACHE_KEY, newEncryptedCache);
};

export const destroyEncryptedCache = () => {
  localStorage.removeItem(ENCRYPTED_CACHE_KEY);
};

// Settings operations

type SettingsKey = 'settings' | 'screenLockSettings' | 'networks';

export const readSettings = <K extends SettingsKey>(key: K) => () => {
  return getCache()[key];
};

export const updateSettings = <K extends SettingsKey>(key: K) => (value: LocalCache[K]) => {
  const newCache = getCache();
  newCache[key] = value;

  setCache(newCache);
};

// Collection operations

type CollectionKey =
  | 'accounts'
  | 'wallets'
  | 'notifications'
  | 'addressBook'
  | 'assets'
  | 'contracts'
  | 'networks';

export const create = <K extends CollectionKey>(key: K) => (
  value: LocalCache[K][keyof LocalCache[K]]
) => {
  const uuid = utils.generateUUID();

  const newCache = getCache();
  newCache[key][uuid] = value;

  setCache(newCache);
};

export const createWithID = <K extends CollectionKey>(key: K) => (
  value: LocalCache[K][keyof LocalCache[K]],
  id: string
) => {
  const uuid = id;
  if (getCache()[key][uuid] === undefined) {
    const newCache = getCache();
    newCache[key][uuid] = value;
    setCache(newCache);
  } else {
    console.log('Error: key already exists in createWithID');
  }
};

export const read = <K extends CollectionKey>(key: K) => (uuid: string): LocalCache[K][string] => {
  return getCache()[key][uuid];
};

export const update = <K extends CollectionKey>(key: K) => (
  uuid: string,
  value: LocalCache[K][keyof LocalCache[K]]
) => {
  const newCache = getCache();
  newCache[key][uuid] = value;

  setCache(newCache);
};

export const destroy = <K extends CollectionKey>(key: K) => (uuid: string) => {
  const parsedLocalCache = getCache();
  delete parsedLocalCache[key][uuid];
  const newCache = parsedLocalCache;
  setCache(newCache);
};

export const readAll = <K extends CollectionKey>(key: K) => () => {
  const section: LocalCache[K] = getCache()[key];
  const sectionEntries: [string, LocalCache[K][string]][] = Object.entries(section);
  return sectionEntries.map(([uuid, value]) => ({ ...value, uuid }));
};

export const initTestAccounts = () => {
  const newStorage = getCacheRaw();
  const newAccounts: types.Account[] = [
    {
      label: 'ETH Test 1',
      address: '0xc7bfc8a6bd4e52bfe901764143abef76caf2f912',
      network: 'Ethereum',
      assets: [
        { uuid: '10e14757-78bb-4bb2-a17a-8333830f6698', balance: '0.01' },
        { uuid: 'f7e30bbe-08e2-41ce-9231-5236e6aab702', balance: '0.001' }
      ],
      wallet: SecureWalletName.WEB3,
      balance: 1e16,
      dPath: `m/44'/60'/0'/0/0`,
      timestamp: 0,
      transactions: []
    },
    {
      label: 'Goerli ETH Test 1',
      address: '0xc7bfc8a6bd4e52bfe901764143abef76caf2f912',
      network: 'Goerli',
      assets: [{ uuid: '12d3cbf2-de3a-4050-a0c6-521592e4b85a', balance: '0.01' }],
      wallet: SecureWalletName.WEB3,
      balance: 1e16,
      dPath: `m/44'/60'/0'/0/0`,
      timestamp: 0,
      transactions: []
    }
  ];

  const newAssets: { [key in string]: types.Asset } = {
    '10e14757-78bb-4bb2-a17a-8333830f6698': {
      uuid: '10e14757-78bb-4bb2-a17a-8333830f6698',
      name: 'WrappedETH',
      networkId: 'Ethereum',
      type: 'erc20',
      ticker: 'WETH',
      contractAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      decimal: 18
    },
    'f7e30bbe-08e2-41ce-9231-5236e6aab702': {
      uuid: 'f7e30bbe-08e2-41ce-9231-5236e6aab702',
      name: 'ETH',
      networkId: 'Ethereum',
      type: 'base',
      ticker: 'ETH',
      decimal: 18
    },
    '12d3cbf2-de3a-4050-a0c6-521592e4b85a': {
      uuid: '12d3cbf2-de3a-4050-a0c6-521592e4b85a',
      name: 'GoerliETH',
      networkId: 'Goerli',
      type: 'base',
      ticker: 'GoerliETH',
      decimal: 18
    }
  };

  newAccounts.map(accountToAdd => {
    const uuid = utils.generateUUID();
    newStorage.accounts[uuid] = accountToAdd;
    newStorage.settings.dashboardAccounts.push(uuid);
  });
  Object.keys(newAssets).map(assetToAdd => {
    newStorage.assets[assetToAdd] = newAssets[assetToAdd];
  });
  setCache(newStorage);
};
