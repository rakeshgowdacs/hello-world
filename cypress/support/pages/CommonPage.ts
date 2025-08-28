import { BasePage } from './BasePage';
import { dataManager } from '../utils/dataManager';

export class CommonPage extends BasePage {
  private readonly pageData = dataManager.getCommonData();

  protected get url(): string {
    return '/';
  }

  protected get selectors(): Record<string, string> {
    return this.pageData.commonSelectors;
  }

  /**
   * Wait for loading to complete
   */
  waitForLoadingToComplete(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.selectors.loadingSpinner).should('not.exist');
  }

  /**
   * Check if notification is visible
   */
  isNotificationVisible(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.isElementVisible('notification');
  }

  /**
   * Verify notification contains expected text
   */
  verifyNotificationText(expectedText: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.elementContainsText('notification', expectedText);
  }

  /**
   * Check if modal is visible
   */
  isModalVisible(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.isElementVisible('modal');
  }

  /**
   * Close modal
   */
  closeModal(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.clickElement('closeButton');
  }

  /**
   * Confirm action in modal
   */
  confirmAction(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.clickElement('confirmButton');
  }

  /**
   * Cancel action in modal
   */
  cancelAction(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.clickElement('cancelButton');
  }

  /**
   * Wait for element to be visible with timeout
   */
  waitForElement(selectorName: string, timeout?: number): Cypress.Chainable<JQuery<HTMLElement>> {
    const defaultTimeout = timeout || dataManager.getPageData('common', 'timeouts.default');
    return this.getElement(selectorName).should('be.visible', { timeout: defaultTimeout });
  }

  /**
   * Wait for element to contain text with timeout
   */
  waitForElementText(selectorName: string, text: string, timeout?: number): Cypress.Chainable<JQuery<HTMLElement>> {
    const defaultTimeout = timeout || dataManager.getPageData('common', 'timeouts.default');
    return this.getElement(selectorName).should('contain.text', text, { timeout: defaultTimeout });
  }

  /**
   * Scroll element into view
   */
  scrollToElement(selectorName: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getElement(selectorName).scrollIntoView();
  }

  /**
   * Hover over element
   */
  hoverOverElement(selectorName: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getElement(selectorName).trigger('mouseover');
  }

  /**
   * Get default timeout
   */
  getDefaultTimeout(): number {
    return dataManager.getPageData('common', 'timeouts.default');
  }

  /**
   * Get short timeout
   */
  getShortTimeout(): number {
    return dataManager.getPageData('common', 'timeouts.short');
  }

  /**
   * Get long timeout
   */
  getLongTimeout(): number {
    return dataManager.getPageData('common', 'timeouts.long');
  }

  /**
   * Get page load timeout
   */
  getPageLoadTimeout(): number {
    return dataManager.getPageData('common', 'timeouts.pageLoad');
  }

  /**
   * Get retry attempts for default operations
   */
  getDefaultRetryAttempts(): number {
    return dataManager.getPageData('common', 'retryAttempts.default');
  }

  /**
   * Get retry attempts for network operations
   */
  getNetworkRetryAttempts(): number {
    return dataManager.getPageData('common', 'retryAttempts.network');
  }

  /**
   * Get retry attempts for UI operations
   */
  getUIRetryAttempts(): number {
    return dataManager.getPageData('common', 'retryAttempts.ui');
  }

  /**
   * Get viewport size for specific device
   */
  getViewportSize(device: 'desktop' | 'tablet' | 'mobile'): { width: number; height: number } {
    return dataManager.getPageData('common', `viewportSizes.${device}`);
  }

  /**
   * Set viewport size for specific device
   */
  setViewportSize(device: 'desktop' | 'tablet' | 'mobile'): void {
    const size = this.getViewportSize(device);
    cy.viewport(size.width, size.height);
  }
}