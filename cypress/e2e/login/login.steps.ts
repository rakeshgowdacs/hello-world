import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("I am on the login page", () => {
  cy.visit("/");
});

When("I login with user id {string} and no password", (userId: string) => {
  cy.login(userId);
});

Then("I should see the dashboard", () => {
  // Generic assertion heuristics; adapt selectors as app evolves
  cy.contains(/dashboard|home|welcome/i, { timeout: 20000 }).should("be.visible");
});

