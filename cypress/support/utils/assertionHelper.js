const { testContext } = require('./testContext');

class AssertionHelper {
  /**
   * Store actual and expected values for later assertion
   */
  static storeForAssertion(key, actualValue, expectedValue) {
    testContext.storeForAssertion(key, actualValue, expectedValue);
  }

  /**
   * Assert stored values match
   */
  static assertStoredValues(key) {
    testContext.assertStoredValues(key);
  }

  /**
   * Store and assert immediately
   */
  static assertAndStore(key, actualValue, expectedValue) {
    this.storeForAssertion(key, actualValue, expectedValue);
    this.assertStoredValues(key);
  }

  /**
   * Store page title and assert against expected
   */
  static assertPageTitle(pageName, actualTitle, expectedTitle) {
    testContext.storePageTitle(pageName, actualTitle);
    testContext.set(`${pageName}_title_expected`, expectedTitle);
    testContext.assertPageTitle(pageName);
  }

  /**
   * Store form field value and assert
   */
  static assertFormField(fieldName, actualValue, expectedValue) {
    this.assertAndStore(`form_${fieldName}`, actualValue, expectedValue);
  }

  /**
   * Store user data and assert
   */
  static assertUserData(userId, actualData, expectedData) {
    this.assertAndStore(`user_${userId}`, actualData, expectedData);
  }

  /**
   * Store API response and assert
   */
  static assertApiResponse(endpoint, actualResponse, expectedResponse) {
    this.assertAndStore(`api_${endpoint}`, actualResponse, expectedResponse);
  }

  /**
   * Store element text and assert
   */
  static assertElementText(elementName, actualText, expectedText) {
    this.assertAndStore(`element_${elementName}`, actualText, expectedText);
  }

  /**
   * Store element count and assert
   */
  static assertElementCount(elementName, actualCount, expectedCount) {
    this.assertAndStore(`count_${elementName}`, actualCount, expectedCount);
  }

  /**
   * Store URL and assert
   */
  static assertUrl(actualUrl, expectedUrl) {
    this.assertAndStore('current_url', actualUrl, expectedUrl);
  }

  /**
   * Store boolean value and assert
   */
  static assertBoolean(key, actualValue, expectedValue) {
    this.assertAndStore(`bool_${key}`, actualValue, expectedValue);
  }

  /**
   * Store array and assert length
   */
  static assertArrayLength(arrayName, actualArray, expectedLength) {
    this.assertAndStore(`array_length_${arrayName}`, actualArray.length, expectedLength);
  }

  /**
   * Store object and assert property
   */
  static assertObjectProperty(objectName, propertyName, actualValue, expectedValue) {
    this.assertAndStore(`obj_${objectName}_${propertyName}`, actualValue, expectedValue);
  }
}

module.exports = {
  AssertionHelper
};