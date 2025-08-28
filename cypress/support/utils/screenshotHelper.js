/**
 * Screenshot Helper utility for Space Automation Framework
 * Handles screenshot capture with proper naming and organization
 */

const moment = require('moment');

class ScreenshotHelper {
  /**
   * Take a screenshot with timestamp and step name
   * @param {string} stepName - Name of the current step
   * @param {object} options - Screenshot options
   */
  static captureStepScreenshot(stepName, options = {}) {
    const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
    const cleanStepName = stepName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const screenshotName = `${cleanStepName}_${timestamp}`;
    
    const defaultOptions = {
      capture: 'viewport',
      overwrite: false,
      disableTimersAndAnimations: true,
      blackout: []
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    cy.screenshot(screenshotName, mergedOptions).then(() => {
      cy.log(`📸 Screenshot captured: ${screenshotName}`);
      
      // Attach to Allure report
      cy.allure().attachment(`Screenshot - ${stepName}`, `screenshots/${screenshotName}.png`, 'image/png');
    });
    
    return cy.wrap(screenshotName);
  }

  /**
   * Take a full page screenshot
   * @param {string} pageName - Name of the page
   * @param {object} options - Screenshot options
   */
  static captureFullPageScreenshot(pageName, options = {}) {
    const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
    const cleanPageName = pageName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const screenshotName = `fullpage_${cleanPageName}_${timestamp}`;
    
    const defaultOptions = {
      capture: 'fullPage',
      overwrite: false,
      disableTimersAndAnimations: true
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    cy.screenshot(screenshotName, mergedOptions).then(() => {
      cy.log(`📸 Full page screenshot captured: ${screenshotName}`);
      
      // Attach to Allure report
      cy.allure().attachment(`Full Page Screenshot - ${pageName}`, `screenshots/${screenshotName}.png`, 'image/png');
    });
    
    return cy.wrap(screenshotName);
  }

  /**
   * Take screenshot on element
   * @param {string} selector - Element selector
   * @param {string} elementName - Name of the element
   * @param {object} options - Screenshot options
   */
  static captureElementScreenshot(selector, elementName, options = {}) {
    const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
    const cleanElementName = elementName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const screenshotName = `element_${cleanElementName}_${timestamp}`;
    
    cy.get(selector).screenshot(screenshotName, options).then(() => {
      cy.log(`📸 Element screenshot captured: ${screenshotName}`);
      
      // Attach to Allure report
      cy.allure().attachment(`Element Screenshot - ${elementName}`, `screenshots/${screenshotName}.png`, 'image/png');
    });
    
    return cy.wrap(screenshotName);
  }

  /**
   * Take screenshot before and after an action
   * @param {string} actionName - Name of the action
   * @param {function} action - Function containing the action to perform
   * @param {object} options - Screenshot options
   */
  static captureBeforeAfterScreenshots(actionName, action, options = {}) {
    const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
    const cleanActionName = actionName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    // Before screenshot
    this.captureStepScreenshot(`before_${cleanActionName}`, options);
    
    // Perform action
    action();
    
    // After screenshot
    this.captureStepScreenshot(`after_${cleanActionName}`, options);
  }

  /**
   * Capture screenshot on test failure
   * @param {string} testName - Name of the failed test
   * @param {string} error - Error message
   */
  static captureFailureScreenshot(testName, error = '') {
    const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
    const cleanTestName = testName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const screenshotName = `failure_${cleanTestName}_${timestamp}`;
    
    cy.screenshot(screenshotName, {
      capture: 'viewport',
      overwrite: false
    }).then(() => {
      cy.log(`❌ Failure screenshot captured: ${screenshotName}`);
      
      // Attach to Allure report with error details
      cy.allure().attachment(`Failure Screenshot - ${testName}`, `screenshots/${screenshotName}.png`, 'image/png');
      
      if (error) {
        cy.allure().attachment('Error Details', error, 'text/plain');
      }
    });
    
    return cy.wrap(screenshotName);
  }

  /**
   * Capture comparison screenshots for visual testing
   * @param {string} baselineName - Name for baseline comparison
   * @param {string} selector - Element selector (optional)
   */
  static captureComparisonScreenshot(baselineName, selector = null) {
    const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
    const cleanBaselineName = baselineName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const screenshotName = `comparison_${cleanBaselineName}_${timestamp}`;
    
    if (selector) {
      cy.get(selector).screenshot(screenshotName);
    } else {
      cy.screenshot(screenshotName);
    }
    
    cy.log(`📸 Comparison screenshot captured: ${screenshotName}`);
    
    return cy.wrap(screenshotName);
  }
}

module.exports = ScreenshotHelper;