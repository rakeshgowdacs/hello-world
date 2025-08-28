const BasePage = require('./BasePage');
const { dataManager } = require('../utils/dataManager');

class LoginPage extends BasePage {
  constructor() {
    super();
    this.pageData = dataManager.getLoginData();
  }

  get url() {
    return dataManager.getUrl('login', 'loginPage');
  }

  // ✅ SELECTORS IN PAGE CLASS - Following POM best practices
  // This encapsulates the page structure and makes it easy to maintain
  get selectors() {
    return {
      usernameInput: 'input[name="username"], input#username, input[placeholder*="User" i]',
      passwordInput: 'input[type="password"], input[name="password"], input#password',
      loginButton: 'button[type="submit"], button:contains("Login"), input[type="submit"]',
      errorMessage: '.error-message, .alert-error, [data-testid="error"]',
      successMessage: '.success-message, .alert-success, [data-testid="success"]',
      pageTitle: 'h1, .page-title, [data-testid="page-title"]'
    };
  }

  // ✅ EXPECTED TEXTS IN PAGE CLASS - UI elements that don't change often
  get expectedTexts() {
    return {
      pageTitle: 'Login',
      usernameLabel: 'Username',
      passwordLabel: 'Password',
      loginButtonText: 'Login'
    };
  }

  // ✅ TEST DATA FROM JSON - User credentials, test scenarios, etc.
  // This allows non-technical team members to update test data
  get validUsers() {
    return this.pageData.validUsers;
  }

  get invalidUsers() {
    return this.pageData.invalidUsers;
  }

  /**
   * Navigate to login page
   */
  navigateToLogin() {
    return this.visit();
  }

  /**
   * Enter username
   */
  enterUsername(username) {
    return this.typeText('usernameInput', username);
  }

  /**
   * Enter password (optional)
   */
  enterPassword(password) {
    return this.typeText('passwordInput', password);
  }

  /**
   * Click login button
   */
  clickLoginButton() {
    return this.clickElement('loginButton');
  }

  /**
   * Perform login with username only
   */
  loginWithUsernameOnly(username) {
    this.navigateToLogin();
    this.waitForPageLoad();
    this.enterUsername(username);
    this.clickLoginButton();
  }

  /**
   * Perform login with username and password
   */
  loginWithCredentials(username, password) {
    this.navigateToLogin();
    this.waitForPageLoad();
    this.enterUsername(username);
    this.enterPassword(password);
    this.clickLoginButton();
  }

  /**
   * Check if error message is displayed
   */
  isErrorMessageVisible() {
    return this.isElementVisible('errorMessage');
  }

  /**
   * Check if success message is displayed
   */
  isSuccessMessageVisible() {
    return this.isElementVisible('successMessage');
  }

  /**
   * Get page title
   */
  getPageTitle() {
    return this.getElement('pageTitle');
  }

  /**
   * Verify page title contains expected text
   */
  verifyPageTitle(expectedTitle) {
    return this.elementContainsText('pageTitle', expectedTitle);
  }

  /**
   * Verify page title matches expected from page class
   */
  verifyPageTitleFromClass() {
    const expectedTitle = this.expectedTexts.pageTitle;
    return this.verifyPageTitle(expectedTitle);
  }

  /**
   * Get valid users for testing
   */
  getValidUsers() {
    return this.validUsers;
  }

  /**
   * Get invalid users for testing
   */
  getInvalidUsers() {
    return this.invalidUsers;
  }

  /**
   * Get user by ID
   */
  getUserById(userId) {
    const allUsers = [...this.validUsers, ...this.invalidUsers];
    return allUsers.find(user => user.id === userId);
  }
}

module.exports = LoginPage;