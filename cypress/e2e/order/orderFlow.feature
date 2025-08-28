Feature: Order Management Flow

  As a customer
  I want to place an order and verify it in order history
  So that I can track my purchases

  @smoke @order
  Scenario: Complete order placement and verification flow
    Given I am on the place order page
    When I place an order with the following details:
      | Product ID | Quantity | Order Type | Shipping Address |
      | PROD001    | 2        | standard    | home             |
    Then I should see order confirmation
    And I should get a unique order number
    When I navigate to order history
    And I search for the generated order number
    Then I should see the order in search results
    And the order status should be "Processing"

  @regression @order
  Scenario Outline: Place different types of orders
    Given I am on the place order page
    When I place an order with the following details:
      | Product ID | Quantity | Order Type | Shipping Address |
      | <Product>  | <Qty>    | <Type>     | <Address>        |
    Then I should see order confirmation
    And I should get a unique order number
    When I navigate to order history
    And I search for the generated order number
    Then I should see the order in search results

    Examples:
      | Product  | Qty | Type     | Address |
      | PROD001  | 1   | express  | home    |
      | PROD002  | 3   | overnight| office  |
      | PROD001  | 2   | standard | home    |

  @negative @order
  Scenario: Verify order details persistence across steps
    Given I am on the place order page
    When I select product "PROD001"
    And I set quantity to 2
    And I select order type "express"
    And I select shipping address "home"
    Then the stored order details should contain:
      | Field           | Expected Value |
      | Product ID      | PROD001        |
      | Quantity        | 2              |
      | Order Type      | express        |
      | Shipping Address| home           |
    When I place the order
    And I extract the order number
    Then the complete order details should be stored
    And I can retrieve the order number for later use