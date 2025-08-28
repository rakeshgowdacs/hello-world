/**
 * Custom Cypress Commands for Space Automation Framework
 * Add your custom commands in this file
 */

const Logger = require('./utils/logger');
const ScreenshotHelper = require('./utils/screenshotHelper');
const DataHelper = require('./utils/dataHelper');
const WaitHelper = require('./utils/waitHelper');

/**
 * Custom command to handle Google consent popup
 */
Cypress.Commands.add('handleGoogleConsent', () => {
  Logger.info('Checking for Google consent popup');
  
  cy.get('body').then(($body) => {
    if ($body.find('button:contains("Accept all")').length > 0) {
      Logger.info('Google consent popup found, accepting');
      cy.get('button:contains("Accept all")').click();
      cy.wait(1000);
    } else if ($body.find('button:contains("I agree")').length > 0) {
      Logger.info('Google consent popup found (I agree), accepting');
      cy.get('button:contains("I agree")').click();
      cy.wait(1000);
    } else {
      Logger.info('No Google consent popup found');
    }
  });
});

/**
 * Custom command to navigate to Google with proper setup
 */
Cypress.Commands.add('navigateToGoogle', () => {
  const baseUrl = DataHelper.getEnvData('BASE_URL', 'https://www.google.com');
  
  Logger.navigation(baseUrl, 'Google Home Page');
  
  cy.visit(baseUrl, {
    timeout: 30000,
    failOnStatusCode: false
  });
  
  // Handle consent popup
  cy.handleGoogleConsent();
  
  // Wait for page to fully load
  WaitHelper.waitForPageLoad();
  
  // Take screenshot
  ScreenshotHelper.captureStepScreenshot('google_page_loaded');
});

/**
 * Custom command to perform search with full logging
 */
Cypress.Commands.add('performGoogleSearch', (searchTerm) => {
  Logger.info(`Performing Google search for: ${searchTerm}`);
  
  cy.allure().step(`Search for "${searchTerm}"`, () => {
    // Find and use the search box
    cy.get('body').then(($body) => {
      if ($body.find('textarea[name="q"]').length > 0) {
        cy.get('textarea[name="q"]').clear().type(searchTerm);
      } else if ($body.find('input[name="q"]').length > 0) {
        cy.get('input[name="q"]').clear().type(searchTerm);
      } else {
        throw new Error('Search box not found');
      }
    });
    
    // Submit search
    cy.get('textarea[name="q"], input[name="q"]').type('{enter}');
    
    // Wait for results
    cy.url().should('include', '/search');
    cy.wait(2000);
    
    // Take screenshot
    ScreenshotHelper.captureStepScreenshot('search_completed');
  });
  
  Logger.success(`Search completed for: ${searchTerm}`);
});

/**
 * Custom command to verify search results
 */
Cypress.Commands.add('verifySearchResults', (expectedText = null) => {
  Logger.info('Verifying search results are displayed');
  
  cy.allure().step('Verify search results', () => {
    // Verify we're on search results page
    cy.url().should('include', '/search');
    
    // Verify search results container exists
    cy.get('#search, #main').should('be.visible');
    
    // Verify we have search results
    cy.get('h3').should('have.length.greaterThan', 0);
    
    // If expected text provided, verify it appears in results
    if (expectedText) {
      cy.get('h3').should(($results) => {
        const results = $results.text();
        expect(results.toLowerCase()).to.include(expectedText.toLowerCase());
      });
    }
    
    // Verify search statistics
    cy.get('#result-stats').should('be.visible');
    
    // Take screenshot
    ScreenshotHelper.captureStepScreenshot('search_results_verified');
  });
  
  Logger.success('Search results verified successfully');
});

/**
 * Custom command to take timestamped screenshot
 */
Cypress.Commands.add('takeTimestampedScreenshot', (name) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const screenshotName = `${name}_${timestamp}`;
  
  cy.screenshot(screenshotName, {
    capture: 'viewport',
    overwrite: false
  });
  
  Logger.info(`Timestamped screenshot taken: ${screenshotName}`);
});

/**
 * Custom command to wait for element with retry
 */
Cypress.Commands.add('waitForElementWithRetry', (selector, maxRetries = 5) => {
  let attempts = 0;
  
  const checkElement = () => {
    attempts++;
    Logger.info(`Checking for element (attempt ${attempts}/${maxRetries}): ${selector}`);
    
    return cy.get('body').then(($body) => {
      if ($body.find(selector).length > 0) {
        Logger.success(`Element found: ${selector}`);
        return cy.get(selector);
      } else if (attempts < maxRetries) {
        cy.wait(1000);
        return checkElement();
      } else {
        throw new Error(`Element not found after ${maxRetries} attempts: ${selector}`);
      }
    });
  };
  
  return checkElement();
});

/**
 * Custom command to add test data to Allure report
 */
Cypress.Commands.add('addTestDataToAllure', (data, fileName = 'test-data') => {
  cy.allure().attachment(
    `Test Data - ${fileName}`, 
    JSON.stringify(data, null, 2), 
    'application/json'
  );
});

/**
 * Custom command to log step with Allure integration
 */
Cypress.Commands.add('logStep', (stepName, stepData = {}) => {
  Logger.info(stepName, stepData);
  
  cy.allure().step(stepName, () => {
    if (Object.keys(stepData).length > 0) {
      cy.addTestDataToAllure(stepData, stepName.replace(/\s+/g, '-').toLowerCase());
    }
    
    // Take screenshot for the step
    ScreenshotHelper.captureStepScreenshot(stepName.replace(/\s+/g, '_').toLowerCase());
  });
});

/**
 * Custom command to verify page title with logging
 */
Cypress.Commands.add('verifyPageTitle', (expectedTitle) => {
  Logger.info(`Verifying page title contains: ${expectedTitle}`);
  
  cy.title().should('include', expectedTitle).then((title) => {
    Logger.success(`Page title verified: ${title}`);
  });
});

/**
 * Custom command to get and verify URL
 */
Cypress.Commands.add('verifyCurrentUrl', (expectedUrl) => {
  Logger.info(`Verifying current URL contains: ${expectedUrl}`);
  
  cy.url().should('include', expectedUrl).then((url) => {
    Logger.success(`URL verified: ${url}`);
  });
});

/**
 * Custom command to simulate typing with human-like delays
 */
Cypress.Commands.add('humanType', { prevSubject: 'element' }, (subject, text, options = {}) => {
  const defaultOptions = {
    delay: 100,
    log: true
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  if (mergedOptions.log) {
    Logger.info(`Human-like typing: ${text}`);
  }
  
  cy.wrap(subject).clear().type(text, mergedOptions);
});

/**
 * Custom command to click with wait and verification
 */
Cypress.Commands.add('clickAndVerify', { prevSubject: 'element' }, (subject, expectedResult = {}) => {
  cy.wrap(subject).should('be.visible').and('not.be.disabled').click();
  
  // If URL change expected
  if (expectedResult.urlContains) {
    cy.url().should('include', expectedResult.urlContains);
  }
  
  // If element should appear after click
  if (expectedResult.elementAppears) {
    cy.get(expectedResult.elementAppears).should('be.visible');
  }
  
  // Take screenshot after click
  ScreenshotHelper.captureStepScreenshot('element_clicked');
});

/**
 * Custom command to setup test environment
 */
Cypress.Commands.add('setupTestEnvironment', (testInfo = {}) => {
  Logger.info('Setting up test environment', testInfo);
  
  // Add environment info to Allure
  cy.addAllureEnvironmentInfo();
  
  // Add test metadata
  if (testInfo.epic || testInfo.feature || testInfo.story) {
    cy.addTestMetadata(testInfo);
  }
  
  // Set viewport if specified
  if (testInfo.viewport) {
    cy.viewport(testInfo.viewport.width, testInfo.viewport.height);
  }
  
  Logger.success('Test environment setup completed');
});

// Logger.info('Custom Cypress commands loaded successfully'); // Commented out to avoid calling cy.log outside test