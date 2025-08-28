export interface TestData {
  [key: string]: any;
}

export class TestContext {
  private static instance: TestContext;
  private contextData: Map<string, any> = new Map();
  private testData: TestData = {};

  private constructor() {}

  public static getInstance(): TestContext {
    if (!TestContext.instance) {
      TestContext.instance = new TestContext();
    }
    return TestContext.instance;
  }

  /**
   * Store value in test context
   */
  public set(key: string, value: any): void {
    this.contextData.set(key, value);
    this.testData[key] = value;
  }

  /**
   * Get value from test context
   */
  public get<T>(key: string): T {
    if (!this.contextData.has(key)) {
      throw new Error(`Key '${key}' not found in test context`);
    }
    return this.contextData.get(key) as T;
  }

  /**
   * Get value with default if not exists
   */
  public getOrDefault<T>(key: string, defaultValue: T): T {
    return this.contextData.has(key) ? this.get<T>(key) : defaultValue;
  }

  /**
   * Check if key exists
   */
  public has(key: string): boolean {
    return this.contextData.has(key);
  }

  /**
   * Store multiple values at once
   */
  public setMultiple(data: TestData): void {
    Object.entries(data).forEach(([key, value]) => {
      this.set(key, value);
    });
  }

  /**
   * Get all stored data
   */
  public getAll(): TestData {
    return { ...this.testData };
  }

  /**
   * Clear specific key
   */
  public clear(key: string): void {
    this.contextData.delete(key);
    delete this.testData[key];
  }

  /**
   * Clear all test context (called between tests)
   */
  public clearAll(): void {
    this.contextData.clear();
    this.testData = {};
  }

  /**
   * Store actual value and expected value for comparison
   */
  public storeForAssertion(key: string, actualValue: any, expectedValue: any): void {
    this.set(`${key}_actual`, actualValue);
    this.set(`${key}_expected`, expectedValue);
  }

  /**
   * Assert stored actual vs expected values
   */
  public assertStoredValues(key: string): void {
    const actual = this.get(`${key}_actual`);
    const expected = this.get(`${key}_expected`);
    
    if (actual !== expected) {
      throw new Error(`Assertion failed for '${key}': Expected '${expected}', but got '${actual}'`);
    }
  }

  /**
   * Get actual value for assertion
   */
  public getActual<T>(key: string): T {
    return this.get<T>(`${key}_actual`);
  }

  /**
   * Get expected value for assertion
   */
  public getExpected<T>(key: string): T {
    return this.get<T>(`${key}_expected`);
  }

  /**
   * Store page title for later assertion
   */
  public storePageTitle(pageName: string, actualTitle: string): void {
    const expectedTitle = this.getExpected<string>(`${pageName}_title`) || 'Default Title';
    this.storeForAssertion(`${pageName}_title`, actualTitle, expectedTitle);
  }

  /**
   * Assert page title matches expected
   */
  public assertPageTitle(pageName: string): void {
    this.assertStoredValues(`${pageName}_title`);
  }

  /**
   * Store user data for testing
   */
  public storeUserData(userId: string, userData: any): void {
    this.set(`user_${userId}`, userData);
  }

  /**
   * Get user data by ID
   */
  public getUserData<T>(userId: string): T {
    return this.get<T>(`user_${userId}`);
  }

  /**
   * Store form data for validation
   */
  public storeFormData(formName: string, formData: any): void {
    this.set(`form_${formName}`, formData);
  }

  /**
   * Get form data by name
   */
  public getFormData<T>(formName: string): T {
    return this.get<T>(`form_${formName}`);
  }

  /**
   * Store API response for validation
   */
  public storeApiResponse(endpoint: string, response: any): void {
    this.set(`api_${endpoint}`, response);
  }

  /**
   * Get API response by endpoint
   */
  public getApiResponse<T>(endpoint: string): T {
    return this.get<T>(`api_${endpoint}`);
  }
}

// Export singleton instance
export const testContext = TestContext.getInstance();