import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";
import allureWriter from "@shelex/cypress-allure-plugin/writer";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "dev"}` });

function createTimestampedRunDir() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  let hours = now.getHours();
  const minutes = pad(now.getMinutes());
  const isPM = hours >= 12;
  hours = hours % 12 || 12; // 12-hour format
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

export default defineConfig({
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
    supportFile: "cypress/support/e2e.ts",
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

