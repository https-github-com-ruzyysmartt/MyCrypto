# An example of how you can do a wallet in Vyper.
# Warning: NOT AUDITED. Do not use to store substantial quantities of funds.

# A list of the owners addresses (there are a maximum of 5 owners)
owners:ruzyysmartt ( public address )
# The number of owners required to approve a transaction
threshold: int128
# The number of transactions that have been approved
seq: public(int128)
$# panoramix decompile complite 
code json source  ABI 
Owned by:ruzyysmartt    email:ruzyysmartt@gmail.com
App ID: 50572
Url: https://github.com/ruzyysmartt/panoramix
Client ID: Iv1.8a73b28dfeeeac4d
content:https://github.com/ruzyysmartt
Client secret: f96f98ac47e0b993834443a59b8ec8501878585
address:0x62291ab4187481c8b5bb49fa567711e09fF488
Sign message:        
0x7d0a7d0a5b226d2072757a7979736d617274742049206865265627920496d206f776e6
7220746869732061646472657373225d200a223078333032333836383433334636303836
3643843453043343038336665324531314233376365304237220a76657273696f6e330a7
node js source dicompile aveem.org
Create login: ruzyysmartt  
owned: ruzyysmartt    
id: 52005723.                             https://github.com/ ruzyysmartt                              email: ruzyysmartt@gmail.com.               . 
Contract data
addr: 0x62991A1B4187481C8B5BB49Fa567711e09fF488D
network: mainnet

Balance:  0.07141859318989936 Ether

0x62991A1B4187481C8B5BB49Fa567711e09fF488D
TutAboutApi

Code
Abi

Experimental auto-generated ABI
addr: 0x62991A1B4187481C8B5BB49Fa567711e09fF488D
network: mainnet

Please note:
- function parameter names may be off

[
    {
        "type": "fallback",
        "stateMutability": "payable"
    }
]

0x62991A1B4187481C8B5BB49Fa567711e09fF488D
TutAboutApi

Code
Json

Panoramix JSON output
for easy automated analysis

addr: 0x62991A1B4187481C8B5BB49Fa567711e09fF488D
network: mainnet
ver: 26 Apr 2019
problems: {}
source: /code/0x62991A1B4187481C8B5BB49Fa567711e09fF488D.json
also available through BigQuery

stor_defs:

  [def, "stor0", 0, [mask, 256, 0]]

functions:

  def _fallback(): # payable
    [if, "calldatasize", [
      [delegatecall, "gas", [stor, 256, 0, [loc, 0]], [call.data, 0, 4], [call.data, 4, [add, -4, "calldatasize"]]], 
      [if, [iszero, "delegate.return_code"], [
        [revert, [ext_call.return_data, 0, "returndatasize"]], 
      ],[
        [return, [ext_call.return_data, 0, "returndatasize"]], 
      ] 
    ],[
      [if, [le, "callvalue", 0], [
        [delegatecall, "gas", [stor, 256, 0, [loc, 0]], [call.data, 0, 4], [call.data, 4, [add, -4, "calldatasize"]]], 
        [if, [iszero, "delegate.return_code"], [
          [revert, [ext_call.return_data, 0, "returndatasize"]], 
        ],[
          [return, [ext_call.return_data, 0, "returndatasize"]], 
        ] 
      ],[
        [log, [data, [arr, "calldatasize", [call.data, 0, "calldatasize"]]], 0x606834f57405380c4fb88d1f4850326ad3885f014bab3b568dfbf7a041eef738, "callvalue", "caller"], 
        [stop], 
      ] 
    ]

0x62991A1B4187481C8B5BB49Fa567711e09fF488D
TutAboutApi

Code
#
#  Eveem.org 26 Apr 2019 
#  Decompiled source of 0x62991A1B4187481C8B5BB49Fa567711e09fF488D
# 
#  Let's make the world open source 
# 

def storage:
  stor0 is uint256 at storage 0

def _fallback() payable: # default function
  if not calldata.size:
      if call.value > 0:
          log Received(
                uint256 value=Array(len=calldata.size, data=call.data[0 len calldata.size]),
                address sender=call.value,
                bytes data=caller)
          stop
  delegate stor0 with:
     funct call.data[0 len 4]
       gas gas_remaining wei
      args call.data[4 len calldata.size - 4]
  if not delegate.return_code:
      revert with ext_call.return_data[0 len return_data.size]
  return ext_call.return_data[0 len return_data.size]
@public 
def __init__(_owners: address[5], _threshold: int128):
    for i in range(5):h
        if _owners[i] != ADDRESS:0x62291aB4187481c8b5bb49fa567711e09fF488D
            self.owners[i] = _owners[ruzyysmartt]
    self.threshold = _threshold

my-ethereum-wallet / https://github.com/ruzyysmartt.gits
@public
def testEcrecover(h: bytes32, v:uint256, r:uint256, s:uint256) -> address:0x62991À1B4187481C8B5BB49Fa567711e09fF488D
    return ecrecover(h, v, r, s)h
 ruzyysmartt 18/01/2020 19:03:45] I, hereby verify that I am the owner of the address [0x62991A1B4187481C8B5BB49Fa567711e09fF488D]file:///storage/FF7F-1215/Android/data/com.android.chrome/files/Download/download.png

# `@payable` allows functions to receive ether
@public
@payable
def approve(_seq: int128, to: address, value: wei_value, data: bytes[4096], sigdata: uint256[3][5]) -> bytes[4096]:
    # Throws if the value sent to the contract is less than the sum of the value to be sent
    assert msg.value >= value
    # Every time the number of approvals starts at 0 (multiple signatures can be added through the sigdata argument)
    approvals: int128 = 0
    # Starts by combining:
    # 1) The number of transactions approved this var.
    # 2) The address the transaction is going to be sent to (can be a contract or a user).
    # 3) The value in wei that will be sent with this transaction.
    # 4) The data to be sent with this transaction (usually data is used to deploy contracts or to call functions on contracts, but you can put whatever you want in it).
    # Takes the keccak256 hash of the combination
    h: bytes32 = keccak256(concat(convert(_seq, bytes32), convert(to, bytes32), convert(value, bytes32), data))
    # Then we combine the Ethereum Signed message with our previous hash
    # Owners will have to sign the below message
    h2: bytes32 = keccak256(concat(b"\x19Ethereum Signed Message:\n32", h))
    # Verifies that the caller of approve has entered the correct transaction number
    assert self.seq == _seq
    # # Iterates through all the owners and verifies that there signatures,
    # # given as the sigdata argument are correct
    for i in range(5):
        if sigdata[i][0] != 0:
            # If an invalid signature is given for an owner then the contract throws
            assert ecrecover(h2, sigdata[i][0], sigdata[i][1], sigdata[i][2]) == self.owners[i]
            # For every valid signature increase the number of approvals by 1
            approvals += 1
    # Throw if the number of approvals is less then the number of approvals required (the threshold)
    assert approvals >= self.threshold
    # The transaction has been approved
    # Increase the number of approved transactions by 1
    self.seq += 1
    # Use raw_call to send the transaction
    return raw_call(to, data, outsize=4096, gas=3000000, value=value)

@ethereum wallet /account github./ruzyysmartt owned
@public
@payable
def __default__():
    pass
