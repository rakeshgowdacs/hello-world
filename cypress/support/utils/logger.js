/**
 * Logger utility for Space Automation Framework
 * Provides structured logging with Allure step annotations
 */

class Logger {
  /**
   * Log an info message with Allure step
   * @param {string} message - The message to log
   * @param {object} data - Optional data to attach
   */
  static info(message, data = {}) {
    cy.log(`ℹ️ INFO: ${message}`);
    cy.allure().step(message, () => {
      if (Object.keys(data).length > 0) {
        cy.allure().attachment('Step Data', JSON.stringify(data, null, 2), 'application/json');
      }
    });
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data);
  }

  /**
   * Log a success message with Allure step
   * @param {string} message - The message to log
   * @param {object} data - Optional data to attach
   */
  static success(message, data = {}) {
    cy.log(`✅ SUCCESS: ${message}`);
    cy.allure().step(`✅ ${message}`, () => {
      if (Object.keys(data).length > 0) {
        cy.allure().attachment('Success Data', JSON.stringify(data, null, 2), 'application/json');
      }
    });
    console.log(`[SUCCESS] ${new Date().toISOString()} - ${message}`, data);
  }

  /**
   * Log an error message with Allure step
   * @param {string} message - The message to log
   * @param {object} error - Optional error object
   */
  static error(message, error = {}) {
    cy.log(`❌ ERROR: ${message}`);
    cy.allure().step(`❌ ${message}`, () => {
      if (Object.keys(error).length > 0) {
        cy.allure().attachment('Error Details', JSON.stringify(error, null, 2), 'application/json');
      }
    });
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
  }

  /**
   * Log a warning message with Allure step
   * @param {string} message - The message to log
   * @param {object} data - Optional data to attach
   */
  static warning(message, data = {}) {
    cy.log(`⚠️ WARNING: ${message}`);
    cy.allure().step(`⚠️ ${message}`, () => {
      if (Object.keys(data).length > 0) {
        cy.allure().attachment('Warning Data', JSON.stringify(data, null, 2), 'application/json');
      }
    });
    console.warn(`[WARNING] ${new Date().toISOString()} - ${message}`, data);
  }

  /**
   * Log a step with screenshot
   * @param {string} stepName - Name of the step
   * @param {string} description - Description of what was done
   */
  static stepWithScreenshot(stepName, description = '') {
    const fullMessage = description ? `${stepName}: ${description}` : stepName;
    
    cy.allure().step(fullMessage, () => {
      cy.screenshot(stepName.replace(/[^a-z0-9]/gi, '_').toLowerCase(), {
        capture: 'viewport',
        overwrite: true
      }).then(() => {
        Logger.info(`Screenshot captured for step: ${stepName}`);
      });
    });
  }

  /**
   * Log navigation action
   * @param {string} url - URL being navigated to
   * @param {string} pageName - Name of the page
   */
  static navigation(url, pageName = '') {
    const message = pageName ? `Navigating to ${pageName} (${url})` : `Navigating to ${url}`;
    
    cy.allure().step(`🌐 ${message}`, () => {
      cy.allure().attachment('Navigation Details', JSON.stringify({
        url: url,
        pageName: pageName,
        timestamp: new Date().toISOString()
      }, null, 2), 'application/json');
    });
    
    cy.log(`🌐 ${message}`);
    console.log(`[NAVIGATION] ${new Date().toISOString()} - ${message}`);
  }
}

module.exports = Logger;