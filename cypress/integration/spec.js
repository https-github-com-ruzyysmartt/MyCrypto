it('clicks', () => {
  // window creation and url load
  cy.electronVisitUrl('./electron-app/main/index.js', 'http://localhost:3000')
  cy.get('button')
    .click()
    .click()
  cy.get('#clicked').should('have.text', '2')
})
