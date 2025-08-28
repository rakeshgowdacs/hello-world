import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  protected readonly url = '/';
  protected readonly selectors = {
    usernameInput: 'input[name="username"], input#username, input[placeholder*="User" i]',
    passwordInput: 'input[type="password"], input[name="password"], input#password',
    loginButton: 'button[type="submit"], button:contains("Login"), input[type="submit"]',
    errorMessage: '.error-message, .alert-error, [data-testid="error"]',
    successMessage: '.success-message, .alert-success, [data-testid="success"]',
    pageTitle: 'h1, .page-title, [data-testid="page-title"]'
  };

  /**
   * Navigate to login page
   */
  navigateToLogin(): Cypress.Chainable<Cypress.AUTWindow> {
    return this.visit();
  }

  /**
   * Enter username
   */
  enterUsername(username: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.typeText('usernameInput', username);
  }

  /**
   * Enter password (optional)
   */
  enterPassword(password: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.typeText('passwordInput', password);
  }

  /**
   * Click login button
   */
  clickLoginButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.clickElement('loginButton');
  }

  /**
   * Perform login with username only
   */
  loginWithUsernameOnly(username: string): void {
    this.navigateToLogin();
    this.waitForPageLoad();
    this.enterUsername(username);
    this.clickLoginButton();
  }

  /**
   * Perform login with username and password
   */
  loginWithCredentials(username: string, password: string): void {
    this.navigateToLogin();
    this.waitForPageLoad();
    this.enterUsername(username);
    this.enterPassword(password);
    this.clickLoginButton();
  }

  /**
   * Check if error message is displayed
   */
  isErrorMessageVisible(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.isElementVisible('errorMessage');
  }

  /**
   * Check if success message is displayed
   */
  isSuccessMessageVisible(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.isElementVisible('successMessage');
  }

  /**
   * Get page title
   */
  getPageTitle(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getElement('pageTitle');
  }

  /**
   * Verify page title contains expected text
   */
  verifyPageTitle(expectedTitle: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.elementContainsText('pageTitle', expectedTitle);
  }
}