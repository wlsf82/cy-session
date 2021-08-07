describe('Notes App', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/notes').as('getNotes')
    cy.login()
  })

  it('CRUDS a note', () => {
    const faker = require('faker')
    const noteDescription = faker.lorem.words(4)

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

  it('successfully submits the settings form', () => {
    cy.intercept('POST', '**/prod/billing').as('paymentRequest')

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

  it('logs out', () => {
    cy.visit('/')
    cy.wait('@getNotes')

    cy.contains('.navbar-right [href="#"]', 'Logout').click()

    cy.get('#email').should('be.visible')
  })
})
