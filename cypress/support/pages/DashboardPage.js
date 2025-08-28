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

  // Selectors directly in the page class - following POM best practices
  get selectors() {
    return {
      dashboardTitle: 'h1, .dashboard-title, [data-testid="dashboard-title"]',
      welcomeMessage: '.welcome-message, .user-greeting, [data-testid="welcome"]',
      navigationMenu: '.nav-menu, .sidebar, [data-testid="navigation"]',
      logoutButton: '.logout-btn, .signout-btn, [data-testid="logout"]',
      userProfile: '.user-profile, .profile-info, [data-testid="profile"]',
      quickActions: '.quick-actions, .action-buttons, [data-testid="actions"]'
    };
  }

  // Expected texts directly in the page class
  get expectedTexts() {
    return {
      dashboardTitle: 'Dashboard',
      welcomeMessage: 'Welcome',
      navigationMenu: 'Navigation Menu',
      userProfile: 'User Profile',
      quickActions: 'Quick Actions'
    };
  }

  // Navigation items directly in the page class
  get navigationItems() {
    return [
      'Dashboard',
      'Users',
      'Reports',
      'Settings',
      'Profile'
    ];
  }

  // Quick action buttons directly in the page class
  get quickActionButtons() {
    return [
      'Create User',
      'Generate Report',
      'View Analytics',
      'Export Data'
    ];
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
   * Verify dashboard title matches expected from page class
   */
  verifyDashboardTitleFromClass() {
    const expectedTitle = this.expectedTexts.dashboardTitle;
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
   * Verify all navigation items are present
   */
  verifyNavigationItems() {
    this.navigationItems.forEach(item => {
      cy.contains(item).should('be.visible');
    });
  }

  /**
   * Verify all quick action buttons are present
   */
  verifyQuickActionButtons() {
    this.quickActionButtons.forEach(button => {
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