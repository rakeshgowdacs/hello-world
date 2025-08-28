const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");
const { LoginPage, DashboardPage } = require("../../support/pages");
const { dataManager } = require("../../support/utils/dataManager");
const { testContext } = require("../../support/utils/testContext");
const { AssertionHelper } = require("../../support/utils/assertionHelper");

const loginPage = new LoginPage();
const dashboardPage = new DashboardPage();

Given("I am on the login page", () => {
  loginPage.navigateToLogin();
  
  // Store expected page title from data
  const expectedTitle = dataManager.getExpectedText('login', 'pageTitle');
  testContext.set('login_page_title_expected', expectedTitle);
  
  // Get actual page title and store for assertion
  loginPage.getPageTitle().then(($title) => {
    const actualTitle = $title.text();
    testContext.set('login_page_title_actual', actualTitle);
    
    // Assert immediately using helper
    AssertionHelper.assertAndStore('login_page_title', actualTitle, expectedTitle);
  });
});

When("I login with user id {string} and no password", (userId) => {
  const user = dataManager.getUserById(userId);
  if (!user) {
    throw new Error(`User with ID '${userId}' not found in test data`);
  }
  
  // Store user data for later use
  testContext.set('current_user', user);
  
  if (user.password === null) {
    loginPage.loginWithUsernameOnly(userId);
  } else {
    loginPage.loginWithCredentials(userId, user.password);
  }
});

Then("I should see the dashboard", () => {
  // Get stored user data
  const currentUser = testContext.get('current_user');
  
  // Store expected dashboard title
  const expectedDashboardTitle = dataManager.getExpectedText('dashboard', 'dashboardTitle');
  testContext.set('dashboard_title_expected', expectedDashboardTitle);
  
  // Verify dashboard and store actual title
  dashboardPage.verifyDashboardLoaded();
  dashboardPage.getPageTitle().then(($title) => {
    const actualDashboardTitle = $title.text();
    testContext.set('dashboard_title_actual', actualDashboardTitle);
    
    // Assert dashboard title matches expected
    AssertionHelper.assertAndStore('dashboard_title', actualDashboardTitle, expectedDashboardTitle);
  });
  
  // Complete dashboard verification
  dashboardPage.verifySuccessfulLogin(currentUser.id);
});

// Data-driven test scenarios
Given("I have valid login credentials", () => {
  const validUsers = dataManager.getValidUsers();
  expect(validUsers.length).to.be.greaterThan(0);
  
  // Store valid users for later use
  testContext.set('valid_users', validUsers);
});

When("I login with valid credentials", () => {
  const validUsers = testContext.get('valid_users');
  const validUser = validUsers[0]; // Use first valid user
  
  // Store current user
  testContext.set('current_user', validUser);
  
  if (validUser.password === null) {
    loginPage.loginWithUsernameOnly(validUser.id);
  } else {
    loginPage.loginWithCredentials(validUser.id, validUser.password);
  }
});

Then("I should be successfully logged in", () => {
  const currentUser = testContext.get('current_user');
  dashboardPage.verifySuccessfulLogin(currentUser.id);
});

Given("I have invalid login credentials", () => {
  const invalidUsers = dataManager.getInvalidUsers();
  expect(invalidUsers.length).to.be.greaterThan(0);
  
  // Store invalid users for later use
  testContext.set('invalid_users', invalidUsers);
});

When("I login with invalid credentials", () => {
  const invalidUsers = testContext.get('invalid_users');
  const invalidUser = invalidUsers[0]; // Use first invalid user
  
  // Store current user
  testContext.set('current_user', invalidUser);
  
  if (invalidUser.password === null) {
    loginPage.loginWithUsernameOnly(invalidUser.id);
  } else {
    loginPage.loginWithCredentials(invalidUser.id, invalidUser.password);
  }
});

Then("I should see an error message", () => {
  const currentUser = testContext.get('current_user');
  
  // Store expected error message
  const expectedErrorMessage = currentUser.expectedErrorMessage;
  testContext.set('error_message_expected', expectedErrorMessage);
  
  // Check if error message is visible and store actual text
  loginPage.isErrorMessageVisible().then(($error) => {
    const actualErrorMessage = $error.text();
    testContext.set('error_message_actual', actualErrorMessage);
    
    // Assert error message contains expected text
    AssertionHelper.assertAndStore('error_message', actualErrorMessage, expectedErrorMessage);
  });
});