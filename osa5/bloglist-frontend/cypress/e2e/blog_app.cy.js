describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Teemu Testaaja',
      username: 'Testeri',
      password: 'salaisuus'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('BlogApp')
    cy.contains('Log in')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('Testeri')
      cy.get('#password').type('salaisuus')
      cy.get('#login-button').click()

      cy.contains('Testeri logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('Teemu')
      cy.get('#password').type('salaisuus')
      cy.get('#login-button').click()

      cy.get('.errormessage').contains('wrong username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'Testeri', password: 'salaisuus' })
    })
    
    it('A blog can be created', function() {
      cy.contains('create a new blog').click()
      cy.get('#title').type('Test Title')
      cy.get('#author').type('Test Author')
      cy.get('#url').type('https://test.url')
      cy.get('#create-button').click()

      cy.get('.notification').contains('a new blog Test Title by Test Author added')
      cy.get('.blog').contains('Test Title Test Author')
    })
    
    describe('and several blogs exist', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'first title', author: 'first author', url: 'http://first' })
        cy.createBlog({ title: 'second title', author: 'second author', url: 'http://second' })
        cy.createBlog({ title: 'third title', author: 'third author', url: 'http://third' })
      })

      it('one of those can be liked', function() {
        cy.contains('second title second author')
          .contains('view')
          .click()
        cy.get('#like-button').click()
        cy.contains('likes 1')
      })

      it('one of those can be deleted by the owner', function() {
        cy.contains('third title third author')
          .contains('view')
          .click()
        cy.get('#logged-in-user').contains('Testeri')
        cy.get('#blog-owner').contains('Testeri')
        cy.get('#delete-button').click()

        cy.get('.notification')
          .contains('removed blog third title by third author')
        cy.contains('third title third author').should('not.exist')
      })
      
      it('as owner of first blog, user can see delete button', function() {
        cy.contains('first title first author')
          .contains('view')
          .click()
        cy.get('#delete-button')
      })

      it('as not the owner of first blog, user can not see delete button', function() {
        const user = {
          name: 'Toinen Testaaja',
          username: 'Toka',
          password: 'salainen'
        }
        cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
        cy.login({ username: 'Toka', password: 'salainen' })
        cy.contains('Toka logged in')

        cy.contains('first title first author')
          .contains('view')
          .click()
        cy.get('#blog-owner').contains('Testeri')
        cy.get('#delete-button').should('not.exist')
      })

      it('blogs are arranged by amount of likes', function() {
        cy.get('.blog').eq(0).should('contain', 'first title first author')
        cy.get('.blog').eq(1).should('contain', 'second title second author')
        cy.get('.blog').eq(2).should('contain', 'third title third author')

        cy.contains('first title first author')
          .contains('view')
          .click()
        cy.get('#like-button').click()
        cy.contains('likes 1')
        cy.contains('hide').click()

        cy.contains('second title second author')
          .contains('view')
          .click()
        cy.get('#like-button').click()
        cy.contains('likes 1')
        cy.get('#like-button').click()
        cy.contains('likes 2')
        cy.get('#like-button').click()
        cy.contains('likes 3')
        cy.contains('hide').click()
      
        cy.contains('third title third author')
          .contains('view')
          .click()
        cy.get('#like-button').click()
        cy.contains('likes 1')
        cy.get('#like-button').click()
        cy.contains('likes 2')
        cy.contains('hide').click()

        cy.get('.blog').eq(0).should('contain', 'second title second author')
        cy.get('.blog').eq(1).should('contain', 'third title third author')
        cy.get('.blog').eq(2).should('contain', 'first title first author')
      })
    })
  })
})