it('successfully submits the settings form', () => {
  cy.intercept('GET', '**/notes').as('getNotes')
  cy.intercept('POST', '**/prod/billing').as('paymentRequest')

  cy.login()
  cy.visit('/settings')

  cy.get('#storage').type('1')
  cy.get('#name').type('Mary Doe')
  cy.iframe('[title="Secure card payment input frame"]')
    .as('iframe')
    .find('[name="cardnumber"]')
    .type('4242424242424242')
  cy.get('@iframe')
    .find('[name="exp-date"]')
    .type('1222')
  cy.get('@iframe')
    .find('[name="cvc"]')
    .type('123')
  cy.get('@iframe')
    .find('[name="postal"]')
    .type('12345')
  cy.contains('button', 'Purchase').click()
  cy.wait('@getNotes')

  cy.wait('@paymentRequest').then(response => {
    expect(response.state).to.equal('Complete')
  })
})
