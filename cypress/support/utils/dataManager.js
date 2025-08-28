const { loadJsonFixture } = require('./data');

class DataManager {
  constructor() {
    this.pageDataCache = new Map();
  }

  /**
   * Load page-specific data
   */
  loadPageData(pageName) {
    if (this.pageDataCache.has(pageName)) {
      return this.pageDataCache.get(pageName);
    }

    try {
      const data = loadJsonFixture(`pages/${pageName}Data.json`);
      this.pageDataCache.set(pageName, data);
      return data;
    } catch (error) {
      throw new Error(`Failed to load data for page: ${pageName}. Error: ${error}`);
    }
  }

  /**
   * Get specific data from page data
   */
  getPageData(pageName, dataPath) {
    const pageData = this.loadPageData(pageName);
    const keys = dataPath.split('.');
    let result = pageData;

    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        throw new Error(`Data path '${dataPath}' not found in page '${pageName}'`);
      }
    }

    return result;
  }

  /**
   * Get login data
   */
  getLoginData() {
    return this.loadPageData('login');
  }

  /**
   * Get dashboard data
   */
  getDashboardData() {
    return this.loadPageData('dashboard');
  }

  /**
   * Get common data
   */
  getCommonData() {
    return this.loadPageData('common');
  }

  /**
   * Get order data
   */
  getOrderData() {
    return this.loadPageData('order');
  }

  /**
   * Get valid users for login
   */
  getValidUsers() {
    return this.getPageData('login', 'validUsers');
  }

  /**
   * Get invalid users for login
   */
  getInvalidUsers() {
    return this.getPageData('login', 'invalidUsers');
  }

  /**
   * Get user by ID
   */
  getUserById(userId) {
    const validUsers = this.getValidUsers();
    const invalidUsers = this.getInvalidUsers();
    const allUsers = [...validUsers, ...invalidUsers];
    
    return allUsers.find(user => user.id === userId);
  }

  /**
   * Get selector by name for specific page
   */
  getSelector(pageName, selectorName) {
    return this.getPageData(pageName, `selectors.${selectorName}`);
  }

  /**
   * Get expected text for specific page
   */
  getExpectedText(pageName, textName) {
    return this.getPageData(pageName, `expectedTexts.${textName}`);
  }

  /**
   * Get URL for specific page
   */
  getUrl(pageName, urlName) {
    return this.getPageData(pageName, `urls.${urlName}`);
  }

  /**
   * Get timeout value
   */
  getTimeout(pageName, timeoutName) {
    return this.getPageData(pageName, `timeouts.${timeoutName}`);
  }

  /**
   * Clear cache (useful for testing)
   */
  clearCache() {
    this.pageDataCache.clear();
  }
}

// Export singleton instance
const dataManager = new DataManager();

module.exports = {
  dataManager,
  DataManager
};