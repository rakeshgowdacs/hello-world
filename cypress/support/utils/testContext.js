class TestContext {
  constructor() {
    this.contextData = new Map();
    this.testData = {};
  }

  /**
   * Store value in test context
   */
  set(key, value) {
    this.contextData.set(key, value);
    this.testData[key] = value;
  }

  /**
   * Get value from test context
   */
  get(key) {
    if (!this.contextData.has(key)) {
      throw new Error(`Key '${key}' not found in test context`);
    }
    return this.contextData.get(key);
  }

  /**
   * Get value with default if not exists
   */
  getOrDefault(key, defaultValue) {
    return this.contextData.has(key) ? this.get(key) : defaultValue;
  }

  /**
   * Check if key exists
   */
  has(key) {
    return this.contextData.has(key);
  }

  /**
   * Store multiple values at once
   */
  setMultiple(data) {
    Object.entries(data).forEach(([key, value]) => {
      this.set(key, value);
    });
  }

  /**
   * Get all stored data
   */
  getAll() {
    return { ...this.testData };
  }

  /**
   * Clear specific key
   */
  clear(key) {
    this.contextData.delete(key);
    delete this.testData[key];
  }

  /**
   * Clear all test context (called between tests)
   */
  clearAll() {
    this.contextData.clear();
    this.testData = {};
  }

  /**
   * Store actual value and expected value for comparison
   */
  storeForAssertion(key, actualValue, expectedValue) {
    this.set(`${key}_actual`, actualValue);
    this.set(`${key}_expected`, expectedValue);
  }

  /**
   * Assert stored actual vs expected values
   */
  assertStoredValues(key) {
    const actual = this.get(`${key}_actual`);
    const expected = this.get(`${key}_expected`);
    
    if (actual !== expected) {
      throw new Error(`Assertion failed for '${key}': Expected '${expected}', but got '${actual}'`);
    }
  }

  /**
   * Get actual value for assertion
   */
  getActual(key) {
    return this.get(`${key}_actual`);
  }

  /**
   * Get expected value for assertion
   */
  getExpected(key) {
    return this.get(`${key}_expected`);
  }

  /**
   * Store page title for later assertion
   */
  storePageTitle(pageName, actualTitle) {
    const expectedTitle = this.getExpected(`${pageName}_title`) || 'Default Title';
    this.storeForAssertion(`${pageName}_title`, actualTitle, expectedTitle);
  }

  /**
   * Assert page title matches expected
   */
  assertPageTitle(pageName) {
    this.assertStoredValues(`${pageName}_title`);
  }

  /**
   * Store user data for testing
   */
  storeUserData(userId, userData) {
    this.set(`user_${userId}`, userData);
  }

  /**
   * Get user data by ID
   */
  getUserData(userId) {
    return this.get(`user_${userId}`);
  }

  /**
   * Store form data for validation
   */
  storeFormData(formName, formData) {
    this.set(`form_${formName}`, formData);
  }

  /**
   * Get form data by name
   */
  getFormData(formName) {
    return this.get(`form_${formName}`);
  }

  /**
   * Store API response for validation
   */
  storeApiResponse(endpoint, response) {
    this.set(`api_${endpoint}`, response);
  }

  /**
   * Get API response by endpoint
   */
  getApiResponse(endpoint) {
    return this.get(`api_${endpoint}`);
  }
}

// Export singleton instance
const testContext = new TestContext();

module.exports = {
  testContext,
  TestContext
};