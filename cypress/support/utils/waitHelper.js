/**
 * Wait Helper utility for Space Automation Framework
 * Provides various wait strategies and timeout management
 */

class WaitHelper {
  /**
   * Wait for element to be visible
   * @param {string} selector - Element selector
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Cypress.Chainable} Cypress chainable
   */
  static waitForVisible(selector, timeout = 10000) {
    cy.log(`⏳ Waiting for element to be visible: ${selector}`);
    return cy.get(selector, { timeout }).should('be.visible');
  }

  /**
   * Wait for element to be clickable
   * @param {string} selector - Element selector
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Cypress.Chainable} Cypress chainable
   */
  static waitForClickable(selector, timeout = 10000) {
    cy.log(`⏳ Waiting for element to be clickable: ${selector}`);
    return cy.get(selector, { timeout })
      .should('be.visible')
      .and('not.be.disabled');
  }

  /**
   * Wait for element to contain text
   * @param {string} selector - Element selector
   * @param {string} text - Expected text
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Cypress.Chainable} Cypress chainable
   */
  static waitForText(selector, text, timeout = 10000) {
    cy.log(`⏳ Waiting for element to contain text: ${selector} -> "${text}"`);
    return cy.get(selector, { timeout }).should('contain.text', text);
  }

  /**
   * Wait for element to disappear
   * @param {string} selector - Element selector
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Cypress.Chainable} Cypress chainable
   */
  static waitForNotVisible(selector, timeout = 10000) {
    cy.log(`⏳ Waiting for element to disappear: ${selector}`);
    return cy.get(selector, { timeout }).should('not.be.visible');
  }

  /**
   * Wait for page to load completely
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Cypress.Chainable} Cypress chainable
   */
  static waitForPageLoad(timeout = 30000) {
    cy.log(`⏳ Waiting for page to load completely`);
    
    return cy.window({ timeout }).should((win) => {
      expect(win.document.readyState).to.equal('complete');
    }).then(() => {
      // Additional wait for any dynamic content
      cy.wait(1000);
    });
  }

  /**
   * Wait for URL to contain specific text
   * @param {string} urlPart - Part of URL to wait for
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Cypress.Chainable} Cypress chainable
   */
  static waitForUrl(urlPart, timeout = 10000) {
    cy.log(`⏳ Waiting for URL to contain: ${urlPart}`);
    return cy.url({ timeout }).should('include', urlPart);
  }

  /**
   * Wait for network request to complete
   * @param {string} url - URL pattern to wait for
   * @param {string} method - HTTP method (GET, POST, etc.)
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Cypress.Chainable} Cypress chainable
   */
  static waitForNetworkRequest(url, method = 'GET', timeout = 10000) {
    cy.log(`⏳ Waiting for network request: ${method} ${url}`);
    
    return cy.intercept(method, url).as('networkRequest').then(() => {
      cy.wait('@networkRequest', { timeout });
    });
  }

  /**
   * Wait for multiple elements to be visible
   * @param {Array} selectors - Array of element selectors
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Cypress.Chainable} Cypress chainable
   */
  static waitForMultipleElements(selectors, timeout = 10000) {
    cy.log(`⏳ Waiting for multiple elements: ${selectors.join(', ')}`);
    
    selectors.forEach(selector => {
      cy.get(selector, { timeout }).should('be.visible');
    });
    
    return cy.wrap(selectors);
  }

  /**
   * Custom wait with retry mechanism
   * @param {function} condition - Function that returns boolean
   * @param {number} maxRetries - Maximum number of retries
   * @param {number} retryInterval - Interval between retries in milliseconds
   * @returns {Cypress.Chainable} Cypress chainable
   */
  static waitWithRetry(condition, maxRetries = 10, retryInterval = 1000) {
    let attempts = 0;
    
    const checkCondition = () => {
      attempts++;
      cy.log(`⏳ Retry attempt ${attempts}/${maxRetries}`);
      
      cy.then(() => {
        const result = condition();
        if (result) {
          return cy.wrap(true);
        } else if (attempts < maxRetries) {
          cy.wait(retryInterval);
          return checkCondition();
        } else {
          throw new Error(`Condition not met after ${maxRetries} attempts`);
        }
      });
    };
    
    return checkCondition();
  }

  /**
   * Wait for element count to match expected
   * @param {string} selector - Element selector
   * @param {number} expectedCount - Expected number of elements
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Cypress.Chainable} Cypress chainable
   */
  static waitForElementCount(selector, expectedCount, timeout = 10000) {
    cy.log(`⏳ Waiting for ${expectedCount} elements matching: ${selector}`);
    return cy.get(selector, { timeout }).should('have.length', expectedCount);
  }

  /**
   * Smart wait that combines multiple wait strategies
   * @param {string} selector - Element selector
   * @param {object} options - Wait options
   * @returns {Cypress.Chainable} Cypress chainable
   */
  static smartWait(selector, options = {}) {
    const defaultOptions = {
      visible: true,
      clickable: false,
      text: null,
      timeout: 10000
    };
    
    const opts = { ...defaultOptions, ...options };
    
    cy.log(`⏳ Smart wait for element: ${selector}`);
    
    let chain = cy.get(selector, { timeout: opts.timeout });
    
    if (opts.visible) {
      chain = chain.should('be.visible');
    }
    
    if (opts.clickable) {
      chain = chain.and('not.be.disabled');
    }
    
    if (opts.text) {
      chain = chain.and('contain.text', opts.text);
    }
    
    return chain;
  }
}

module.exports = WaitHelper;