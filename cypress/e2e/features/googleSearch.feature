Feature: Google Search Functionality
  As a user
  I want to search for information on Google
  So that I can find relevant results

  Background:
    Given I navigate to Google home page

  @smoke @regression
  Scenario: Perform a basic search on Google
    Given I am on the Google home page
    When I enter "Cypress Automation Testing" in the search box
    And I click the search button
    Then I should see search results
    And the search results should contain "Cypress"
    And I should see search statistics

  @regression
  Scenario: Verify Google home page elements
    Given I am on the Google home page
    Then I should see the Google logo
    And I should see the search box
    And I should see the "Google Search" button
    And I should see the "I'm Feeling Lucky" button

  @regression  
  Scenario: Search with different terms
    Given I am on the Google home page
    When I enter "Space Automation Framework" in the search box
    And I click the search button
    Then I should see search results
    And I should be on the search results page