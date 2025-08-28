/**
 * Google Search Results Page Object for Space Automation Framework
 * Contains methods and locators specific to Google's search results page
 */

const BasePage = require('./basePage');
const Logger = require('../utils/logger');
const ScreenshotHelper = require('../utils/screenshotHelper');

class GoogleSearchResultsPage extends BasePage {
  constructor() {
    super();
    
    // Page locators
    this.locators = {
      searchBox: 'textarea[name="q"]',
      searchBoxAlternate: 'input[name="q"]',
      searchResults: '[data-ved] h3',
      searchResultsAlternate: '.g h3',
      searchResultLinks: '[data-ved] h3 a',
      searchResultsContainer: '#search',
      searchStats: '#result-stats',
      nextPageButton: 'a[aria-label="Next page"]',
      previousPageButton: 'a[aria-label="Previous page"]',
      pageNumbers: 'td a',
      suggestedSearches: '[data-ved] .BNeawe.s3v9rd.AP7Wnd',
      googleLogo: 'img[alt="Google"]',
      searchFilters: '#hdtb-msb-vis',
      allFilter: 'a[data-ved][href*="tbm="]',
      imagesFilter: 'a[href*="tbm=isch"]',
      videosFilter: 'a[href*="tbm=vid"]',
      newsFilter: 'a[href*="tbm=nws"]',
      mapsFilter: 'a[href*="tbm=map"]',
      shoppingFilter: 'a[href*="tbm=shop"]'
    };
  }

  /**
   * Verify that search results page has loaded
   * @param {string} searchTerm - The search term to verify
   * @returns {GoogleSearchResultsPage} Current page instance
   */
  verifySearchResultsLoaded(searchTerm = '') {
    Logger.info(`Verifying search results page loaded${searchTerm ? ` for '${searchTerm}'` : ''}`);
    
    cy.allure().step('Verify search results page loaded', () => {
      // Verify URL contains search
      cy.url().should('include', '/search');
      
      // Verify search box is visible and contains search term
      this.verifySearchBoxVisible();
      
      if (searchTerm) {
        this.verifySearchBoxContainsText(searchTerm);
      }
      
      // Verify search results container is visible
      this.verifyElementVisible(this.locators.searchResultsContainer, 'Search Results Container');
      
      // Verify search stats are visible
      this.verifySearchStatsVisible();
      
      // Take full page screenshot
      this.takeFullPageScreenshot('google_search_results_page');
    });
    
    Logger.success('Search results page loaded successfully');
    return this;
  }

  /**
   * Verify search box is visible
   * @returns {GoogleSearchResultsPage} Current page instance
   */
  verifySearchBoxVisible() {
    Logger.info('Verifying search box is visible on results page');
    
    cy.allure().step('Verify search box is visible', () => {
      cy.get('body').then(($body) => {
        if ($body.find(this.locators.searchBox).length > 0) {
          this.verifyElementVisible(this.locators.searchBox, 'Search Box (Textarea)');
        } else if ($body.find(this.locators.searchBoxAlternate).length > 0) {
          this.verifyElementVisible(this.locators.searchBoxAlternate, 'Search Box (Input)');
        } else {
          throw new Error('Search box not found on results page');
        }
      });
    });
    
    Logger.success('Search box is visible on results page');
    return this;
  }

  /**
   * Verify search box contains the expected text
   * @param {string} expectedText - Expected text in search box
   * @returns {GoogleSearchResultsPage} Current page instance
   */
  verifySearchBoxContainsText(expectedText) {
    Logger.info(`Verifying search box contains: '${expectedText}'`);
    
    cy.allure().step(`Verify search box contains '${expectedText}'`, () => {
      cy.get('body').then(($body) => {
        if ($body.find(this.locators.searchBox).length > 0) {
          cy.get(this.locators.searchBox).should('have.value', expectedText);
        } else if ($body.find(this.locators.searchBoxAlternate).length > 0) {
          cy.get(this.locators.searchBoxAlternate).should('have.value', expectedText);
        }
      });
    });
    
    Logger.success(`Search box contains expected text: '${expectedText}'`);
    return this;
  }

  /**
   * Verify search statistics are visible
   * @returns {GoogleSearchResultsPage} Current page instance
   */
  verifySearchStatsVisible() {
    Logger.info('Verifying search statistics are visible');
    
    cy.allure().step('Verify search statistics', () => {
      this.verifyElementVisible(this.locators.searchStats, 'Search Statistics');
      
      // Get and log search stats
      this.getText(this.locators.searchStats, 'Search Statistics').then((stats) => {
        Logger.info(`Search statistics: ${stats}`);
      });
    });
    
    Logger.success('Search statistics are visible');
    return this;
  }

  /**
   * Get all search result titles
   * @returns {Cypress.Chainable} Cypress chainable with search results
   */
  getSearchResultTitles() {
    Logger.info('Getting all search result titles');
    
    return cy.allure().step('Get search result titles', () => {
      return cy.get('body').then(($body) => {
        let selector = this.locators.searchResults;
        
        if ($body.find(this.locators.searchResults).length === 0) {
          selector = this.locators.searchResultsAlternate;
        }
        
        return cy.get(selector).then(($results) => {
          const titles = [];
          $results.each((index, element) => {
            const title = Cypress.$(element).text().trim();
            if (title) {
              titles.push(title);
            }
          });
          
          Logger.success(`Found ${titles.length} search results`, { titles });
          return titles;
        });
      });
    });
  }

  /**
   * Click on a specific search result by index
   * @param {number} index - Index of the search result (0-based)
   * @returns {GoogleSearchResultsPage} Current page instance
   */
  clickSearchResult(index) {
    Logger.info(`Clicking search result at index ${index}`);
    
    cy.allure().step(`Click search result #${index + 1}`, () => {
      cy.get('body').then(($body) => {
        let selector = this.locators.searchResultLinks;
        
        if ($body.find(this.locators.searchResults).length === 0) {
          selector = `${this.locators.searchResultsAlternate} a`;
        }
        
        cy.get(selector).eq(index).then(($link) => {
          const href = $link.attr('href');
          const title = $link.text().trim();
          
          Logger.info(`Clicking on result: "${title}" (${href})`);
          
          cy.wrap($link).click();
          
          // Take screenshot after clicking
          ScreenshotHelper.captureStepScreenshot(`clicked_search_result_${index}`);
        });
      });
    });
    
    Logger.success(`Successfully clicked search result at index ${index}`);
    return this;
  }

  /**
   * Verify search results contain specific text
   * @param {string} expectedText - Text that should appear in results
   * @returns {GoogleSearchResultsPage} Current page instance
   */
  verifySearchResultsContain(expectedText) {
    Logger.info(`Verifying search results contain: '${expectedText}'`);
    
    cy.allure().step(`Verify results contain '${expectedText}'`, () => {
      this.getSearchResultTitles().then((titles) => {
        const containsText = titles.some(title => 
          title.toLowerCase().includes(expectedText.toLowerCase())
        );
        
        expect(containsText).to.be.true;
        Logger.success(`Search results contain expected text: '${expectedText}'`);
      });
    });
    
    return this;
  }

  /**
   * Navigate to next page of results
   * @returns {GoogleSearchResultsPage} Current page instance
   */
  goToNextPage() {
    Logger.info('Navigating to next page of results');
    
    cy.allure().step('Navigate to next page', () => {
      this.scrollToElement(this.locators.nextPageButton, 'Next Page Button');
      this.click(this.locators.nextPageButton, 'Next Page Button');
      
      // Wait for new page to load
      cy.wait(2000);
      
      // Take screenshot of new page
      ScreenshotHelper.captureStepScreenshot('next_page_results');
    });
    
    Logger.success('Successfully navigated to next page');
    return this;
  }

  /**
   * Navigate to previous page of results
   * @returns {GoogleSearchResultsPage} Current page instance
   */
  goToPreviousPage() {
    Logger.info('Navigating to previous page of results');
    
    cy.allure().step('Navigate to previous page', () => {
      this.scrollToElement(this.locators.previousPageButton, 'Previous Page Button');
      this.click(this.locators.previousPageButton, 'Previous Page Button');
      
      // Wait for new page to load
      cy.wait(2000);
      
      // Take screenshot of new page
      ScreenshotHelper.captureStepScreenshot('previous_page_results');
    });
    
    Logger.success('Successfully navigated to previous page');
    return this;
  }

  /**
   * Filter search results by type (Images, Videos, News, etc.)
   * @param {string} filterType - Type of filter ('images', 'videos', 'news', 'maps', 'shopping')
   * @returns {GoogleSearchResultsPage} Current page instance
   */
  applySearchFilter(filterType) {
    Logger.info(`Applying search filter: ${filterType}`);
    
    cy.allure().step(`Apply ${filterType} filter`, () => {
      const filterMapping = {
        'images': this.locators.imagesFilter,
        'videos': this.locators.videosFilter,
        'news': this.locators.newsFilter,
        'maps': this.locators.mapsFilter,
        'shopping': this.locators.shoppingFilter
      };
      
      const filterSelector = filterMapping[filterType.toLowerCase()];
      
      if (filterSelector) {
        this.click(filterSelector, `${filterType} Filter`);
        
        // Wait for filtered results to load
        cy.wait(2000);
        
        // Take screenshot of filtered results
        ScreenshotHelper.captureStepScreenshot(`${filterType}_filtered_results`);
      } else {
        throw new Error(`Unknown filter type: ${filterType}`);
      }
    });
    
    Logger.success(`Successfully applied ${filterType} filter`);
    return this;
  }

  /**
   * Perform a new search from the results page
   * @param {string} newSearchTerm - New search term
   * @returns {GoogleSearchResultsPage} Current page instance
   */
  performNewSearch(newSearchTerm) {
    Logger.info(`Performing new search from results page: '${newSearchTerm}'`);
    
    cy.allure().step(`Perform new search: '${newSearchTerm}'`, () => {
      // Clear current search and enter new term
      cy.get('body').then(($body) => {
        if ($body.find(this.locators.searchBox).length > 0) {
          this.type(this.locators.searchBox, newSearchTerm, 'Search Box (Textarea)');
        } else if ($body.find(this.locators.searchBoxAlternate).length > 0) {
          this.type(this.locators.searchBoxAlternate, newSearchTerm, 'Search Box (Input)');
        }
        
        // Press Enter to search
        cy.get(this.locators.searchBox).type('{enter}');
      });
      
      // Wait for new results
      cy.wait(2000);
      
      // Take screenshot of new search results
      ScreenshotHelper.captureStepScreenshot('new_search_results');
    });
    
    Logger.success(`Successfully performed new search: '${newSearchTerm}'`);
    return this;
  }
}

module.exports = GoogleSearchResultsPage;