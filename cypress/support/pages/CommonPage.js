const BasePage = require('./BasePage');
const { dataManager } = require('../utils/dataManager');

class CommonPage extends BasePage {
  constructor() {
    super();
    this.pageData = dataManager.getCommonData();
  }

  get url() {
    return '/';
  }

  get selectors() {
    return this.pageData.commonSelectors;
  }

  /**
   * Wait for loading to complete
   */
  waitForLoadingToComplete() {
    return cy.get(this.selectors.loadingSpinner).should('not.exist');
  }

  /**
   * Check if notification is visible
   */
  isNotificationVisible() {
    return this.isElementVisible('notification');
  }

  /**
   * Verify notification contains expected text
   */
  verifyNotificationText(expectedText) {
    return this.elementContainsText('notification', expectedText);
  }

  /**
   * Check if modal is visible
   */
  isModalVisible() {
    return this.isElementVisible('modal');
  }

  /**
   * Close modal
   */
  closeModal() {
    return this.clickElement('closeButton');
  }

  /**
   * Confirm action in modal
   */
  confirmAction() {
    return this.clickElement('confirmButton');
  }

  /**
   * Cancel action in modal
   */
  cancelAction() {
    return this.clickElement('cancelButton');
  }

  /**
   * Wait for element to be visible with timeout
   */
  waitForElement(selectorName, timeout) {
    const defaultTimeout = timeout || dataManager.getPageData('common', 'timeouts.default');
    return this.getElement(selectorName).should('be.visible', { timeout: defaultTimeout });
  }

  /**
   * Wait for element to contain text with timeout
   */
  waitForElementText(selectorName, text, timeout) {
    const defaultTimeout = timeout || dataManager.getPageData('common', 'timeouts.default');
    return this.getElement(selectorName).should('contain.text', text, { timeout: defaultTimeout });
  }

  /**
   * Scroll element into view
   */
  scrollToElement(selectorName) {
    return this.getElement(selectorName).scrollIntoView();
  }

  /**
   * Hover over element
   */
  hoverOverElement(selectorName) {
    return this.getElement(selectorName).trigger('mouseover');
  }

  /**
   * Get default timeout
   */
  getDefaultTimeout() {
    return dataManager.getPageData('common', 'timeouts.default');
  }

  /**
   * Get short timeout
   */
  getShortTimeout() {
    return dataManager.getPageData('common', 'timeouts.short');
  }

  /**
   * Get long timeout
   */
  getLongTimeout() {
    return dataManager.getPageData('common', 'timeouts.long');
  }

  /**
   * Get page load timeout
   */
  getPageLoadTimeout() {
    return dataManager.getPageData('common', 'timeouts.pageLoad');
  }

  /**
   * Get retry attempts for default operations
   */
  getDefaultRetryAttempts() {
    return dataManager.getPageData('common', 'timeouts.retryAttempts.default');
  }

  /**
   * Get retry attempts for network operations
   */
  getNetworkRetryAttempts() {
    return dataManager.getPageData('common', 'timeouts.retryAttempts.network');
  }

  /**
   * Get retry attempts for UI operations
   */
  getUIRetryAttempts() {
    return dataManager.getPageData('common', 'timeouts.retryAttempts.ui');
  }

  /**
   * Get viewport size for specific device
   */
  getViewportSize(device) {
    return dataManager.getPageData('common', `viewportSizes.${device}`);
  }

  /**
   * Set viewport size for specific device
   */
  setViewportSize(device) {
    const size = this.getViewportSize(device);
    cy.viewport(size.width, size.height);
  }
}

module.exports = CommonPage;