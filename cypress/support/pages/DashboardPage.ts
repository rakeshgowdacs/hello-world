import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  protected readonly url = '/dashboard'; // Adjust based on actual app routing
  protected readonly selectors = {
    dashboardTitle: 'h1, .dashboard-title, [data-testid="dashboard-title"]',
    welcomeMessage: '.welcome-message, .user-greeting, [data-testid="welcome"]',
    navigationMenu: '.nav-menu, .sidebar, [data-testid="navigation"]',
    logoutButton: '.logout-btn, .signout-btn, [data-testid="logout"]',
    userProfile: '.user-profile, .profile-info, [data-testid="profile"]',
    quickActions: '.quick-actions, .action-buttons, [data-testid="actions"]'
  };

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
}