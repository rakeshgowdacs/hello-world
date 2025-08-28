/// <reference types="cypress" />

Cypress.Commands.add("step", (name, fn) => {
  if (typeof (cy).allure === "function") {
    (cy).allure().step(name);
  }
  const result = fn();
  cy.screenshot(name.replace(/\s+/g, '-').toLowerCase());
  return result;
});

Cypress.Commands.add("login", (username, password) => {
  cy.step("Visit login page", () => {
    cy.visit("/");
  });
  cy.step("Enter username", () => {
    cy.get('input[name="username"], input#username, input[placeholder*="User" i]').first().type(username, { log: true });
  });
  if (password) {
    cy.step("Enter password", () => {
      cy.get('input[type="password"], input[name="password"], input#password').first().type(password, { log: true });
    });
  }
  cy.step("Submit login", () => {
    cy.get('button[type="submit"], button:contains("Login"), input[type="submit"]').first().click();
  });
});

// New command for easy page object instantiation
Cypress.Commands.add("usePageObject", (pageClass) => {
  return new pageClass();
});