const { Given, When, Then } = require('cypress-cucumber-preprocessor/steps');

Given('I navigate to Google home page', () => {
  cy.visit('https://www.google.com');
  cy.wait(2000);
});

Given('I am on the Google home page', () => {
  cy.url().should('include', 'google.com');
  cy.get('body').should('be.visible');
});

When('I enter {string} in the search box', (searchTerm) => {
  cy.get('textarea[name="q"]').type(searchTerm);
});

When('I click the search button', () => {
  cy.get('textarea[name="q"]').type('{enter}');
  cy.wait(2000);
});

Then('I should see search results', () => {
  cy.url().should('include', '/search');
  cy.get('#search').should('be.visible');
});

Then('the search results should contain {string}', (expectedText) => {
  cy.get('h3').should('contain.text', expectedText);
});

Then('I should see search statistics', () => {
  cy.get('#result-stats').should('be.visible');
});

Then('I should see the Google logo', () => {
  cy.get('img[alt="Google"]').should('be.visible');
});

Then('I should see the search box', () => {
  cy.get('textarea[name="q"]').should('be.visible');
});

Then('I should see the {string} button', (buttonText) => {
  if (buttonText === 'Google Search') {
    cy.get('input[value="Google Search"]').should('be.visible');
  } else if (buttonText === "I'm Feeling Lucky") {
    cy.get('input[value="I\'m Feeling Lucky"]').should('be.visible');
  }
});

Then('I should be on the search results page', () => {
  cy.url().should('include', '/search');
});