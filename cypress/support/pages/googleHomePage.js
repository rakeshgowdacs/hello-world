/**
 * Google Home Page Object for Space Automation Framework
 * Contains methods and locators specific to Google's home page
 */

const BasePage = require('./basePage');
const Logger = require('../utils/logger');
const ScreenshotHelper = require('../utils/screenshotHelper');
const DataHelper = require('../utils/dataHelper');

class GoogleHomePage extends BasePage {
  constructor() {
    super();
    this.url = DataHelper.getEnvData('BASE_URL', 'https://www.google.com');
    
    // Page locators
    this.locators = {
      searchBox: 'textarea[name="q"]',
      searchBoxAlternate: 'input[name="q"]',
      searchButton: 'input[value="Google Search"]',
      searchButtonAlternate: 'button[aria-label="Google Search"]',
      feelingLuckyButton: 'input[value="I\'m Feeling Lucky"]',
      googleLogo: 'img[alt="Google"]',
      languageLinks: '#SIvCob a',
      privacyLink: 'a[href*="policies/privacy"]',
      termsLink: 'a[href*="policies/terms"]',
      acceptAllButton: 'button:contains("Accept all")',
      rejectAllButton: 'button:contains("Reject all")',
      voiceSearchButton: '[aria-label="Search by voice"]',
      cameraSearchButton: '[aria-label="Search by image"]'
    };
  }

  /**
   * Navigate to Google home page
   * @returns {GoogleHomePage} Current page instance
   */
  navigateToHomePage() {
    Logger.info('Navigating to Google Home Page');
    
    cy.allure().step('Navigate to Google Home Page', () => {
      this.visit(this.url, 'Google Home Page');
      
      // Handle cookies consent if present
      this.handleCookiesConsent();
      
      // Verify page loaded successfully
      this.verifyHomePageLoaded();
    });
    
    Logger.success('Successfully navigated to Google Home Page');
    return this;
  }

  /**
   * Handle cookies consent popup if present
   * @returns {GoogleHomePage} Current page instance
   */
  handleCookiesConsent() {
    Logger.info('Checking for cookies consent popup');
    
    cy.allure().step('Handle cookies consent', () => {
      // Check if accept all button is present and click it
      cy.get('body').then(($body) => {
        if ($body.find(this.locators.acceptAllButton).length > 0) {
          Logger.info('Cookies consent popup found, accepting all cookies');
          this.click(this.locators.acceptAllButton, 'Accept All Cookies Button');
        } else {
          Logger.info('No cookies consent popup found');
        }
      });
    });
    
    return this;
  }

  /**
   * Verify that the home page has loaded successfully
   * @returns {GoogleHomePage} Current page instance
   */
  verifyHomePageLoaded() {
    Logger.info('Verifying Google Home Page loaded successfully');
    
    cy.allure().step('Verify Google Home Page loaded', () => {
      // Verify Google logo is visible
      this.verifyElementVisible(this.locators.googleLogo, 'Google Logo');
      
      // Verify search box is visible
      this.verifySearchBoxVisible();
      
      // Verify page title
      this.getPageTitle().should('contain', 'Google');
      
      // Take full page screenshot
      this.takeFullPageScreenshot('google_home_page_loaded');
    });
    
    Logger.success('Google Home Page loaded successfully');
    return this;
  }

  /**
   * Verify search box is visible (handle multiple possible selectors)
   * @returns {GoogleHomePage} Current page instance
   */
  verifySearchBoxVisible() {
    Logger.info('Verifying search box is visible');
    
    cy.allure().step('Verify search box is visible', () => {
      // Try primary search box selector first
      cy.get('body').then(($body) => {
        if ($body.find(this.locators.searchBox).length > 0) {
          this.verifyElementVisible(this.locators.searchBox, 'Search Box (Textarea)');
        } else if ($body.find(this.locators.searchBoxAlternate).length > 0) {
          this.verifyElementVisible(this.locators.searchBoxAlternate, 'Search Box (Input)');
        } else {
          throw new Error('Search box not found with any known selector');
        }
      });
    });
    
    Logger.success('Search box is visible');
    return this;
  }

  /**
   * Enter search term in the search box
   * @param {string} searchTerm - The term to search for
   * @returns {GoogleHomePage} Current page instance
   */
  enterSearchTerm(searchTerm) {
    Logger.info(`Entering search term: '${searchTerm}'`);
    
    cy.allure().step(`Enter search term: '${searchTerm}'`, () => {
      // Try primary search box selector first
      cy.get('body').then(($body) => {
        if ($body.find(this.locators.searchBox).length > 0) {
          this.type(this.locators.searchBox, searchTerm, 'Search Box (Textarea)');
        } else if ($body.find(this.locators.searchBoxAlternate).length > 0) {
          this.type(this.locators.searchBoxAlternate, searchTerm, 'Search Box (Input)');
        } else {
          throw new Error('Search box not found with any known selector');
        }
      });
      
      // Take screenshot after entering search term
      ScreenshotHelper.captureStepScreenshot('search_term_entered');
    });
    
    Logger.success(`Successfully entered search term: '${searchTerm}'`);
    return this;
  }

  /**
   * Click the Google Search button
   * @returns {GoogleHomePage} Current page instance
   */
  clickSearchButton() {
    Logger.info('Clicking Google Search button');
    
    cy.allure().step('Click Google Search button', () => {
      // Try primary search button selector first
      cy.get('body').then(($body) => {
        if ($body.find(this.locators.searchButton).length > 0) {
          this.click(this.locators.searchButton, 'Google Search Button');
        } else if ($body.find(this.locators.searchButtonAlternate).length > 0) {
          this.click(this.locators.searchButtonAlternate, 'Google Search Button (Alternative)');
        } else {
          // Fallback: press Enter key
          Logger.info('Search button not found, pressing Enter key instead');
          cy.get(this.locators.searchBox).type('{enter}');
        }
      });
    });
    
    Logger.success('Successfully clicked Google Search button');
    return this;
  }

  /**
   * Perform a complete search operation
   * @param {string} searchTerm - The term to search for
   * @returns {GoogleHomePage} Current page instance
   */
  performSearch(searchTerm) {
    Logger.info(`Performing complete search for: '${searchTerm}'`);
    
    cy.allure().step(`Perform search for '${searchTerm}'`, () => {
      this.enterSearchTerm(searchTerm);
      this.clickSearchButton();
      
      // Wait for search results page to load
      cy.url().should('include', '/search');
      
      // Take screenshot of search results
      ScreenshotHelper.captureStepScreenshot('search_results_page');
    });
    
    Logger.success(`Successfully performed search for: '${searchTerm}'`);
    return this;
  }

  /**
   * Click "I'm Feeling Lucky" button
   * @returns {GoogleHomePage} Current page instance
   */
  clickFeelingLuckyButton() {
    Logger.info('Clicking "I\'m Feeling Lucky" button');
    
    cy.allure().step('Click "I\'m Feeling Lucky" button', () => {
      this.click(this.locators.feelingLuckyButton, 'I\'m Feeling Lucky Button');
    });
    
    Logger.success('Successfully clicked "I\'m Feeling Lucky" button');
    return this;
  }

  /**
   * Verify Google logo and get its attributes
   * @returns {Cypress.Chainable} Cypress chainable with logo attributes
   */
  verifyGoogleLogo() {
    Logger.info('Verifying Google logo');
    
    return cy.allure().step('Verify Google logo', () => {
      this.verifyElementVisible(this.locators.googleLogo, 'Google Logo');
      
      return cy.get(this.locators.googleLogo).then(($logo) => {
        const logoData = {
          alt: $logo.attr('alt'),
          src: $logo.attr('src'),
          title: $logo.attr('title')
        };
        
        Logger.success('Google logo verified', logoData);
        return logoData;
      });
    });
  }

  /**
   * Get all available language links
   * @returns {Cypress.Chainable} Cypress chainable with language data
   */
  getLanguageLinks() {
    Logger.info('Getting available language links');
    
    return cy.allure().step('Get language links', () => {
      return cy.get(this.locators.languageLinks).then(($links) => {
        const languages = [];
        $links.each((index, link) => {
          languages.push({
            text: Cypress.$(link).text(),
            href: Cypress.$(link).attr('href')
          });
        });
        
        Logger.success(`Found ${languages.length} language links`, { languages });
        return languages;
      });
    });
  }

  /**
   * Verify privacy and terms links are present
   * @returns {GoogleHomePage} Current page instance
   */
  verifyFooterLinks() {
    Logger.info('Verifying footer links (Privacy and Terms)');
    
    cy.allure().step('Verify footer links', () => {
      this.verifyElementVisible(this.locators.privacyLink, 'Privacy Link');
      this.verifyElementVisible(this.locators.termsLink, 'Terms Link');
      
      // Take screenshot of footer
      ScreenshotHelper.captureElementScreenshot('footer', 'page_footer');
    });
    
    Logger.success('Footer links verified');
    return this;
  }
}

module.exports = GoogleHomePage;