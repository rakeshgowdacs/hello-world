const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const { addCucumberPreprocessorPlugin } = require("@badeball/cypress-cucumber-preprocessor");
const allureWriter = require("@shelex/cypress-allure-plugin/writer");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: `.env.${process.env.NODE_ENV || "dev"}` });

module.exports = defineConfig({
  chromeWebSecurity: false,
  defaultCommandTimeout: 15000,
  viewportWidth: 1366,
  viewportHeight: 768,
  video: true,
  screenshotsFolder: "cypress/screenshots",
  videosFolder: "cypress/videos",
  reporter: "spec",
  reporterOptions: {
    resultsDir: "cypress/allure-results"
  },
  e2e: {
    baseUrl: process.env.BASE_URL || "https://smsqa.service.dev/",
    specPattern: "cypress/e2e/**/*.feature",
    supportFile: "cypress/support/e2e.js",
    setupNodeEvents: async (on, config) => {
      try {
        // Add Cucumber preprocessor plugin
        await addCucumberPreprocessorPlugin(on, config);
        
        // Setup file preprocessor with esbuild
        on(
          "file:preprocessor",
          createBundler({
            plugins: []
          })
        );
        
        // Setup Allure writer
        allureWriter(on, config);
        
        return config;
      } catch (error) {
        console.error("Error in setupNodeEvents:", error);
        throw error;
      }
    }
  }
});