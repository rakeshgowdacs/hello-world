# Space Automation Framework

A robust, industry-standard Cypress automation framework featuring BDD with Cucumber, Page Object Model pattern, Allure reporting, and comprehensive logging with screenshots.

## 🚀 Features

- **Page Object Model (POM)** - Organized, maintainable page objects
- **BDD with Cucumber** - Behavior-driven development using Gherkin syntax
- **Allure Reporting** - Beautiful, detailed test reports with screenshots
- **Timestamped Reports** - Each test run creates a unique timestamped folder
- **Environment Configuration** - Flexible .env based configuration
- **Comprehensive Logging** - Detailed step-by-step logging with Allure integration
- **Screenshot Management** - Automatic screenshots at each step
- **Utility Functions** - Reusable helper functions for common operations
- **Test Data Management** - Structured test data and fixtures
- **Cross-browser Support** - Chrome, Firefox, Edge support
- **CI/CD Ready** - Ready for continuous integration pipelines

## 📁 Project Structure

```
space-automation-framework/
├── cypress/
│   ├── e2e/
│   │   └── features/                 # Cucumber feature files
│   │       └── googleSearch.feature
│   ├── support/
│   │   ├── pages/                    # Page Object Model
│   │   │   ├── basePage.js
│   │   │   ├── googleHomePage.js
│   │   │   └── googleSearchResultsPage.js
│   │   ├── step_definitions/         # Cucumber step definitions
│   │   │   └── googleSearchSteps.js
│   │   ├── utils/                    # Utility functions
│   │   │   ├── logger.js
│   │   │   ├── dataHelper.js
│   │   │   ├── screenshotHelper.js
│   │   │   └── waitHelper.js
│   │   ├── commands.js               # Custom Cypress commands
│   │   └── e2e.js                    # Support file
│   ├── fixtures/                     # Test fixtures
│   │   └── googleTestData.json
│   ├── downloads/                    # Downloaded files
│   ├── screenshots/                  # Screenshots
│   └── videos/                       # Test videos
├── testdata/                         # Test data files
│   └── searchTerms.json
├── reports/                          # Generated reports (timestamped folders)
├── .env                              # Environment configuration
├── cypress.config.js                 # Cypress configuration
├── .cypress-cucumber-preprocessorrc.json  # Cucumber configuration
└── package.json                      # Dependencies and scripts
```

## 🛠 Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd space-automation-framework
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Cypress (if needed)**
   ```bash
   npm run setup
   ```

4. **Configure environment variables**
   - Copy `.env.example` to `.env` (if exists) or use the provided `.env`
   - Update URLs and configuration as needed

## ⚙️ Configuration

### Environment Variables (.env)
```env
# Application URLs
BASE_URL=https://www.google.com
SEARCH_URL=https://www.google.com/search

# Test Environment
ENV=qa
BROWSER=chrome
HEADLESS=false

# Timeouts
PAGE_LOAD_TIMEOUT=30000
ELEMENT_TIMEOUT=10000

# Test Data
GOOGLE_SEARCH_TERM=Cypress Automation Testing
```

### Report Folders
Reports are automatically organized in timestamped folders:
```
reports/
└── space-01-28-2025-02-30-PM/
    ├── screenshots/
    ├── videos/
    ├── allure-results/
    └── allure-report/
```

## 🎯 Running Tests

### Basic Test Execution
```bash
# Run all tests
npm test

# Run tests in headed mode
npm run test:headed

# Run tests in specific browser
npm run test:chrome
npm run test:firefox
npm run test:edge

# Open Cypress Test Runner
npm run open
```

### BDD/Cucumber Tests
```bash
# Run with Allure reporting
npm run cy:run

# Run smoke tests only
npm run test:smoke

# Run regression tests
npm run test:regression
```

### Allure Reporting
```bash
# Generate and open Allure report
npm run test:allure

# Generate Allure report only
npm run allure:generate

# Open existing Allure report
npm run allure:open

# Serve Allure report
npm run allure:serve
```

### Maintenance
```bash
# Clean all reports
npm run clean:reports
```

## 📝 Writing Tests

### Feature Files (BDD)
Create feature files in `cypress/e2e/features/`:

```gherkin
Feature: Google Search Functionality
  As a user
  I want to search for information on Google
  So that I can find relevant results

  @smoke @regression
  Scenario: Perform a basic search on Google
    Given I navigate to Google home page
    When I enter "Cypress Automation Testing" in the search box
    And I click the search button
    Then I should see search results
    And the search results should contain "Cypress"
```

### Step Definitions
Implement steps in `cypress/support/step_definitions/`:

```javascript
Given('I navigate to Google home page', () => {
  googleHomePage.navigateToHomePage();
});

When('I enter {string} in the search box', (searchTerm) => {
  googleHomePage.enterSearchTerm(searchTerm);
});
```

### Page Objects
Create page objects in `cypress/support/pages/`:

```javascript
class GoogleHomePage extends BasePage {
  navigateToHomePage() {
    this.visit(this.url, 'Google Home Page');
    return this;
  }
  
  enterSearchTerm(searchTerm) {
    this.type(this.locators.searchBox, searchTerm, 'Search Box');
    return this;
  }
}
```

## 📊 Reporting and Screenshots

### Automatic Screenshots
Screenshots are automatically captured:
- After each step
- On test failure
- During navigation
- After element interactions

### Allure Integration
- Step-by-step execution logs
- Screenshots attached to each step
- Environment information
- Test metadata and tags
- Execution timeline

### Report Structure
```
reports/space-MM-DD-YYYY-HH-mm-AM/
├── screenshots/           # All captured screenshots
├── videos/               # Test execution videos
├── allure-results/       # Raw Allure data
└── allure-report/        # Generated HTML report
```

## 🧪 Test Data Management

### Test Data Files
- `testdata/`: JSON files for test data
- `cypress/fixtures/`: Cypress fixtures
- Environment-specific data in `.env`

### Data Helper Usage
```javascript
// Load test data
const searchTerms = DataHelper.loadTestData('searchTerms');

// Generate random data
const email = DataHelper.generateRandomData('email');

// Get environment data
const baseUrl = DataHelper.getEnvData('BASE_URL');
```

## 🔧 Utility Functions

### Logger
```javascript
Logger.info('Step description');
Logger.success('Operation completed');
Logger.error('Error occurred', errorDetails);
Logger.stepWithScreenshot('Step name', 'Description');
```

### Screenshot Helper
```javascript
ScreenshotHelper.captureStepScreenshot('step_name');
ScreenshotHelper.captureFullPageScreenshot('page_name');
ScreenshotHelper.captureElementScreenshot(selector, 'element_name');
```

### Wait Helper
```javascript
WaitHelper.waitForVisible(selector, timeout);
WaitHelper.waitForClickable(selector, timeout);
WaitHelper.waitForPageLoad();
```

## 🏷 Tags and Filtering

### Available Tags
- `@smoke` - Critical functionality tests
- `@regression` - Full regression suite
- `@ignore` - Skip specific tests

### Running Tagged Tests
```bash
# Run only smoke tests
npm run test:smoke

# Run only regression tests  
npm run test:regression

# Custom tag filtering
npx cypress run --env TAGS='@smoke and not @ignore'
```

## 🔍 Debugging

### Debug Mode
```bash
# Run with browser visible
npm run test:headed

# Open Cypress Test Runner for debugging
npm run open
```

### Logging Levels
All logs include timestamps and are integrated with Allure reporting.

## 🚀 CI/CD Integration

### Example GitHub Actions
```yaml
- name: Run Cypress Tests
  run: npm run cy:run

- name: Generate Allure Report
  run: npm run allure:generate

- name: Upload Allure Results
  uses: actions/upload-artifact@v2
  with:
    name: allure-results
    path: allure-results/
```

## 📋 Best Practices

1. **Page Objects**: Keep locators and methods in page objects
2. **Step Definitions**: Write clear, reusable step definitions  
3. **Test Data**: Use external data files for test data
4. **Screenshots**: Leverage automatic screenshot capture
5. **Logging**: Use the Logger utility for consistent logging
6. **Environment**: Use .env for environment-specific configuration
7. **Tags**: Use BDD tags for test organization and filtering

## 🤝 Contributing

1. Follow the existing code structure
2. Add appropriate logging and screenshots
3. Update documentation for new features
4. Ensure tests pass before submitting

## 📄 License

This project is licensed under the ISC License.

## 👥 Support

For questions and support:
- Check the documentation above
- Review example test cases
- Examine the utility functions
- Look at the page object implementations

---

**Space Automation Framework v1.0.0** - Built with ❤️ for robust test automation