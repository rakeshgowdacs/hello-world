import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { LoginPage, DashboardPage } from "@support/pages";
import { dataManager } from "@support/utils/dataManager";

const loginPage = new LoginPage();
const dashboardPage = new DashboardPage();

Given("I am on the login page", () => {
  loginPage.navigateToLogin();
  loginPage.verifyPageTitleFromData();
});

When("I login with user id {string} and no password", (userId: string) => {
  const user = dataManager.getUserById(userId);
  if (!user) {
    throw new Error(`User with ID '${userId}' not found in test data`);
  }
  
  if (user.password === null) {
    loginPage.loginWithUsernameOnly(userId);
  } else {
    loginPage.loginWithCredentials(userId, user.password);
  }
});

Then("I should see the dashboard", () => {
  dashboardPage.verifySuccessfulLogin("csra");
});

// Data-driven test scenarios
Given("I have valid login credentials", () => {
  const validUsers = dataManager.getValidUsers();
  expect(validUsers.length).to.be.greaterThan(0);
});

When("I login with valid credentials", () => {
  const validUser = dataManager.getValidUsers()[0]; // Use first valid user
  if (validUser.password === null) {
    loginPage.loginWithUsernameOnly(validUser.id);
  } else {
    loginPage.loginWithCredentials(validUser.id, validUser.password);
  }
});

Then("I should be successfully logged in", () => {
  dashboardPage.verifySuccessfulLogin("csra");
});

Given("I have invalid login credentials", () => {
  const invalidUsers = dataManager.getInvalidUsers();
  expect(invalidUsers.length).to.be.greaterThan(0);
});

When("I login with invalid credentials", () => {
  const invalidUser = dataManager.getInvalidUsers()[0]; // Use first invalid user
  if (invalidUser.password === null) {
    loginPage.loginWithUsernameOnly(invalidUser.id);
  } else {
    loginPage.loginWithCredentials(invalidUser.id, invalidUser.password);
  }
});

Then("I should see an error message", () => {
  loginPage.isErrorMessageVisible();
});

