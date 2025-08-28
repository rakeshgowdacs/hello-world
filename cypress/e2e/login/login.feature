Feature: Login

  As an SMS user
  I want to login with my user id
  So that I can access the application

  @smoke
  Scenario: Successful login with user id only
    Given I am on the login page
    When I login with user id "csra" and no password
    Then I should see the dashboard

  @regression
  Scenario Outline: Login with valid credentials
    Given I have valid login credentials
    When I login with valid credentials
    Then I should be successfully logged in

    Examples:
      | Test Case | Description |
      | TC001     | Login with username only |
      | TC002     | Login with username and password |

  @negative
  Scenario Outline: Login with invalid credentials
    Given I have invalid login credentials
    When I login with invalid credentials
    Then I should see an error message

    Examples:
      | Test Case | Description |
      | TC003     | Invalid username |
      | TC004     | Empty username |
      | TC005     | Wrong password |