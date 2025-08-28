import { BasePage } from './BasePage';
import { dataManager } from '../utils/dataManager';
import { testContext } from '../utils/testContext';

export class OrderPage extends BasePage {
  private readonly pageData = dataManager.getOrderData();

  protected get url(): string {
    return dataManager.getUrl('order', 'placeOrderPage');
  }

  protected get selectors(): Record<string, string> {
    return this.pageData.selectors;
  }

  /**
   * Navigate to place order page
   */
  navigateToPlaceOrder(): Cypress.Chainable<Cypress.AUTWindow> {
    return this.visit();
  }

  /**
   * Select product for order
   */
  selectProduct(productId: string): Cypress.Chainable<JQuery<HTMLElement>> {
    const product = this.pageData.products.find(p => p.id === productId);
    if (!product) {
      throw new Error(`Product with ID '${productId}' not found`);
    }

    // Store selected product in test context
    testContext.set('selected_product', product);
    
    return this.getElement('productSelect').select(productId);
  }

  /**
   * Set quantity for selected product
   */
  setQuantity(quantity: number): Cypress.Chainable<JQuery<HTMLElement>> {
    // Store quantity in test context
    testContext.set('order_quantity', quantity);
    
    return this.getElement('quantityInput').clear().type(quantity.toString());
  }

  /**
   * Select order type
   */
  selectOrderType(orderTypeId: string): Cypress.Chainable<JQuery<HTMLElement>> {
    const orderType = this.pageData.orderTypes.find(ot => ot.id === orderTypeId);
    if (!orderType) {
      throw new Error(`Order type with ID '${orderTypeId}' not found`);
    }

    // Store selected order type in test context
    testContext.set('selected_order_type', orderType);
    
    return this.getElement('orderTypeSelect').select(orderTypeId);
  }

  /**
   * Select shipping address
   */
  selectShippingAddress(addressId: string): Cypress.Chainable<JQuery<HTMLElement>> {
    const address = this.pageData.shippingAddresses.find(a => a.id === addressId);
    if (!address) {
      throw new Error(`Shipping address with ID '${addressId}' not found`);
    }

    // Store selected shipping address in test context
    testContext.set('selected_shipping_address', address);
    
    return this.getElement('shippingAddressSelect').select(addressId);
  }

  /**
   * Place order
   */
  placeOrder(): Cypress.Chainable<JQuery<HTMLElement>> {
    // Store order timestamp
    testContext.set('order_placed_timestamp', new Date().toISOString());
    
    return this.clickElement('placeOrderButton');
  }

  /**
   * Get order confirmation details
   */
  getOrderConfirmation(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getElement('orderConfirmation');
  }

  /**
   * Extract and store order number
   */
  extractOrderNumber(): Cypress.Chainable<string> {
    return this.getElement('orderNumber').invoke('text').then((orderNumberText) => {
      const orderNumber = orderNumberText.trim();
      
      // Store order number in test context for later use
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
  private calculateTotalAmount(): number {
    const product = testContext.get('selected_product');
    const quantity = testContext.get('order_quantity');
    return product.price * quantity;
  }

  /**
   * Navigate to order history
   */
  navigateToOrderHistory(): Cypress.Chainable<Cypress.AUTWindow> {
    const orderHistoryUrl = dataManager.getUrl('order', 'orderHistoryPage');
    return cy.visit(orderHistoryUrl);
  }

  /**
   * Search for specific order
   */
  searchOrder(searchCriteria: string): Cypress.Chainable<JQuery<HTMLElement>> {
    // Store search criteria in test context
    testContext.set('search_criteria', searchCriteria);
    
    return this.getElement('searchOrderInput').clear().type(searchCriteria);
  }

  /**
   * Click search button
   */
  clickSearchButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.clickElement('searchButton');
  }

  /**
   * Verify order appears in search results
   */
  verifyOrderInResults(expectedOrderNumber: string): Cypress.Chainable<JQuery<HTMLElement>> {
    // Store expected order number for verification
    testContext.set('expected_order_number_in_results', expectedOrderNumber);
    
    return this.getElement('orderHistoryTable')
      .should('contain', expectedOrderNumber);
  }

  /**
   * Get order status from results
   */
  getOrderStatus(orderNumber: string): Cypress.Chainable<string> {
    return this.getElement('orderRow')
      .contains(orderNumber)
      .parent()
      .find(this.selectors.orderStatus)
      .invoke('text')
      .then((statusText) => {
        const status = statusText.trim();
        
        // Store order status in test context
        testContext.set(`order_status_${orderNumber}`, status);
        
        return status;
      });
  }

  /**
   * Complete order placement flow
   */
  completeOrderFlow(productId: string, quantity: number, orderTypeId: string, addressId: string): Cypress.Chainable<string> {
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
  getStoredOrderDetails(): any {
    return testContext.get('complete_order_details');
  }

  /**
   * Get stored order number
   */
  getStoredOrderNumber(): string {
    return testContext.get('generated_order_number');
  }
}