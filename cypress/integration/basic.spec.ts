/// <reference types="cypress" />

describe('basic validation', () => {
  it('should validate based on field type on blur', () => {
    cy.visit('http://localhost:3000');

    // Validate on blur
    cy.get('textarea[name="whatCouldBeBetter"]').type('Foo').clear();
    cy.get('textarea[name="whatCouldBeBetter"] + div').contains(
      'This question requires an answer.'
    );

    cy.get('textarea[name="whatCouldBeBetter"]').type('Moar fields!').blur();
    cy.get('textarea[name="whatCouldBeBetter"] + div').should('not.exist');

    // Validate email shows correct message
    cy.get('input[name="email"]').clear().type('jared').blur();
    cy.get('input[name="email"] + div').contains('Invalid email');
    cy.get('input[name="email"]').clear().type('hello@formium.io').blur();
    cy.get('input[name="email"] + div').should('not.exist');

    // Submit the form
    cy.get('button[type=submit]').click();

    cy.get('[data-result]').contains(`{
      "whatCouldBeBetter": "Moar fields!",
      "email": "hello@formium.io",
      "name": "",
      "yourGithubProfile": ""
    }`);
    cy.get('#renderCounter').contains('2');
  });
});
