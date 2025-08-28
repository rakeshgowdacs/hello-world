/**
 * Google Search Step Definitions for Space Automation Framework
 * Contains step implementations for Google search feature scenarios
 */

const { Given, When, Then, And } = require('cypress-cucumber-preprocessor/steps');

const GoogleHomePage = require('../pages/googleHomePage');
const GoogleSearchResultsPage = require('../pages/googleSearchResultsPage');
const Logger = require('../utils/logger');
const ScreenshotHelper = require('../utils/screenshotHelper');
const DataHelper = require('../utils/dataHelper');

// Page object instances
let googleHomePage;
let googleSearchResultsPage;

// Test data
let testData;

// Background step
Given('I navigate to Google home page', () => {
  Logger.info('=== Starting Google Search Test ===');
  
  cy.allure().step('Initialize test and navigate to Google', () => {
    // Initialize page objects
    googleHomePage = new GoogleHomePage();
    googleSearchResultsPage = new GoogleSearchResultsPage();
    
    // Load test data
    testData = {
      searchTerm: DataHelper.getEnvData('GOOGLE_SEARCH_TERM', 'Cypress Automation Testing'),
      baseUrl: DataHelper.getEnvData('BASE_URL', 'https://www.google.com')
    };
    
    Logger.info('Test data loaded', testData);
    
    // Navigate to Google home page
    googleHomePage.navigateToHomePage();
  });
});

// Given steps
Given('I am on the Google home page', () => {
  cy.allure().step('Verify I am on Google home page', () => {
    Logger.info('Verifying user is on Google home page');
    
    // Verify we're on the correct page
    googleHomePage.verifyHomePageLoaded();
    
    // Take screenshot for verification
    ScreenshotHelper.captureStepScreenshot('on_google_home_page');
    
    Logger.success('Successfully verified Google home page');
  });
});

// When steps
When('I enter {string} in the search box', (searchTerm) => {
  cy.allure().step(`Enter search term: ${searchTerm}`, () => {
    Logger.info(`Entering search term: '${searchTerm}'`);
    
    // Enter the search term
    googleHomePage.enterSearchTerm(searchTerm);
    
    // Store search term for later verification
    cy.wrap(searchTerm).as('currentSearchTerm');
    
    Logger.success(`Successfully entered search term: '${searchTerm}'`);
  });
});

When('I click the search button', () => {
  cy.allure().step('Click Google Search button', () => {
    Logger.info('Clicking the Google Search button');
    
    // Click search button
    googleHomePage.clickSearchButton();
    
    // Wait for navigation to search results
    cy.url().should('include', '/search');
    
    Logger.success('Successfully clicked search button and navigated to results');
  });
});

// Then steps
Then('I should see search results', () => {
  cy.allure().step('Verify search results are displayed', () => {
    Logger.info('Verifying search results are displayed');
    
    // Verify search results page loaded
    googleSearchResultsPage.verifySearchResultsLoaded();
    
    // Verify we have search results
    googleSearchResultsPage.getSearchResultTitles().then((titles) => {
      expect(titles.length).to.be.greaterThan(0);
      Logger.success(`Found ${titles.length} search results`);
    });
    
    // Take screenshot of search results
    ScreenshotHelper.captureStepScreenshot('search_results_displayed');
  });
});

Then('the search results should contain {string}', (expectedText) => {
  cy.allure().step(`Verify results contain '${expectedText}'`, () => {
    Logger.info(`Verifying search results contain: '${expectedText}'`);
    
    // Verify search results contain expected text
    googleSearchResultsPage.verifySearchResultsContain(expectedText);
    
    // Take screenshot after verification
    ScreenshotHelper.captureStepScreenshot(`results_contain_${expectedText.replace(/\s+/g, '_').toLowerCase()}`);
    
    Logger.success(`Successfully verified results contain: '${expectedText}'`);
  });
});

Then('I should see search statistics', () => {
  cy.allure().step('Verify search statistics are displayed', () => {
    Logger.info('Verifying search statistics are displayed');
    
    // Verify search stats are visible
    googleSearchResultsPage.verifySearchStatsVisible();
    
    // Take screenshot of search stats
    ScreenshotHelper.captureElementScreenshot(
      googleSearchResultsPage.locators.searchStats, 
      'search_statistics'
    );
    
    Logger.success('Successfully verified search statistics');
  });
});

Then('I should see the Google logo', () => {
  cy.allure().step('Verify Google logo is visible', () => {
    Logger.info('Verifying Google logo is visible');
    
    // Verify Google logo
    googleHomePage.verifyGoogleLogo().then((logoData) => {
      expect(logoData.alt).to.equal('Google');
      Logger.success('Google logo verified with correct attributes', logoData);
    });
    
    // Take screenshot of logo
    ScreenshotHelper.captureElementScreenshot(
      googleHomePage.locators.googleLogo, 
      'google_logo'
    );
  });
});

Then('I should see the search box', () => {
  cy.allure().step('Verify search box is visible', () => {
    Logger.info('Verifying search box is visible');
    
    // Verify search box is visible
    googleHomePage.verifySearchBoxVisible();
    
    // Take screenshot of search box
    ScreenshotHelper.captureStepScreenshot('search_box_visible');
    
    Logger.success('Successfully verified search box is visible');
  });
});

Then('I should see the {string} button', (buttonText) => {
  cy.allure().step(`Verify '${buttonText}' button is visible`, () => {
    Logger.info(`Verifying '${buttonText}' button is visible`);
    
    // Map button text to locators
    const buttonMapping = {
      'Google Search': googleHomePage.locators.searchButton,
      'I\'m Feeling Lucky': googleHomePage.locators.feelingLuckyButton
    };
    
    const buttonSelector = buttonMapping[buttonText];
    
    if (buttonSelector) {
      googleHomePage.verifyElementVisible(buttonSelector, `${buttonText} Button`);
      
      // Take screenshot of button
      ScreenshotHelper.captureElementScreenshot(buttonSelector, `${buttonText}_button`);
      
      Logger.success(`Successfully verified '${buttonText}' button is visible`);
    } else {
      throw new Error(`Unknown button: ${buttonText}`);
    }
  });
});

Then('I should be on the search results page', () => {
  cy.allure().step('Verify navigation to search results page', () => {
    Logger.info('Verifying navigation to search results page');
    
    // Verify URL contains search
    cy.url().should('include', '/search');
    
    // Verify search results page elements
    cy.get('@currentSearchTerm').then((searchTerm) => {
      googleSearchResultsPage.verifySearchResultsLoaded(searchTerm);
    });
    
    // Take full page screenshot
    googleSearchResultsPage.takeFullPageScreenshot('search_results_page_final');
    
    Logger.success('Successfully verified navigation to search results page');
  });
});

// And steps (aliases for existing steps)
And('I click the search button', () => {
  // Reuse the When step
  cy.then(() => {
    googleHomePage.clickSearchButton();
    cy.url().should('include', '/search');
  });
});

And('the search results should contain {string}', (expectedText) => {
  // Reuse the Then step
  cy.then(() => {
    googleSearchResultsPage.verifySearchResultsContain(expectedText);
  });
});

And('I should see search statistics', () => {
  // Reuse the Then step
  cy.then(() => {
    googleSearchResultsPage.verifySearchStatsVisible();
  });
});

And('I should see the search box', () => {
  // Reuse the Then step
  cy.then(() => {
    googleHomePage.verifySearchBoxVisible();
  });
});

And('I should see the {string} button', (buttonText) => {
  // Reuse the Then step
  cy.then(() => {
    const buttonMapping = {
      'Google Search': googleHomePage.locators.searchButton,
      'I\'m Feeling Lucky': googleHomePage.locators.feelingLuckyButton
    };
    
    const buttonSelector = buttonMapping[buttonText];
    
    if (buttonSelector) {
      googleHomePage.verifyElementVisible(buttonSelector, `${buttonText} Button`);
    }
  });
});

And('I should see the {string} button', (buttonText) => {
  // Reuse the Then step for button verification
  cy.then(() => {
    const buttonMapping = {
      'Google Search': googleHomePage.locators.searchButton,
      'I\'m Feeling Lucky': googleHomePage.locators.feelingLuckyButton
    };
    
    const buttonSelector = buttonMapping[buttonText];
    
    if (buttonSelector) {
      googleHomePage.verifyElementVisible(buttonSelector, `${buttonText} Button`);
    }
  });
});

// Hooks for test setup and cleanup
beforeEach(() => {
  Logger.info('=== Test Setup ===');
  
  // Set up Allure environment info
  cy.allure().writeEnvironmentInfo({
    'Browser': Cypress.browser.name,
    'Browser Version': Cypress.browser.version,
    'Base URL': DataHelper.getEnvData('BASE_URL'),
    'Environment': DataHelper.getEnvData('ENV', 'qa'),
    'Test Framework': 'Cypress + Cucumber',
    'Framework Version': 'Space Framework v1.0.0'
  });
});

afterEach(() => {
  Logger.info('=== Test Cleanup ===');
  
  // Take final screenshot regardless of test result
  ScreenshotHelper.captureStepScreenshot('test_completed');
  
  // Log test completion
  Logger.success('Test execution completed');
});