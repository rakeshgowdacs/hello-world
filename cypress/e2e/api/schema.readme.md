# API Testing Guide

## Structure

The API testing framework is organized as follows:

```
cypress/e2e/api/
├── schemas/           # OpenAPI/JSON schemas
├── specs/             # API test features
└── schema.readme.md   # This guide
```

## Getting Started

### 1. Create API Schema Files

Place your OpenAPI/JSON schema files in the `schemas/` directory:

```json
// schemas/user-schema.json
{
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "name": { "type": "string" },
    "email": { "type": "string" }
  },
  "required": ["id", "name", "email"]
}
```

### 2. Create API Test Features

Create `.feature` files in the `specs/` directory:

```gherkin
Feature: User API

  Scenario: Get user by ID
    When I send GET request to "/api/users/123"
    Then the response status should be 200
    And the response should match schema "user-schema.json"
```

### 3. Implement Step Definitions

Create corresponding `.js` files for your step definitions:

```javascript
const { When, Then } = require("@badeball/cypress-cucumber-preprocessor");

When("I send GET request to {string}", (endpoint) => {
  cy.request(`GET`, endpoint).as('apiResponse');
});

Then("the response status should be {int}", (statusCode) => {
  cy.get('@apiResponse').its('status').should('eq', statusCode);
});

Then("the response should match schema {string}", (schemaFile) => {
  // Implement schema validation logic here
  cy.get('@apiResponse').then((response) => {
    // Validate response against schema
  });
});
```

## Best Practices

1. **Use Test Context**: Store API responses for later validation
2. **Schema Validation**: Validate responses against OpenAPI schemas
3. **Environment Variables**: Use different base URLs for dev/qa
4. **Error Handling**: Test both success and error scenarios
5. **Data Cleanup**: Clean up test data after tests

## Example API Test Flow

```javascript
// Store API response in test context
cy.request('GET', '/api/users').then((response) => {
  testContext.set('users_response', response.body);
  
  // Validate response
  expect(response.status).to.equal(200);
  expect(response.body).to.have.property('users');
});
```

## Integration with Test Context

The API testing framework integrates with the Test Context Manager:

```javascript
// Store API response
testContext.set('api_users_response', response.body);

// Use in later steps
const users = testContext.get('api_users_response');
cy.log(`Found ${users.length} users`);
```

## Next Steps

1. Create your API schemas
2. Write feature files for your API endpoints
3. Implement step definitions
4. Run your API tests with: `npm run cypress:run --spec "cypress/e2e/api/**/*.feature"`