import { BasePage } from './BasePage';
import { dataManager } from '../utils/dataManager';

export class DashboardPage extends BasePage {
  private readonly pageData = dataManager.getDashboardData();

  protected get url(): string {
    return dataManager.getUrl('dashboard', 'dashboardPage');
  }

  protected get selectors(): Record<string, string> {
    return this.pageData.selectors;
  }

  /**
   * Verify dashboard is loaded
   */
  verifyDashboardLoaded(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.waitForPageLoad();
  }

  /**
   * Check if dashboard title is visible
   */
  isDashboardTitleVisible(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.isElementVisible('dashboardTitle');
  }

  /**
   * Verify dashboard title contains expected text
   */
  verifyDashboardTitle(expectedTitle: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.elementContainsText('dashboardTitle', expectedTitle);
  }

  /**
   * Verify dashboard title matches expected from data
   */
  verifyDashboardTitleFromData(): Cypress.Chainable<JQuery<HTMLElement>> {
    const expectedTitle = dataManager.getExpectedText('dashboard', 'dashboardTitle');
    return this.verifyDashboardTitle(expectedTitle);
  }

  /**
   * Check if welcome message is displayed
   */
  isWelcomeMessageVisible(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.isElementVisible('welcomeMessage');
  }

  /**
   * Verify welcome message contains username
   */
  verifyWelcomeMessageContainsUsername(username: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.elementContainsText('welcomeMessage', username);
  }

  /**
   * Check if navigation menu is visible
   */
  isNavigationMenuVisible(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.isElementVisible('navigationMenu');
  }

  /**
   * Click logout button
   */
  clickLogout(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.clickElement('logoutButton');
  }

  /**
   * Check if user profile section is visible
   */
  isUserProfileVisible(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.isElementVisible('userProfile');
  }

  /**
   * Check if quick actions are visible
   */
  areQuickActionsVisible(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.isElementVisible('quickActions');
  }

  /**
   * Verify user is successfully logged in
   */
  verifySuccessfulLogin(username: string): void {
    this.verifyDashboardLoaded();
    this.isDashboardTitleVisible();
    this.isWelcomeMessageVisible();
    this.verifyWelcomeMessageContainsUsername(username);
    this.isNavigationMenuVisible();
  }

  /**
   * Get navigation items from data
   */
  getNavigationItems(): string[] {
    return dataManager.getPageData('dashboard', 'navigationItems');
  }

  /**
   * Get quick action buttons from data
   */
  getQuickActionButtons(): string[] {
    return dataManager.getPageData('dashboard', 'quickActionButtons');
  }

  /**
   * Verify all navigation items are present
   */
  verifyNavigationItems(): void {
    const expectedItems = this.getNavigationItems();
    expectedItems.forEach(item => {
      cy.contains(item).should('be.visible');
    });
  }

  /**
   * Verify all quick action buttons are present
   */
  verifyQuickActionButtons(): void {
    const expectedButtons = this.getQuickActionButtons();
    expectedButtons.forEach(button => {
      cy.contains(button).should('be.visible');
    });
  }

  /**
   * Get timeout for page load
   */
  getPageLoadTimeout(): number {
    return dataManager.getTimeout('dashboard', 'pageLoad');
  }
}