class BasePage {
  constructor() {
    if (this.constructor === BasePage) {
      throw new Error("BasePage is abstract and cannot be instantiated");
    }
  }

  /**
   * Navigate to the page
   */
  visit() {
    return cy.visit(this.url);
  }

  /**
   * Wait for page to load
   */
  waitForPageLoad() {
    return cy.get('body').should('be.visible');
  }

  /**
   * Get element by selector name
   */
  getElement(selectorName) {
    const selector = this.selectors[selectorName];
    if (!selector) {
      throw new Error(`Selector '${selectorName}' not found in page object`);
    }
    return cy.get(selector);
  }

  /**
   * Click element by selector name
   */
  clickElement(selectorName) {
    return this.getElement(selectorName).click();
  }

  /**
   * Type text into element by selector name
   */
  typeText(selectorName, text) {
    return this.getElement(selectorName).type(text);
  }

  /**
   * Clear and type text into element by selector name
   */
  clearAndType(selectorName, text) {
    return this.getElement(selectorName).clear().type(text);
  }

  /**
   * Check if element is visible by selector name
   */
  isElementVisible(selectorName) {
    return this.getElement(selectorName).should('be.visible');
  }

  /**
   * Check if element contains text by selector name
   */
  elementContainsText(selectorName, text) {
    return this.getElement(selectorName).should('contain.text', text);
  }

  /**
   * Take screenshot of the page
   */
  takeScreenshot(name) {
    const screenshotName = name || this.constructor.name;
    return cy.screenshot(screenshotName);
  }
}

module.exports = BasePage;