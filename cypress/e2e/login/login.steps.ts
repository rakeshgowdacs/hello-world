import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { LoginPage, DashboardPage } from "@support/pages";

const loginPage = new LoginPage();
const dashboardPage = new DashboardPage();

Given("I am on the login page", () => {
  loginPage.navigateToLogin();
});

When("I login with user id {string} and no password", (userId: string) => {
  loginPage.loginWithUsernameOnly(userId);
});

Then("I should see the dashboard", () => {
  dashboardPage.verifySuccessfulLogin("csra");
});

