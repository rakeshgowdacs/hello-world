import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { OrderPage } from "@support/pages";
import { testContext } from "@support/utils/testContext";
import { AssertionHelper } from "@support/utils/assertionHelper";

const orderPage = new OrderPage();

Given("I am on the place order page", () => {
  orderPage.navigateToPlaceOrder();
  
  // Store page load timestamp
  testContext.set('page_load_timestamp', new Date().toISOString());
});

When("I place an order with the following details:", (dataTable) => {
  const orderData = dataTable.rowsHash();
  
  // Store order details from data table
  testContext.set('order_data_table', orderData);
  
  // Execute order flow using stored data
  orderPage.completeOrderFlow(
    orderData['Product ID'],
    parseInt(orderData['Quantity']),
    orderData['Order Type'],
    orderData['Shipping Address']
  ).then((orderNumber) => {
    // Store the generated order number for later use
    testContext.set('generated_order_number', orderNumber);
    
    // Log order details for debugging
    cy.log(`Order placed successfully with number: ${orderNumber}`);
  });
});

Then("I should see order confirmation", () => {
  orderPage.getOrderConfirmation().should('be.visible');
  
  // Store confirmation timestamp
  testContext.set('confirmation_timestamp', new Date().toISOString());
});

And("I should get a unique order number", () => {
  // Get the stored order number
  const orderNumber = testContext.get('generated_order_number');
  expect(orderNumber).to.be.a('string');
  expect(orderNumber.length).to.be.greaterThan(0);
  
  // Store for later verification
  testContext.set('order_number_for_verification', orderNumber);
});

When("I navigate to order history", () => {
  orderPage.navigateToOrderHistory();
  
  // Store navigation timestamp
  testContext.set('history_navigation_timestamp', new Date().toISOString());
});

And("I search for the generated order number", () => {
  // Get the stored order number
  const orderNumber = testContext.get('generated_order_number');
  
  // Search for the order
  orderPage.searchOrder(orderNumber);
  orderPage.clickSearchButton();
  
  // Store search timestamp
  testContext.set('search_timestamp', new Date().toISOString());
});

Then("I should see the order in search results", () => {
  // Get the stored order number
  const orderNumber = testContext.get('generated_order_number');
  
  // Verify order appears in results
  orderPage.verifyOrderInResults(orderNumber);
  
  // Store verification timestamp
  testContext.set('verification_timestamp', new Date().toISOString());
});

And("the order status should be {string}", (expectedStatus: string) => {
  // Get the stored order number
  const orderNumber = testContext.get('generated_order_number');
  
  // Get and verify order status
  orderPage.getOrderStatus(orderNumber).then((actualStatus) => {
    // Store actual status for comparison
    testContext.set('actual_order_status', actualStatus);
    testContext.set('expected_order_status', expectedStatus);
    
    // Assert status matches expected
    AssertionHelper.assertAndStore('order_status', actualStatus, expectedStatus);
  });
});

// Additional step definitions for data persistence verification
When("I select product {string}", (productId: string) => {
  orderPage.selectProduct(productId);
  
  // Verify product was stored in context
  const storedProduct = testContext.get('selected_product');
  expect(storedProduct.id).to.equal(productId);
});

And("I set quantity to {int}", (quantity: number) => {
  orderPage.setQuantity(quantity);
  
  // Verify quantity was stored in context
  const storedQuantity = testContext.get('order_quantity');
  expect(storedQuantity).to.equal(quantity);
});

And("I select order type {string}", (orderTypeId: string) => {
  orderPage.selectOrderType(orderTypeId);
  
  // Verify order type was stored in context
  const storedOrderType = testContext.get('selected_order_type');
  expect(storedOrderType.id).to.equal(orderTypeId);
});

And("I select shipping address {string}", (addressId: string) => {
  orderPage.selectShippingAddress(addressId);
  
  // Verify shipping address was stored in context
  const storedAddress = testContext.get('selected_shipping_address');
  expect(storedAddress.id).to.equal(addressId);
});

Then("the stored order details should contain:", (dataTable) => {
  const expectedData = dataTable.rowsHash();
  
  // Verify each field was stored correctly
  Object.entries(expectedData).forEach(([field, expectedValue]) => {
    let actualValue;
    
    switch (field) {
      case 'Product ID':
        actualValue = testContext.get('selected_product').id;
        break;
      case 'Quantity':
        actualValue = testContext.get('order_quantity');
        break;
      case 'Order Type':
        actualValue = testContext.get('selected_order_type').id;
        break;
      case 'Shipping Address':
        actualValue = testContext.get('selected_shipping_address').id;
        break;
      default:
        throw new Error(`Unknown field: ${field}`);
    }
    
    // Store for assertion
    testContext.set(`${field.toLowerCase().replace(/\s+/g, '_')}_actual`, actualValue);
    testContext.set(`${field.toLowerCase().replace(/\s+/g, '_')}_expected`, expectedValue);
    
    // Assert using helper
    AssertionHelper.assertAndStore(
      `order_field_${field.toLowerCase().replace(/\s+/g, '_')}`,
      actualValue,
      expectedValue
    );
  });
});

When("I place the order", () => {
  orderPage.placeOrder();
  
  // Store placement timestamp
  testContext.set('order_placement_timestamp', new Date().toISOString());
});

And("I extract the order number", () => {
  orderPage.extractOrderNumber().then((orderNumber) => {
    // Verify order number was extracted and stored
    expect(orderNumber).to.be.a('string');
    expect(orderNumber.length).to.be.greaterThan(0);
    
    // Store for later use
    testContext.set('extracted_order_number', orderNumber);
  });
});

Then("the complete order details should be stored", () => {
  // Get complete order details
  const orderDetails = testContext.get('complete_order_details');
  
  // Verify all required fields are present
  expect(orderDetails).to.have.property('orderNumber');
  expect(orderDetails).to.have.property('product');
  expect(orderDetails).to.have.property('quantity');
  expect(orderDetails).to.have.property('orderType');
  expect(orderDetails).to.have.property('shippingAddress');
  expect(orderDetails).to.have.property('timestamp');
  expect(orderDetails).to.have.property('totalAmount');
  
  // Store for verification
  testContext.set('verified_order_details', orderDetails);
  
  // Log complete order details
  cy.log('Complete order details stored:', JSON.stringify(orderDetails, null, 2));
});

And("I can retrieve the order number for later use", () => {
  // Demonstrate retrieving stored order number
  const orderNumber = testContext.get('generated_order_number');
  const extractedOrderNumber = testContext.get('extracted_order_number');
  
  // Verify both are the same
  expect(orderNumber).to.equal(extractedOrderNumber);
  
  // Store for demonstration
  testContext.set('retrieved_order_number', orderNumber);
  
  // Log the retrieved order number
  cy.log(`Retrieved order number for later use: ${orderNumber}`);
  
  // Demonstrate using stored order number in a different context
  testContext.set('order_number_for_api_call', orderNumber);
  testContext.set('order_number_for_database_query', orderNumber);
  testContext.set('order_number_for_email_verification', orderNumber);
});