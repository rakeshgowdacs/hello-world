import { BasePage } from './BasePage';
import { dataManager } from '../utils/dataManager';

export class LoginPage extends BasePage {
  private readonly pageData = dataManager.getLoginData();

  protected get url(): string {
    return dataManager.getUrl('login', 'loginPage');
  }

  protected get selectors(): Record<string, string> {
    return this.pageData.selectors;
  }

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

  /**
   * Verify page title matches expected from data
   */
  verifyPageTitleFromData(): Cypress.Chainable<JQuery<HTMLElement>> {
    const expectedTitle = dataManager.getExpectedText('login', 'pageTitle');
    return this.verifyPageTitle(expectedTitle);
  }

  /**
   * Get valid users for testing
   */
  getValidUsers(): any[] {
    return dataManager.getValidUsers();
  }

  /**
   * Get invalid users for testing
   */
  getInvalidUsers(): any[] {
    return dataManager.getInvalidUsers();
  }

  /**
   * Get user by ID
   */
  getUserById(userId: string): any {
    return dataManager.getUserById(userId);
  }
}