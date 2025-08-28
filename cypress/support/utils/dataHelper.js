/**
 * Data Helper utility for Space Automation Framework
 * Handles test data loading, saving, and manipulation
 */

const fs = require('fs');
const path = require('path');

class DataHelper {
  /**
   * Load test data from JSON file
   * @param {string} fileName - Name of the JSON file (without extension)
   * @param {string} folder - Folder path (default: 'testdata')
   * @returns {object} Parsed JSON data
   */
  static loadTestData(fileName, folder = 'testdata') {
    const filePath = path.join(Cypress.config('projectRoot'), folder, `${fileName}.json`);
    
    try {
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
      } else {
        throw new Error(`Test data file not found: ${filePath}`);
      }
    } catch (error) {
      throw new Error(`Failed to load test data from ${filePath}: ${error.message}`);
    }
  }

  /**
   * Save test data to JSON file
   * @param {string} fileName - Name of the JSON file (without extension)
   * @param {object} data - Data to save
   * @param {string} folder - Folder path (default: 'testdata')
   */
  static saveTestData(fileName, data, folder = 'testdata') {
    const folderPath = path.join(Cypress.config('projectRoot'), folder);
    const filePath = path.join(folderPath, `${fileName}.json`);
    
    try {
      // Create folder if it doesn't exist
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      throw new Error(`Failed to save test data to ${filePath}: ${error.message}`);
    }
  }

  /**
   * Load fixture data
   * @param {string} fixtureName - Name of the fixture file
   * @returns {Cypress.Chainable} Cypress chainable with fixture data
   */
  static loadFixture(fixtureName) {
    return cy.fixture(fixtureName);
  }

  /**
   * Generate random test data
   * @param {string} type - Type of data to generate (email, name, phone, etc.)
   * @returns {string} Generated random data
   */
  static generateRandomData(type) {
    const timestamp = Date.now();
    
    switch (type.toLowerCase()) {
      case 'email':
        return `testuser${timestamp}@example.com`;
      case 'name':
        return `TestUser${timestamp}`;
      case 'phone':
        return `555${timestamp.toString().slice(-7)}`;
      case 'string':
        return `test_${timestamp}`;
      case 'number':
        return Math.floor(Math.random() * 10000);
      default:
        return `generated_${type}_${timestamp}`;
    }
  }

  /**
   * Get environment specific data
   * @param {string} key - Environment variable key
   * @param {string} defaultValue - Default value if key not found
   * @returns {string} Environment value or default
   */
  static getEnvData(key, defaultValue = '') {
    return Cypress.env(key) || defaultValue;
  }

  /**
   * Merge multiple data objects
   * @param {...object} objects - Objects to merge
   * @returns {object} Merged object
   */
  static mergeData(...objects) {
    return Object.assign({}, ...objects);
  }

  /**
   * Filter data by criteria
   * @param {array} dataArray - Array of objects to filter
   * @param {object} criteria - Filter criteria
   * @returns {array} Filtered array
   */
  static filterData(dataArray, criteria) {
    return dataArray.filter(item => {
      return Object.keys(criteria).every(key => {
        return item[key] === criteria[key];
      });
    });
  }

  /**
   * Create a backup of test results
   * @param {object} testResults - Test results to backup
   * @param {string} testName - Name of the test
   */
  static backupTestResults(testResults, testName) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${testName}_results_${timestamp}`;
    
    this.saveTestData(fileName, testResults, 'testdata/backups');
  }
}

module.exports = DataHelper;