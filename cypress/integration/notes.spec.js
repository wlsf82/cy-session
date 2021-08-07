it('CRUDS a note', () => {
  cy.intercept('GET', '**/notes').as('getNotes')

  const faker = require('faker')
  const noteDescription = faker.lorem.words(4)

  cy.login()
  cy.visit('/notes/new')

  cy.get('#content').type(noteDescription)
  cy.contains('button', 'Create').click()
  cy.wait('@getNotes')

  cy.contains('h1', 'Your Notes').should('be.visible')
  cy.contains('.list-group-item', noteDescription)
    .should('be.visible')
    .click()

  const updatedNoteDescription = faker.lorem.words(4)

  cy.get('#content')
    .clear()
    .type(updatedNoteDescription)
  cy.contains('button', 'Save').click()
  cy.wait('@getNotes')

  cy.contains('h1', 'Your Notes').should('be.visible')
  cy.contains('.list-group-item', noteDescription).should('not.exist')
  cy.contains('.list-group-item', updatedNoteDescription)
    .should('be.visible')
    .click()
  cy.contains('button', 'Delete').click()
  cy.wait('@getNotes')

  cy.contains('h1', 'Your Notes').should('be.visible')
  cy.contains('.list-group-item', updatedNoteDescription).should('not.exist')
})
