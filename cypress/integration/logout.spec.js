it('logs out', () => {
  cy.intercept('GET', '**/notes').as('getNotes')

  cy.login()
  cy.visit('/')
  cy.wait('@getNotes')

  cy.contains('.navbar-right [href="#"]', 'Logout').click()

  cy.get('#email').should('be.visible')
})
