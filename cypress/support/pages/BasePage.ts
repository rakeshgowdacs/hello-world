export abstract class BasePage {
  protected abstract readonly url: string;
  protected abstract readonly selectors: Record<string, string>;

  /**
   * Navigate to the page
   */
  visit(): Cypress.Chainable<Cypress.AUTWindow> {
    return cy.visit(this.url);
  }

  /**
   * Wait for page to load
   */
  waitForPageLoad(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('body').should('be.visible');
  }

  /**
   * Get element by selector name
   */
  getElement(selectorName: string): Cypress.Chainable<JQuery<HTMLElement>> {
    const selector = this.selectors[selectorName];
    if (!selector) {
      throw new Error(`Selector '${selectorName}' not found in page object`);
    }
    return cy.get(selector);
  }

  /**
   * Click element by selector name
   */
  clickElement(selectorName: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getElement(selectorName).click();
  }

  /**
   * Type text into element by selector name
   */
  typeText(selectorName: string, text: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getElement(selectorName).type(text);
  }

  /**
   * Clear and type text into element by selector name
   */
  clearAndType(selectorName: string, text: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getElement(selectorName).clear().type(text);
  }

  /**
   * Check if element is visible by selector name
   */
  isElementVisible(selectorName: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getElement(selectorName).should('be.visible');
  }

  /**
   * Check if element contains text by selector name
   */
  elementContainsText(selectorName: string, text: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getElement(selectorName).should('contain.text', text);
  }

  /**
   * Take screenshot of the page
   */
  takeScreenshot(name?: string): Cypress.Chainable<null> {
    const screenshotName = name || this.constructor.name;
    return cy.screenshot(screenshotName);
  }
}