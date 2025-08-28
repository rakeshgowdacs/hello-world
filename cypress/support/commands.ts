/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      step(name: string, fn: () => void | Chainable): Chainable;
      login(username: string, password?: string): Chainable;
      usePageObject<T>(pageClass: new () => T): T;
    }
  }
}

Cypress.Commands.add("step", (name: string, fn: () => void | Cypress.Chainable) => {
  if (typeof (cy as any).allure === "function") {
    (cy as any).allure().step(name);
  }
  const result = fn();
  cy.screenshot(Cypress._.kebabCase(name));
  return result as Cypress.Chainable;
});

Cypress.Commands.add("login", (username: string, password?: string) => {
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
Cypress.Commands.add("usePageObject", <T>(pageClass: new () => T): T => {
  return new pageClass();
});

export {};

