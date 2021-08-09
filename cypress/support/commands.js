Cypress.Commands.add('login', (
  username = Cypress.env('USER_EMAIL'),
  password = Cypress.env('USER_PASSWORD')
) => {
  // References:
  // https://docs.cypress.io/api/commands/session
  // https://www.cypress.io/blog/2021/08/04/authenticate-faster-in-tests-cy-session-command/
  // https://talkingabouttesting.com/2021/08/07/autentique-testes-mais-rapido-com-o-comando-cy-session/
  cy.session([username, password], () => {
    cy.visit('/login')
    cy.get('#email').type(username)
    cy.get('#password').type(password, { log: false })
    cy.contains('button', 'Login').click()
    cy.contains('h1', 'Your Notes').should('be.visible')
  })
})
