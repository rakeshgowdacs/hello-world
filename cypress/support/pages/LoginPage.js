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

  get selectors() {
    return this.pageData.selectors;
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
   * Verify page title matches expected from data
   */
  verifyPageTitleFromData() {
    const expectedTitle = dataManager.getExpectedText('login', 'pageTitle');
    return this.verifyPageTitle(expectedTitle);
  }

  /**
   * Get valid users for testing
   */
  getValidUsers() {
    return dataManager.getValidUsers();
  }

  /**
   * Get invalid users for testing
   */
  getInvalidUsers() {
    return dataManager.getInvalidUsers();
  }

  /**
   * Get user by ID
   */
  getUserById(userId) {
    return dataManager.getUserById(userId);
  }
}

module.exports = LoginPage;