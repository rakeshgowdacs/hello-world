API testing scaffold

- Place OpenAPI/JSON schema files under `cypress/e2e/api/schemas/`.
- Use `cypress/e2e/api/specs/` for API feature tests.
- Example validation approach: import schema and validate `cy.request()` response body using `ajv` in custom helper.

Suggested structure:

```
cypress/e2e/api/
  schemas/
    example.json
  specs/
    example.feature
    example.steps.ts
```

