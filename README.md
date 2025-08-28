# Space - Cypress BDD Automation Framework

A robust Cypress automation framework with BDD (Behavior Driven Development), Allure reporting, and comprehensive utilities built with a DRY (Don't Repeat Yourself) approach.

## 🚀 Features

- **BDD with Cucumber**: Write tests in natural language using `.feature` files
- **Allure Reporting**: Rich HTML reports with step-by-step logging and screenshots
- **Timestamped Runs**: Each test run creates a unique folder with timestamp (e.g., `sms-2025-08-28-06-24pm`)
- **Environment Configuration**: Separate configs for dev and qa environments
- **Generic Utilities**: Date generators, test data loaders, result savers
- **API Testing Scaffold**: Ready structure for API testing with schema validation
- **Data-Driven Testing**: Support for fixtures and parameterized tests
- **Custom Commands**: Reusable commands for common operations
- **TypeScript Support**: Full type safety and IntelliSense

## 📁 Project Structure

```
space/
├── cypress/
│   ├── e2e/
│   │   ├── login/
│   │   │   ├── login.feature          # BDD feature file
│   │   │   └── login.steps.ts         # Step definitions
│   │   └── api/
│   │       └── schema.readme.md       # API testing guide
│   ├── fixtures/
│   │   └── example/
│   │       └── users.json             # Test data
│   └── support/
│       ├── e2e.ts                     # Global support file
│       ├── commands.ts                 # Custom commands
│       └── utils/
│           ├── date.ts                 # Date utilities
│           └── data.ts                 # Data utilities
├── reports/                            # Test run reports (auto-generated)
├── .env.dev                           # Development environment config
├── .env.qa                            # QA environment config
├── cypress.config.ts                  # Cypress configuration
├── tsconfig.json                      # TypeScript configuration
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

## 📝 Writing Tests

### BDD Feature Files

Create `.feature` files in `cypress/e2e/`:

```gherkin
Feature: Login

  As an SMS user
  I want to login with my user id
  So that I can access the application

  @smoke
  Scenario: Successful login with user id only
    Given I am on the login page
    When I login with user id "csra" and no password
    Then I should see the dashboard
```

### Step Definitions

Create corresponding `.steps.ts` files:

```typescript
import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("I am on the login page", () => {
  cy.visit("/");
});

When("I login with user id {string} and no password", (userId: string) => {
  cy.login(userId);
});

Then("I should see the dashboard", () => {
  cy.contains(/dashboard|home|welcome/i, { timeout: 20000 }).should("be.visible");
});
```

## 🔧 Custom Commands

### Built-in Commands

- **`cy.step(name, fn)`**: Creates Allure steps with screenshots
- **`cy.login(username, password?)`**: Handles login flow

### Creating Custom Commands

Add new commands in `cypress/support/commands.ts`:

```typescript
declare global {
  namespace Cypress {
    interface Chainable {
      myCustomCommand(param: string): Chainable;
    }
  }
}

Cypress.Commands.add("myCustomCommand", (param: string) => {
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

## 🗃️ Data Management

### Loading Test Data

```typescript
import { loadJsonFixture } from "@utils/data";

const users = loadJsonFixture("example/users.json");
cy.login(users[0].id);
```

### Saving Expected Results

```typescript
import { saveExpectedResult } from "@utils/data";

saveExpectedResult("expected/results.json", actualData);
```

### Date Utilities

```typescript
import { formatRunTimestamp } from "@utils/date";

const timestamp = formatRunTimestamp(); // sms-2025-08-28-06-24pm
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

### Test Organization

- Group related tests in feature folders
- Use descriptive feature and scenario names
- Tag tests appropriately (`@smoke`, `@regression`, etc.)
- Keep step definitions focused and reusable

### Reporting

- Use `cy.step()` for meaningful step logging
- Add descriptive step names
- Leverage Allure attachments for debugging
- Review reports after each test run

## 🚨 Troubleshooting

### Common Issues

1. **Cypress not found**: Run `npx cypress verify`
2. **Environment not loading**: Check `.env.dev` or `.env.qa` files
3. **Allure report not generating**: Ensure `allure-commandline` is installed
4. **TypeScript errors**: Run `npx tsc --noEmit` to check types

### Debug Mode

Enable debug logging:
```bash
DEBUG=cypress:* npm run cypress:run
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
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

1. Follow the existing code structure
2. Add tests for new features
3. Update documentation as needed
4. Use TypeScript for type safety

---

**Framework**: Space  
**Version**: 1.0.0  
**Last Updated**: August 2025
