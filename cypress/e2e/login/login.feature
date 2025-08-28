Feature: Login

  As an SMS user
  I want to login with my user id
  So that I can access the application

  @smoke
  Scenario: Successful login with user id only
    Given I am on the login page
    When I login with user id "csra" and no password
    Then I should see the dashboard

