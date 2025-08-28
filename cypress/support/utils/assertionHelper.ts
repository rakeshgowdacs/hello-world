import { testContext } from './testContext';

export class AssertionHelper {
  /**
   * Store actual and expected values for later assertion
   */
  static storeForAssertion(key: string, actualValue: any, expectedValue: any): void {
    testContext.storeForAssertion(key, actualValue, expectedValue);
  }

  /**
   * Assert stored values match
   */
  static assertStoredValues(key: string): void {
    testContext.assertStoredValues(key);
  }

  /**
   * Store and assert immediately
   */
  static assertAndStore(key: string, actualValue: any, expectedValue: any): void {
    this.storeForAssertion(key, actualValue, expectedValue);
    this.assertStoredValues(key);
  }

  /**
   * Store page title and assert against expected
   */
  static assertPageTitle(pageName: string, actualTitle: string, expectedTitle: string): void {
    testContext.storePageTitle(pageName, actualTitle);
    testContext.set(`${pageName}_title_expected`, expectedTitle);
    testContext.assertPageTitle(pageName);
  }

  /**
   * Store form field value and assert
   */
  static assertFormField(fieldName: string, actualValue: string, expectedValue: string): void {
    this.assertAndStore(`form_${fieldName}`, actualValue, expectedValue);
  }

  /**
   * Store user data and assert
   */
  static assertUserData(userId: string, actualData: any, expectedData: any): void {
    this.assertAndStore(`user_${userId}`, actualData, expectedData);
  }

  /**
   * Store API response and assert
   */
  static assertApiResponse(endpoint: string, actualResponse: any, expectedResponse: any): void {
    this.assertAndStore(`api_${endpoint}`, actualResponse, expectedResponse);
  }

  /**
   * Store element text and assert
   */
  static assertElementText(elementName: string, actualText: string, expectedText: string): void {
    this.assertAndStore(`element_${elementName}`, actualText, expectedText);
  }

  /**
   * Store element count and assert
   */
  static assertElementCount(elementName: string, actualCount: number, expectedCount: number): void {
    this.assertAndStore(`count_${elementName}`, actualCount, expectedCount);
  }

  /**
   * Store URL and assert
   */
  static assertUrl(actualUrl: string, expectedUrl: string): void {
    this.assertAndStore('current_url', actualUrl, expectedUrl);
  }

  /**
   * Store boolean value and assert
   */
  static assertBoolean(key: string, actualValue: boolean, expectedValue: boolean): void {
    this.assertAndStore(`bool_${key}`, actualValue, expectedValue);
  }

  /**
   * Store array and assert length
   */
  static assertArrayLength(arrayName: string, actualArray: any[], expectedLength: number): void {
    this.assertAndStore(`array_length_${arrayName}`, actualArray.length, expectedLength);
  }

  /**
   * Store object and assert property
   */
  static assertObjectProperty(objectName: string, propertyName: string, actualValue: any, expectedValue: any): void {
    this.assertAndStore(`obj_${objectName}_${propertyName}`, actualValue, expectedValue);
  }
}