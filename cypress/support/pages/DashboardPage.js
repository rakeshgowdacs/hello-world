const BasePage = require('./BasePage');
const { dataManager } = require('../utils/dataManager');

class DashboardPage extends BasePage {
  constructor() {
    super();
    this.pageData = dataManager.getDashboardData();
  }

  get url() {
    return dataManager.getUrl('dashboard', 'dashboardPage');
  }

  get selectors() {
    return this.pageData.selectors;
  }

  /**
   * Verify dashboard is loaded
   */
  verifyDashboardLoaded() {
    return this.waitForPageLoad();
  }

  /**
   * Check if dashboard title is visible
   */
  isDashboardTitleVisible() {
    return this.isElementVisible('dashboardTitle');
  }

  /**
   * Verify dashboard title contains expected text
   */
  verifyDashboardTitle(expectedTitle) {
    return this.elementContainsText('dashboardTitle', expectedTitle);
  }

  /**
   * Verify dashboard title matches expected from data
   */
  verifyDashboardTitleFromData() {
    const expectedTitle = dataManager.getExpectedText('dashboard', 'dashboardTitle');
    return this.verifyDashboardTitle(expectedTitle);
  }

  /**
   * Check if welcome message is displayed
   */
  isWelcomeMessageVisible() {
    return this.isElementVisible('welcomeMessage');
  }

  /**
   * Verify welcome message contains username
   */
  verifyWelcomeMessageContainsUsername(username) {
    return this.elementContainsText('welcomeMessage', username);
  }

  /**
   * Check if navigation menu is visible
   */
  isNavigationMenuVisible() {
    return this.isElementVisible('navigationMenu');
  }

  /**
   * Click logout button
   */
  clickLogout() {
    return this.clickElement('logoutButton');
  }

  /**
   * Check if user profile section is visible
   */
  isUserProfileVisible() {
    return this.isElementVisible('userProfile');
  }

  /**
   * Check if quick actions are visible
   */
  areQuickActionsVisible() {
    return this.isElementVisible('quickActions');
  }

  /**
   * Verify user is successfully logged in
   */
  verifySuccessfulLogin(username) {
    this.verifyDashboardLoaded();
    this.isDashboardTitleVisible();
    this.isWelcomeMessageVisible();
    this.verifyWelcomeMessageContainsUsername(username);
    this.isNavigationMenuVisible();
  }

  /**
   * Get navigation items from data
   */
  getNavigationItems() {
    return dataManager.getPageData('dashboard', 'navigationItems');
  }

  /**
   * Get quick action buttons from data
   */
  getQuickActionButtons() {
    return dataManager.getPageData('dashboard', 'quickActionButtons');
  }

  /**
   * Verify all navigation items are present
   */
  verifyNavigationItems() {
    const expectedItems = this.getNavigationItems();
    expectedItems.forEach(item => {
      cy.contains(item).should('be.visible');
    });
  }

  /**
   * Verify all quick action buttons are present
   */
  verifyQuickActionButtons() {
    const expectedButtons = this.getQuickActionButtons();
    expectedButtons.forEach(button => {
      cy.contains(button).should('be.visible');
    });
  }

  /**
   * Get timeout for page load
   */
  getPageLoadTimeout() {
    return dataManager.getTimeout('dashboard', 'pageLoad');
  }
}

module.exports = DashboardPage;