import "@shelex/cypress-allure-plugin";
import "./commands";
import { testContext } from "./utils/testContext";

beforeEach(() => {
  Cypress.on("log:added", (log) => {
    if (log.displayName && typeof cy.allure === "function") {
      // Lightweight step attachment for visibility in Allure
      cy.allure().step(`${log.displayName}: ${log.message || ""}`);
    }
  });
});

afterEach(function () {
  // Screenshot after each test step can be excessive; take at end of test
  // For per-step, we'd need to hook custom commands. We'll add a helper command.
  cy.screenshot({ capture: "runner" });
});

// Clear test context between tests
beforeEach(() => {
  testContext.clearAll();
});

