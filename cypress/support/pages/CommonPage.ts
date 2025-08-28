import { BasePage } from './BasePage';

export class CommonPage extends BasePage {
  protected readonly url = '/';
  protected readonly selectors = {
    loadingSpinner: '.loading, .spinner, [data-testid="loading"]',
    notification: '.notification, .toast, [data-testid="notification"]',
    modal: '.modal, .dialog, [data-testid="modal"]',
    closeButton: '.close, .close-btn, [data-testid="close"]',
    confirmButton: '.confirm, .ok-btn, [data-testid="confirm"]',
    cancelButton: '.cancel, .cancel-btn, [data-testid="cancel"]'
  };

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
  waitForElement(selectorName: string, timeout: number = 10000): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getElement(selectorName).should('be.visible', { timeout });
  }

  /**
   * Wait for element to contain text with timeout
   */
  waitForElementText(selectorName: string, text: string, timeout: number = 10000): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getElement(selectorName).should('contain.text', text, { timeout });
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
}