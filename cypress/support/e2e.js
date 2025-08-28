/**
 * Cypress Support File for Space Automation Framework
 * This file is processed and loaded automatically before your test files
 */

// Import commands.js
require('./commands');

// Import Allure plugin
require('@shelex/cypress-allure-plugin');

// Import utilities
const Logger = require('./utils/logger');
const ScreenshotHelper = require('./utils/screenshotHelper');
const DataHelper = require('./utils/dataHelper');

// Environment variables are loaded in cypress.config.js

// Global configurations
Cypress.on('uncaught:exception', (err, runnable) => {
  // Log the error but don't fail the test for uncaught exceptions
  console.error('Uncaught exception detected:', err.message, runnable?.title);
  
  // Return false to prevent the test from failing
  return false;
});

// Global before hook
before(() => {
  Logger.info('=== Starting Test Suite Execution ===');
  
  // Set up global test data
  cy.window().then((win) => {
    win.testStartTime = new Date().toISOString();
  });
  
  // Create timestamp for this test run
  const timestamp = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).replace(/[/,:]/g, '-').replace(' ', '-');
  
  cy.wrap(timestamp).as('testRunTimestamp');
  
  Logger.info(`Test run timestamp: ${timestamp}`);
});

// Global after hook
after(() => {
  Logger.info('=== Test Suite Execution Completed ===');
  
  // Take final suite screenshot
  ScreenshotHelper.captureStepScreenshot('test_suite_completed');
  
  // Log suite completion
  cy.window().then((win) => {
    const startTime = win.testStartTime;
    const endTime = new Date().toISOString();
    
    Logger.info('Test suite execution summary', {
      startTime: startTime,
      endTime: endTime,
      browser: Cypress.browser.name,
      environment: DataHelper.getEnvData('ENV', 'qa')
    });
  });
});

// Global beforeEach hook
beforeEach(() => {
  // Set up test context
  cy.window().then((win) => {
    win.currentTestStartTime = new Date().toISOString();
  });
  
  // Log test start
  Logger.info(`Starting test: ${Cypress.currentTest.title}`);
});

// Global afterEach hook
afterEach(() => {
  // Handle test result
  if (Cypress.currentTest.state === 'failed') {
    Logger.error(`Test failed: ${Cypress.currentTest.title}`);
    
    // Take failure screenshot
    ScreenshotHelper.captureFailureScreenshot(
      Cypress.currentTest.title,
      Cypress.currentTest.err?.message || 'Test failed'
    );
  } else {
    Logger.success(`Test passed: ${Cypress.currentTest.title}`);
  }
  
  // Log test completion time
  cy.window().then((win) => {
    const startTime = win.currentTestStartTime;
    const endTime = new Date().toISOString();
    const duration = new Date(endTime) - new Date(startTime);
    
    Logger.info(`Test completed in ${duration}ms`);
  });
});

// Custom commands for Allure integration
Cypress.Commands.add('addAllureEnvironmentInfo', () => {
  cy.allure().writeEnvironmentInfo({
    'Framework': 'Space Automation Framework',
    'Version': '1.0.0',
    'Browser': Cypress.browser.name,
    'Browser Version': Cypress.browser.version,
    'Base URL': DataHelper.getEnvData('BASE_URL'),
    'Environment': DataHelper.getEnvData('ENV', 'qa'),
    'Test Framework': 'Cypress + Cucumber + Allure',
    'Viewport': `${Cypress.config('viewportWidth')}x${Cypress.config('viewportHeight')}`,
    'Timeout': `${Cypress.config('defaultCommandTimeout')}ms`,
    'Operating System': Cypress.platform,
    'Node Version': Cypress.version
  });
});

// Add test metadata
Cypress.Commands.add('addTestMetadata', (testInfo) => {
  cy.allure().epic(testInfo.epic || 'Google Search');
  cy.allure().feature(testInfo.feature || 'Search Functionality');
  cy.allure().story(testInfo.story || 'Basic Search');
  cy.allure().severity(testInfo.severity || 'normal');
  cy.allure().tag(testInfo.tag || 'regression');
});

// Custom screenshot command with Allure integration
Cypress.Commands.add('takeStepScreenshot', (stepName, options = {}) => {
  ScreenshotHelper.captureStepScreenshot(stepName, options);
});

// Custom wait command with logging
Cypress.Commands.add('waitAndLog', (duration, reason = 'waiting') => {
  Logger.info(`Waiting ${duration}ms - ${reason}`);
  cy.wait(duration);
});

// Custom command for element interaction with logging
Cypress.Commands.add('clickWithLogging', { prevSubject: 'element' }, (subject, elementName = 'element') => {
  Logger.info(`Clicking on ${elementName}`);
  
  cy.wrap(subject).click().then(() => {
    Logger.success(`Successfully clicked on ${elementName}`);
    ScreenshotHelper.captureStepScreenshot(`clicked_${elementName.replace(/\s+/g, '_').toLowerCase()}`);
  });
});

// Custom command for typing with logging
Cypress.Commands.add('typeWithLogging', { prevSubject: 'element' }, (subject, text, fieldName = 'field') => {
  Logger.info(`Typing '${text}' into ${fieldName}`);
  
  cy.wrap(subject).clear().type(text).then(() => {
    Logger.success(`Successfully typed '${text}' into ${fieldName}`);
    ScreenshotHelper.captureStepScreenshot(`typed_into_${fieldName.replace(/\s+/g, '_').toLowerCase()}`);
  });
});

// Console log override for better logging in CI
const originalLog = console.log;
console.log = (...args) => {
  const timestamp = new Date().toISOString();
  originalLog(`[${timestamp}]`, ...args);
};

// Logger.info('Space Automation Framework initialized successfully'); // Commented out to avoid calling cy.log outside test