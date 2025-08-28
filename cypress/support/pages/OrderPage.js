const BasePage = require('./BasePage');
const { dataManager } = require('../utils/dataManager');

class OrderPage extends BasePage {
  constructor() {
    super();
    this.pageData = dataManager.getOrderData();
  }

  get url() {
    return dataManager.getUrl('order', 'placeOrderPage');
  }

  // Selectors directly in the page class - following POM best practices
  get selectors() {
    return {
      orderForm: '[data-testid="order-form"]',
      productSelect: '[data-testid="product-select"]',
      quantityInput: '[data-testid="quantity-input"]',
      orderTypeSelect: '[data-testid="order-type-select"]',
      shippingAddressSelect: '[data-testid="shipping-address-select"]',
      placeOrderButton: '[data-testid="place-order-button"]',
      orderConfirmation: '[data-testid="order-confirmation"]',
      orderNumber: '[data-testid="order-number"]',
      orderHistoryLink: '[data-testid="order-history-link"]',
      searchOrderInput: '[data-testid="search-order-input"]',
      searchButton: '[data-testid="search-button"]',
      orderHistoryTable: '[data-testid="order-history-table"]',
      orderRow: '[data-testid="order-row"]',
      orderStatus: '[data-testid="order-status"]'
    };
  }

  // Expected texts directly in the page class
  get expectedTexts() {
    return {
      orderConfirmationTitle: 'Order Confirmed',
      orderPlacedMessage: 'Your order has been placed successfully',
      orderHistoryTitle: 'Order History',
      searchPlaceholder: 'Search by order number, product, or date'
    };
  }

  // Order types directly in the page class
  get orderTypes() {
    return [
      {
        id: 'standard',
        name: 'Standard Order',
        description: 'Regular order with standard shipping',
        shippingTime: '3-5 business days'
      },
      {
        id: 'express',
        name: 'Express Order',
        description: 'Fast order with express shipping',
        shippingTime: '1-2 business days'
      },
      {
        id: 'overnight',
        name: 'Overnight Order',
        description: 'Urgent order with overnight shipping',
        shippingTime: 'Next business day'
      }
    ];
  }

  // Products directly in the page class
  get products() {
    return [
      {
        id: 'PROD001',
        name: 'Test Product 1',
        price: 29.99,
        quantity: 2,
        category: 'Electronics'
      },
      {
        id: 'PROD002',
        name: 'Test Product 2',
        price: 49.99,
        quantity: 1,
        category: 'Clothing'
      }
    ];
  }

  // Shipping addresses directly in the page class
  get shippingAddresses() {
    return [
      {
        id: 'home',
        type: 'Home Address',
        street: '123 Test Street',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        country: 'USA'
      },
      {
        id: 'office',
        type: 'Office Address',
        street: '456 Business Ave',
        city: 'Business City',
        state: 'BC',
        zipCode: '67890',
        country: 'USA'
      }
    ];
  }

  /**
   * Navigate to place order page
   */
  navigateToPlaceOrder() {
    return this.visit();
  }

  /**
   * Select product for order
   */
  selectProduct(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) {
      throw new Error(`Product with ID '${productId}' not found`);
    }

    // Store selected product in test context
    const { testContext } = require('../utils/testContext');
    testContext.set('selected_product', product);
    
    return this.getElement('productSelect').select(productId);
  }

  /**
   * Set quantity for selected product
   */
  setQuantity(quantity) {
    // Store quantity in test context
    const { testContext } = require('../utils/testContext');
    testContext.set('order_quantity', quantity);
    
    return this.getElement('quantityInput').clear().type(quantity.toString());
  }

  /**
   * Select order type
   */
  selectOrderType(orderTypeId) {
    const orderType = this.orderTypes.find(ot => ot.id === orderTypeId);
    if (!orderType) {
      throw new Error(`Order type with ID '${orderTypeId}' not found`);
    }

    // Store selected order type in test context
    const { testContext } = require('../utils/testContext');
    testContext.set('selected_order_type', orderType);
    
    return this.getElement('orderTypeSelect').select(orderTypeId);
  }

  /**
   * Select shipping address
   */
  selectShippingAddress(addressId) {
    const address = this.shippingAddresses.find(a => a.id === addressId);
    if (!address) {
      throw new Error(`Shipping address with ID '${addressId}' not found`);
    }

    // Store selected shipping address in test context
    const { testContext } = require('../utils/testContext');
    testContext.set('selected_shipping_address', address);
    
    return this.getElement('shippingAddressSelect').select(addressId);
  }

  /**
   * Place order
   */
  placeOrder() {
    // Store order timestamp
    const { testContext } = require('../utils/testContext');
    testContext.set('order_placed_timestamp', new Date().toISOString());
    
    return this.clickElement('placeOrderButton');
  }

  /**
   * Get order confirmation details
   */
  getOrderConfirmation() {
    return this.getElement('orderConfirmation');
  }

  /**
   * Extract and store order number
   */
  extractOrderNumber() {
    return this.getElement('orderNumber').invoke('text').then((orderNumberText) => {
      const orderNumber = orderNumberText.trim();
      
      // Store order number in test context for later use
      const { testContext } = require('../utils/testContext');
      testContext.set('generated_order_number', orderNumber);
      
      // Store complete order details
      const orderDetails = {
        orderNumber: orderNumber,
        product: testContext.get('selected_product'),
        quantity: testContext.get('order_quantity'),
        orderType: testContext.get('selected_order_type'),
        shippingAddress: testContext.get('selected_shipping_address'),
        timestamp: testContext.get('order_placed_timestamp'),
        totalAmount: this.calculateTotalAmount()
      };
      
      testContext.set('complete_order_details', orderDetails);
      
      return orderNumber;
    });
  }

  /**
   * Calculate total order amount
   */
  calculateTotalAmount() {
    const { testContext } = require('../utils/testContext');
    const product = testContext.get('selected_product');
    const quantity = testContext.get('order_quantity');
    return product.price * quantity;
  }

  /**
   * Navigate to order history
   */
  navigateToOrderHistory() {
    const orderHistoryUrl = dataManager.getUrl('order', 'orderHistoryPage');
    return cy.visit(orderHistoryUrl);
  }

  /**
   * Search for specific order
   */
  searchOrder(searchCriteria) {
    // Store search criteria in test context
    const { testContext } = require('../utils/testContext');
    testContext.set('search_criteria', searchCriteria);
    
    return this.getElement('searchOrderInput').clear().type(searchCriteria);
  }

  /**
   * Click search button
   */
  clickSearchButton() {
    return this.clickElement('searchButton');
  }

  /**
   * Verify order appears in search results
   */
  verifyOrderInResults(expectedOrderNumber) {
    // Store expected order number for verification
    const { testContext } = require('../utils/testContext');
    testContext.set('expected_order_number_in_results', expectedOrderNumber);
    
    return this.getElement('orderHistoryTable')
      .should('contain', expectedOrderNumber);
  }

  /**
   * Get order status from results
   */
  getOrderStatus(orderNumber) {
    return this.getElement('orderRow')
      .contains(orderNumber)
      .parent()
      .find(this.selectors.orderStatus)
      .invoke('text')
      .then((statusText) => {
        const status = statusText.trim();
        
        // Store order status in test context
        const { testContext } = require('../utils/testContext');
        testContext.set(`order_status_${orderNumber}`, status);
        
        return status;
      });
  }

  /**
   * Complete order placement flow
   */
  completeOrderFlow(productId, quantity, orderTypeId, addressId) {
    this.selectProduct(productId);
    this.setQuantity(quantity);
    this.selectOrderType(orderTypeId);
    this.selectShippingAddress(addressId);
    this.placeOrder();
    
    // Wait for order confirmation and extract order number
    this.getOrderConfirmation().should('be.visible');
    return this.extractOrderNumber();
  }

  /**
   * Get stored order details
   */
  getStoredOrderDetails() {
    const { testContext } = require('../utils/testContext');
    return testContext.get('complete_order_details');
  }

  /**
   * Get stored order number
   */
  getStoredOrderNumber() {
    const { testContext } = require('../utils/testContext');
    return testContext.get('generated_order_number');
  }
}

module.exports = OrderPage;