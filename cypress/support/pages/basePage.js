/**
 * Base Page class for Space Automation Framework
 * Contains common methods and properties shared across all pages
 */

const Logger = require('../utils/logger');
const ScreenshotHelper = require('../utils/screenshotHelper');
const WaitHelper = require('../utils/waitHelper');

class BasePage {
  constructor() {
    this.pageLoadTimeout = Cypress.env('PAGE_LOAD_TIMEOUT') || 30000;
    this.elementTimeout = Cypress.env('ELEMENT_TIMEOUT') || 10000;
  }

  /**
   * Navigate to a specific URL
   * @param {string} url - URL to navigate to
   * @param {string} pageName - Name of the page for logging
   */
  visit(url, pageName = '') {
    Logger.navigation(url, pageName);
    
    cy.allure().step(`Navigate to ${pageName || url}`, () => {
      cy.visit(url, {
        timeout: this.pageLoadTimeout,
        failOnStatusCode: false
      });
      
      // Wait for page to load
      WaitHelper.waitForPageLoad();
      
      // Take screenshot after navigation
      ScreenshotHelper.captureStepScreenshot(`navigation_to_${pageName || 'page'}`);
    });
    
    Logger.success(`Successfully navigated to ${pageName || url}`);
    return this;
  }

  /**
   * Click on an element
   * @param {string} selector - Element selector
   * @param {string} elementName - Name of the element for logging
   * @param {object} options - Click options
   */
  click(selector, elementName = '', options = {}) {
    const logName = elementName || selector;
    Logger.info(`Clicking on ${logName}`);
    
    cy.allure().step(`Click on ${logName}`, () => {
      WaitHelper.waitForClickable(selector, this.elementTimeout);
      cy.get(selector).click(options);
      
      // Take screenshot after click
      ScreenshotHelper.captureStepScreenshot(`click_${logName.replace(/\s+/g, '_').toLowerCase()}`);
    });
    
    Logger.success(`Successfully clicked on ${logName}`);
    return this;
  }

  /**
   * Type text into an input field
   * @param {string} selector - Element selector
   * @param {string} text - Text to type
   * @param {string} fieldName - Name of the field for logging
   * @param {object} options - Type options
   */
  type(selector, text, fieldName = '', options = {}) {
    const logName = fieldName || selector;
    Logger.info(`Typing '${text}' into ${logName}`);
    
    cy.allure().step(`Type '${text}' into ${logName}`, () => {
      WaitHelper.waitForVisible(selector, this.elementTimeout);
      
      const defaultOptions = { clear: true, delay: 50 };
      const mergedOptions = { ...defaultOptions, ...options };
      
      cy.get(selector).type(text, mergedOptions);
      
      // Take screenshot after typing
      ScreenshotHelper.captureStepScreenshot(`type_${logName.replace(/\s+/g, '_').toLowerCase()}`);
    });
    
    Logger.success(`Successfully typed '${text}' into ${logName}`);
    return this;
  }

  /**
   * Get text from an element
   * @param {string} selector - Element selector
   * @param {string} elementName - Name of the element for logging
   * @returns {Cypress.Chainable} Cypress chainable with text
   */
  getText(selector, elementName = '') {
    const logName = elementName || selector;
    Logger.info(`Getting text from ${logName}`);
    
    return cy.allure().step(`Get text from ${logName}`, () => {
      WaitHelper.waitForVisible(selector, this.elementTimeout);
      
      return cy.get(selector).invoke('text').then((text) => {
        Logger.success(`Got text from ${logName}: '${text.trim()}'`);
        return text.trim();
      });
    });
  }

  /**
   * Verify element is visible
   * @param {string} selector - Element selector
   * @param {string} elementName - Name of the element for logging
   */
  verifyElementVisible(selector, elementName = '') {
    const logName = elementName || selector;
    Logger.info(`Verifying ${logName} is visible`);
    
    cy.allure().step(`Verify ${logName} is visible`, () => {
      cy.get(selector, { timeout: this.elementTimeout }).should('be.visible');
      
      // Take screenshot of visible element
      ScreenshotHelper.captureElementScreenshot(selector, logName);
    });
    
    Logger.success(`${logName} is visible`);
    return this;
  }

  /**
   * Verify element contains text
   * @param {string} selector - Element selector
   * @param {string} expectedText - Expected text
   * @param {string} elementName - Name of the element for logging
   */
  verifyElementText(selector, expectedText, elementName = '') {
    const logName = elementName || selector;
    Logger.info(`Verifying ${logName} contains text: '${expectedText}'`);
    
    cy.allure().step(`Verify ${logName} contains '${expectedText}'`, () => {
      WaitHelper.waitForText(selector, expectedText, this.elementTimeout);
      
      // Take screenshot of element with text
      ScreenshotHelper.captureElementScreenshot(selector, `${logName}_with_text`);
    });
    
    Logger.success(`${logName} contains expected text: '${expectedText}'`);
    return this;
  }

  /**
   * Wait for element and perform action
   * @param {string} selector - Element selector
   * @param {function} action - Action to perform
   * @param {string} actionName - Name of the action for logging
   */
  waitAndPerform(selector, action, actionName = 'action') {
    Logger.info(`Waiting for element and performing ${actionName}: ${selector}`);
    
    cy.allure().step(`Wait and perform ${actionName}`, () => {
      WaitHelper.waitForVisible(selector, this.elementTimeout);
      action();
      
      // Take screenshot after action
      ScreenshotHelper.captureStepScreenshot(`${actionName.replace(/\s+/g, '_').toLowerCase()}_completed`);
    });
    
    Logger.success(`Successfully performed ${actionName}`);
    return this;
  }

  /**
   * Scroll to element
   * @param {string} selector - Element selector
   * @param {string} elementName - Name of the element for logging
   */
  scrollToElement(selector, elementName = '') {
    const logName = elementName || selector;
    Logger.info(`Scrolling to ${logName}`);
    
    cy.allure().step(`Scroll to ${logName}`, () => {
      cy.get(selector).scrollIntoView();
      
      // Take screenshot after scrolling
      ScreenshotHelper.captureStepScreenshot(`scroll_to_${logName.replace(/\s+/g, '_').toLowerCase()}`);
    });
    
    Logger.success(`Successfully scrolled to ${logName}`);
    return this;
  }

  /**
   * Get page title
   * @returns {Cypress.Chainable} Cypress chainable with title
   */
  getPageTitle() {
    Logger.info('Getting page title');
    
    return cy.allure().step('Get page title', () => {
      return cy.title().then((title) => {
        Logger.success(`Page title: '${title}'`);
        return title;
      });
    });
  }

  /**
   * Get current URL
   * @returns {Cypress.Chainable} Cypress chainable with URL
   */
  getCurrentUrl() {
    Logger.info('Getting current URL');
    
    return cy.allure().step('Get current URL', () => {
      return cy.url().then((url) => {
        Logger.success(`Current URL: '${url}'`);
        return url;
      });
    });
  }

  /**
   * Take a full page screenshot
   * @param {string} pageName - Name of the page
   */
  takeFullPageScreenshot(pageName = 'page') {
    Logger.info(`Taking full page screenshot of ${pageName}`);
    ScreenshotHelper.captureFullPageScreenshot(pageName);
    Logger.success(`Full page screenshot taken for ${pageName}`);
    return this;
  }
}

module.exports = BasePage;