const { defineConfig } = require("cypress");
const { addCucumberPreprocessorPlugin } = require("@badeball/cypress-cucumber-preprocessor");
const allureWriter = require("@shelex/cypress-allure-plugin/writer");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: `.env.${process.env.NODE_ENV || "dev"}` });

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL || "https://smsqa.service.dev/",
    specPattern: "cypress/e2e/**/*.feature",
    supportFile: "cypress/support/e2e.js",
    setupNodeEvents: async (on, config) => {
      try {
        // Add Cucumber preprocessor plugin
        await addCucumberPreprocessorPlugin(on, config);
        
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