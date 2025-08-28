const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const { addCucumberPreprocessorPlugin } = require("@badeball/cypress-cucumber-preprocessor");
const createEsbuildPlugin = require("@badeball/cypress-cucumber-preprocessor/esbuild");
const allureWriter = require("@shelex/cypress-allure-plugin/writer");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config({ path: `.env.${process.env.NODE_ENV || "dev"}` });

function createTimestampedRunDir() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  let hours = now.getHours();
  const minutes = pad(now.getMinutes());
  const isPM = hours >= 12;
  hours = hours % 12 || 12;
  const hour12 = pad(hours);
  const timestamp = `sms-${year}-${month}-${day}-${hour12}-${minutes}${isPM ? "pm" : "am"}`;
  const runDir = path.join("reports", timestamp);
  
  fs.mkdirSync(runDir, { recursive: true });
  fs.mkdirSync(path.join(runDir, "allure-results"), { recursive: true });
  fs.mkdirSync(path.join(runDir, "screenshots"), { recursive: true });
  fs.mkdirSync(path.join(runDir, "videos"), { recursive: true });
  fs.mkdirSync("reports", { recursive: true });
  fs.writeFileSync(path.join("reports", ".last-run"), runDir, "utf8");
  
  return runDir;
}

const RUN_DIR = createTimestampedRunDir();

module.exports = defineConfig({
  chromeWebSecurity: false,
  defaultCommandTimeout: 15000,
  viewportWidth: 1366,
  viewportHeight: 768,
  video: true,
  screenshotsFolder: `${RUN_DIR}/screenshots`,
  videosFolder: `${RUN_DIR}/videos`,
  reporter: "@shelex/cypress-allure-plugin",
  reporterOptions: {
    resultsDir: `${RUN_DIR}/allure-results`
  },
  e2e: {
    baseUrl: process.env.BASE_URL || "https://smsqa.service.dev/",
    specPattern: "cypress/e2e/**/*.feature",
    supportFile: "cypress/support/e2e.js",
    setupNodeEvents: async (on, config) => {
      await addCucumberPreprocessorPlugin(on, config);
      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)]
        })
      );
      allureWriter(on, config);
      return config;
    }
  }
});