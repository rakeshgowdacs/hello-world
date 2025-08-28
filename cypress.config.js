const { defineConfig } = require('cypress');
const cucumber = require('cypress-cucumber-preprocessor').default;
const allureWriter = require('@shelex/cypress-allure-plugin/writer');
const moment = require('moment');

// Generate timestamp for folder naming (fixed format for folder names)
const timestamp = moment().format('MM-DD-YYYY-hh-mm-A');
const reportFolder = `space-${timestamp}`;

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Cucumber preprocessor
      on('file:preprocessor', cucumber());
      
      // Allure plugin
      allureWriter(on, config);
      
      // Load environment variables
      require('dotenv').config();
      
      // Set environment variables from .env file
      config.env.BASE_URL = process.env.BASE_URL;
      config.env.SEARCH_URL = process.env.SEARCH_URL;
      config.env.BROWSER = process.env.BROWSER;
      config.env.GOOGLE_SEARCH_TERM = process.env.GOOGLE_SEARCH_TERM;
      config.env.ELEMENT_TIMEOUT = process.env.ELEMENT_TIMEOUT;
      config.env.PAGE_LOAD_TIMEOUT = process.env.PAGE_LOAD_TIMEOUT;
      
      return config;
    },
    specPattern: 'cypress/e2e/features/**/*.feature',
    supportFile: 'cypress/support/e2e.js',
    videosFolder: `reports/${reportFolder}/videos`,
    screenshotsFolder: `reports/${reportFolder}/screenshots`,
    downloadsFolder: 'cypress/downloads',
    baseUrl: 'https://www.google.com',
    viewportWidth: 1920,
    viewportHeight: 1080,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    requestTimeout: 5000,
    responseTimeout: 30000,
    video: true,
    screenshotOnRunFailure: true,
    trashAssetsBeforeRuns: true,
    env: {
      allureReuseAfterSpec: true,
      allureResultsPath: `reports/${reportFolder}/allure-results`,
      allureReportPath: `reports/${reportFolder}/allure-report`,
      TAGS: 'not @ignore'
    }
  }
});