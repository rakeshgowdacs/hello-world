# Space - Cypress BDD Automation Framework (JavaScript)

A robust Cypress automation framework with BDD (Behavior Driven Development), Allure reporting, Page Object Model, Test Context Manager, and comprehensive utilities built with a DRY (Don't Repeat Yourself) approach - **100% JavaScript Implementation**.

## 🚀 Features

- **BDD with Cucumber**: Write tests in natural language using `.feature` files
- **Page Object Model (POM)**: Maintainable and reusable page objects with data-driven selectors
- **Test Context Manager**: Centralized data storage and persistence across test steps
- **Assertion Helper**: Easy actual vs expected comparisons with built-in storage
- **Allure Reporting**: Rich HTML reports with step-by-step logging and screenshots
- **Timestamped Runs**: Each test run creates a unique folder with timestamp (e.g., `sms-2025-08-28-06-24pm`)
- **Environment Configuration**: Separate configs for dev and qa environments
- **Generic Utilities**: Date generators, test data loaders, result savers
- **API Testing Scaffold**: Ready structure for API testing with schema validation
- **Data-Driven Testing**: Support for fixtures and parameterized tests
- **Custom Commands**: Reusable commands for common operations
- **JavaScript Support**: Full ES6+ support with modern syntax

## 📁 Project Structure

```
space/
├── cypress/
│   ├── e2e/
│   │   ├── login/
│   │   │   ├── login.feature          # BDD feature file
│   │   │   └── login.steps.js         # Step definitions
│   │   ├── order/
│   │   │   ├── orderFlow.feature      # Order flow feature
│   │   │   └── orderFlow.steps.js     # Order flow steps
│   │   └── api/
│   │       └── schema.readme.md       # API testing guide
│   ├── fixtures/
│   │   └── pages/
│   │       ├── loginData.json         # Login page data
│   │       ├── dashboardData.json     # Dashboard page data
│   │       ├── orderData.json         # Order page data
│   │       └── commonData.json        # Shared data
│   └── support/
│       ├── e2e.js                     # Global support file
│       ├── commands.js                 # Custom commands
│       ├── pages/
│       │   ├── BasePage.js            # Abstract base page
│       │   ├── CommonPage.js          # Shared page functionality
│       │   ├── LoginPage.js           # Login page object
│       │   ├── DashboardPage.js       # Dashboard page object
│       │   ├── OrderPage.js           # Order page object
│       │   └── index.js               # Page exports
│       └── utils/
│           ├── data.js                 # Data utilities
│           ├── date.js                 # Date utilities
│           ├── dataManager.js          # Page data manager
│           ├── testContext.js          # Test context manager
│           ├── assertionHelper.js      # Assertion utilities
│           └── index.js                # Utility exports
├── reports/                            # Test run reports (auto-generated)
├── .env.dev                           # Development environment config
├── .env.qa                            # QA environment config
├── cypress.config.js                  # Cypress configuration
└── package.json                       # Dependencies and scripts
```

## 🛠️ Installation

1. **Clone and install dependencies:**
   ```bash
   npm ci
   ```

2. **Verify Cypress installation:**
   ```bash
   npx cypress verify
   ```

## ⚙️ Configuration

### Environment Files

- **`.env.dev`**: Development environment settings
- **`.env.qa`**: QA environment settings

Each file contains:
```env
NODE_ENV=dev
BASE_URL=https://smsqa.service.dev/
```

### Cypress Configuration

The framework automatically:
- Creates timestamped run directories
- Configures Cucumber preprocessor
- Sets up Allure reporting
- Loads environment-specific configurations

## 🧪 Running Tests

### Development Environment
```bash
NODE_ENV=dev npx cypress run --spec "cypress/e2e/login/login.feature"
```

### QA Environment
```bash
NODE_ENV=qa npx cypress run --spec "cypress/e2e/login/login.feature"
```

### Run Order Flow Tests
```bash
NODE_ENV=dev npx cypress run --spec "cypress/e2e/order/orderFlow.feature"
```

### Open Cypress UI
```bash
npm run cypress:open
```

### Generate Allure Report
```bash
npm run report:generate
```

### Open Allure Report
```bash
npm run report:open
```

## 🏗️ Page Object Model (POM)

### Base Page Class
```javascript
class BasePage {
  constructor() {
    if (this.constructor === BasePage) {
      throw new Error("BasePage is abstract and cannot be instantiated");
    }
  }

  // Common methods for all pages
  visit() { return cy.visit(this.url); }
  getElement(selectorName) { /* implementation */ }
  clickElement(selectorName) { /* implementation */ }
  typeText(selectorName, text) { /* implementation */ }
  // ... more methods
}
```

### Page-Specific Implementation
```javascript
class LoginPage extends BasePage {
  constructor() {
    super();
    this.pageData = dataManager.getLoginData();
  }

  get url() {
    return dataManager.getUrl('login', 'loginPage');
  }

  get selectors() {
    return this.pageData.selectors;
  }

  loginWithUsernameOnly(username) {
    this.navigateToLogin();
    this.waitForPageLoad();
    this.enterUsername(username);
    this.clickLoginButton();
  }
}
```

## 🔄 Test Context Manager

### Store and Retrieve Data
```javascript
const { testContext } = require("../../support/utils/testContext");

// Store data
testContext.set('order_number', 'ORD123');
testContext.set('user_data', { id: 'csra', role: 'admin' });

// Retrieve data
const orderNumber = testContext.get('order_number');
const userData = testContext.get('user_data');

// Check if exists
if (testContext.has('order_number')) {
  // Do something
}
```

### Data Persistence Across Steps
```javascript
// Step 1: Place order
When("I place an order", () => {
  orderPage.placeOrder().then((orderNumber) => {
    testContext.set('generated_order_number', orderNumber);
  });
});

// Step 2: Use stored order number
When("I search for the order", () => {
  const orderNumber = testContext.get('generated_order_number');
  orderPage.searchOrder(orderNumber);
});
```

## ✅ Assertion Helper

### Store and Assert
```javascript
const { AssertionHelper } = require("../../support/utils/assertionHelper");

// Store actual and expected, then assert
AssertionHelper.assertAndStore('page_title', actualTitle, expectedTitle);

// Store for later assertion
AssertionHelper.storeForAssertion('user_name', actualName, expectedName);

// Assert stored values later
AssertionHelper.assertStoredValues('user_name');
```

### Specialized Assertions
```javascript
// Page title assertion
AssertionHelper.assertPageTitle('login', actualTitle, expectedTitle);

// Form field assertion
AssertionHelper.assertFormField('username', actualValue, expectedValue);

// API response assertion
AssertionHelper.assertApiResponse('/api/users', actualResponse, expectedResponse);
```

## 📝 Writing Tests

### BDD Feature Files

Create `.feature` files in `cypress/e2e/`:

```gherkin
Feature: Order Management Flow

  As a customer
  I want to place an order and verify it in order history
  So that I can track my purchases

  @smoke @order
  Scenario: Complete order placement and verification flow
    Given I am on the place order page
    When I place an order with the following details:
      | Product ID | Quantity | Order Type | Shipping Address |
      | PROD001    | 2        | standard    | home             |
    Then I should see order confirmation
    And I should get a unique order number
    When I navigate to order history
    And I search for the generated order number
    Then I should see the order in search results
```

### Step Definitions

Create corresponding `.js` files:

```javascript
const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");
const { OrderPage } = require("../../support/pages");
const { testContext } = require("../../support/utils/testContext");

const orderPage = new OrderPage();

When("I place an order with the following details:", (dataTable) => {
  const orderData = dataTable.rowsHash();
  
  // Store order details
  testContext.set('order_data_table', orderData);
  
  // Execute order flow
  orderPage.completeOrderFlow(
    orderData['Product ID'],
    parseInt(orderData['Quantity']),
    orderData['Order Type'],
    orderData['Shipping Address']
  ).then((orderNumber) => {
    testContext.set('generated_order_number', orderNumber);
  });
});
```

## 🗃️ Data Management

### Page-Specific Data Files

#### `cypress/fixtures/pages/loginData.json`
```json
{
  "validUsers": [
    {
      "id": "csra",
      "password": null,
      "description": "User with no password required"
    }
  ],
  "selectors": {
    "usernameInput": "input[name=\"username\"]",
    "loginButton": "button[type=\"submit\"]"
  },
  "expectedTexts": {
    "pageTitle": "Login"
  }
}
```

#### `cypress/fixtures/pages/orderData.json`
```json
{
  "products": [
    {
      "id": "PROD001",
      "name": "Test Product 1",
      "price": 29.99
    }
  ],
  "orderTypes": [
    {
      "id": "standard",
      "name": "Standard Order",
      "shippingTime": "3-5 business days"
    }
  ]
}
```

### Data Manager Usage
```javascript
const { dataManager } = require("../../support/utils/dataManager");

// Get page data
const loginData = dataManager.getLoginData();
const orderData = dataManager.getOrderData();

// Get specific data
const usernameSelector = dataManager.getSelector('login', 'usernameInput');
const expectedTitle = dataManager.getExpectedText('login', 'pageTitle');
const validUsers = dataManager.getValidUsers();
```

## 🔧 Custom Commands

### Built-in Commands

- **`cy.step(name, fn)`**: Creates Allure steps with screenshots
- **`cy.login(username, password?)`**: Handles login flow
- **`cy.usePageObject(pageClass)`**: Easy page object instantiation

### Creating Custom Commands

Add new commands in `cypress/support/commands.js`:

```javascript
Cypress.Commands.add("myCustomCommand", (param) => {
  // Your custom logic here
  cy.log(`Executing custom command with: ${param}`);
});
```

## 📊 Allure Reporting

### Features

- **Step-by-step logging**: Each step is logged with details
- **Screenshots**: Automatic screenshots after each step and test
- **Timeline view**: Visual representation of test execution
- **Environment info**: Test environment details
- **Attachments**: Screenshots, videos, and logs

### Report Structure

Each test run creates:
```
reports/
└── sms-2025-08-28-06-24pm/
    ├── allure-results/          # Raw results for Allure
    ├── allure-report/           # Generated HTML report
    ├── screenshots/             # Test screenshots
    └── videos/                  # Test recordings
```

## 🔌 API Testing

### Structure

```
cypress/e2e/api/
├── schemas/           # OpenAPI/JSON schemas
├── specs/             # API test features
└── schema.readme.md   # Implementation guide
```

### Example API Test

```gherkin
Feature: API Testing

  Scenario: Validate user endpoint
    When I send GET request to "/api/users"
    Then the response status should be 200
    And the response should match schema "user-schema.json"
```

## 📋 Available Scripts

- **`npm run clean`**: Clean all reports and artifacts
- **`npm run cypress:open`**: Open Cypress UI
- **`npm run cypress:run`**: Run tests in headless mode
- **`npm run report:generate`**: Generate Allure report
- **`npm run report:open`**: Open Allure report
- **`npm run test`**: Run tests and generate report

## 🎯 Best Practices

### DRY Approach

- Use custom commands for common operations
- Create utility functions for repeated logic
- Leverage fixtures for test data
- Use environment variables for configuration
- Implement Page Object Model for UI interactions
- Use Test Context Manager for data persistence

### Test Organization

- Group related tests in feature folders
- Use descriptive feature and scenario names
- Tag tests appropriately (`@smoke`, `@regression`, etc.)
- Keep step definitions focused and reusable
- Separate data from logic using fixtures

### Page Object Model

- Extend BasePage for all page objects
- Use data manager for selectors and expected values
- Store page-specific data in JSON files
- Implement reusable methods for common actions

### Test Context Usage

- Store generated data (order numbers, user IDs) for later use
- Use descriptive key names for stored data
- Clear context between tests (automatic)
- Store complex objects and arrays when needed

## 🚨 Troubleshooting

### Common Issues

1. **Cypress not found**: Run `npx cypress verify`
2. **Environment not loading**: Check `.env.dev` or `.env.qa` files
3. **Allure report not generating**: Ensure `allure-commandline` is installed
4. **Test context not persisting**: Ensure you're using the same test context instance

### Debug Mode

Enable debug logging:
```bash
DEBUG=cypress:* npm run cypress:run
```

### Inspect Test Context

```javascript
// Log all stored data
cy.log('Stored data:', JSON.stringify(testContext.getAll(), null, 2));

// Check specific key
if (testContext.has('order_number')) {
  cy.log('Order number found:', testContext.get('order_number'));
}
```

## 🔄 Framework Updates

To update dependencies:
```bash
npm update
npx cypress verify
```

## 📚 Additional Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Cucumber BDD](https://cucumber.io/docs/bdd/)
- [Allure Framework](https://docs.qameta.io/allure/)
- [JavaScript ES6+ Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Page Object Model](https://www.selenium.dev/documentation/test_practices/encouraged/page_object_models/)

## 🤝 Contributing

1. Follow the existing code structure
2. Add tests for new features
3. Update documentation as needed
4. Use JavaScript ES6+ features
5. Follow Page Object Model patterns
6. Use Test Context Manager for data persistence

## 🎉 What's New in JavaScript Version

- **100% JavaScript**: No TypeScript dependencies
- **ES6+ Features**: Modern JavaScript syntax and features
- **CommonJS Modules**: Standard Node.js module system
- **Simplified Setup**: Easier to get started and maintain
- **Same Functionality**: All features from TypeScript version preserved

---

**Framework**: Space (JavaScript Edition)  
**Version**: 1.0.0  
**Last Updated**: August 2025
