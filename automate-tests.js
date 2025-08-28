#!/usr/bin/env node

/**
 * 🚀 Space SMS Framework - Automated Test Runner (Node.js Version)
 * This script automates the entire process: run tests → generate report → open report
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

// Utility functions for colored output
const log = {
    info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
    success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
    warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
    header: (msg) => console.log(`\n${colors.cyan}${colors.bright}${msg}${colors.reset}`)
};

// Configuration
const config = {
    defaultEnv: 'dev',
    validEnvs: ['dev', 'qa'],
    testSpecs: {
        all: 'all',
        login: 'cypress/e2e/login/login.feature',
        order: 'cypress/e2e/order/orderFlow.feature'
    }
};

// Helper function to execute command
function executeCommand(command, options = {}) {
    const { silent = false, cwd = process.cwd() } = options;
    
    try {
        if (!silent) {
            log.info(`Executing: ${command}`);
        }
        
        const result = execSync(command, {
            cwd,
            encoding: 'utf8',
            stdio: silent ? 'pipe' : 'inherit'
        });
        
        return { success: true, output: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Helper function to check if file exists
function fileExists(filePath) {
    return fs.existsSync(filePath);
}

// Helper function to check prerequisites
function checkPrerequisites() {
    log.header('🔍 Checking Prerequisites');
    
    // Check Node.js
    try {
        const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
        log.success(`Node.js version: ${nodeVersion}`);
    } catch (error) {
        log.error('Node.js is not installed or not accessible');
        process.exit(1);
    }
    
    // Check npm
    try {
        const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
        log.success(`npm version: ${npmVersion}`);
    } catch (error) {
        log.error('npm is not installed or not accessible');
        process.exit(1);
    }
    
    // Check if package.json exists
    if (!fileExists('package.json')) {
        log.error('package.json not found. Please run this script from the project root directory.');
        process.exit(1);
    }
    
    // Check if cypress is installed
    if (!fileExists('node_modules/cypress')) {
        log.warning('Cypress not found. Installing dependencies...');
        const result = executeCommand('npm install', { silent: true });
        if (!result.success) {
            log.error('Failed to install dependencies');
            process.exit(1);
        }
    }
    
    log.success('Prerequisites check completed!');
}

// Function to clean previous runs
function cleanPreviousRuns() {
    log.header('🧹 Cleaning Previous Test Runs');
    
    const result = executeCommand('npm run clean');
    if (result.success) {
        log.success('Cleanup completed!');
    } else {
        log.warning('Cleanup failed, but continuing...');
    }
}

// Function to run tests
function runTests(testSpec, environment) {
    log.header('🧪 Running Tests');
    log.info(`Environment: ${environment}`);
    log.info(`Test specification: ${testSpec}`);
    
    let command;
    if (testSpec === 'all') {
        command = `NODE_ENV=${environment} npx cypress run`;
    } else {
        command = `NODE_ENV=${environment} npx cypress run --spec "${testSpec}"`;
    }
    
    const result = executeCommand(command);
    if (!result.success) {
        log.error('Tests failed! Check the output above for details.');
        process.exit(1);
    }
    
    log.success('Tests completed successfully!');
}

// Function to generate report
function generateReport() {
    log.header('📊 Generating Allure Report');
    
    const result = executeCommand('npm run report:generate');
    if (!result.success) {
        log.error('Report generation failed!');
        process.exit(1);
    }
    
    log.success('Report generated successfully!');
}

// Function to open report
function openReport() {
    log.header('🌐 Opening Allure Report');
    
    // Check if .last-run file exists
    const lastRunFile = 'reports/.last-run';
    if (!fileExists(lastRunFile)) {
        log.error('Last run file not found. Cannot determine report location.');
        process.exit(1);
    }
    
    // Read the last run directory
    const lastRunDir = fs.readFileSync(lastRunFile, 'utf8').trim();
    const reportPath = path.join(lastRunDir, 'allure-report');
    
    if (!fileExists(reportPath)) {
        log.error(`Report directory not found: ${reportPath}`);
        process.exit(1);
    }
    
    log.success(`Report found at: ${reportPath}`);
    
    // Try to open the report
    const reportUrl = `file://${path.resolve(reportPath)}/index.html`;
    
    try {
        const platform = os.platform();
        let openCommand;
        
        switch (platform) {
            case 'darwin': // macOS
                openCommand = 'open';
                break;
            case 'win32': // Windows
                openCommand = 'start';
                break;
            default: // Linux
                openCommand = 'xdg-open';
                break;
        }
        
        // Try to open the report
        execSync(`${openCommand} "${reportUrl}"`, { stdio: 'pipe' });
        log.success('Report opened in browser!');
        
    } catch (error) {
        log.warning(`Could not automatically open report. Please open manually: ${reportUrl}`);
        log.info(`Or navigate to: ${reportPath}/index.html`);
    }
    
    // Display report location
    log.info(`Report location: ${reportPath}`);
    log.info(`Report URL: ${reportUrl}`);
}

// Function to show usage
function showUsage() {
    console.log(`
🚀 Space SMS Framework - Automated Test Runner (Node.js)

Usage: node automate-tests.js [OPTIONS] [TEST_SPEC]

OPTIONS:
  -e, --env ENV        Environment to use (dev|qa) [default: dev]
  -c, --clean          Clean previous test runs before execution
  -h, --help           Show this help message

TEST_SPEC:
  all                  Run all tests (default)
  login                Run only login tests
  order                Run only order flow tests
  path/to/feature      Run specific feature file

EXAMPLES:
  node automate-tests.js                    # Run all tests in dev environment
  node automate-tests.js -e qa             # Run all tests in qa environment
  node automate-tests.js login             # Run only login tests in dev environment
  node automate-tests.js -e qa order       # Run order tests in qa environment
  node automate-tests.js -c                # Clean and run all tests
  node automate-tests.js "cypress/e2e/login/login.feature"  # Run specific feature
`);
}

// Function to parse command line arguments
function parseArguments() {
    const args = process.argv.slice(2);
    const options = {
        environment: config.defaultEnv,
        cleanFirst: false,
        testSpec: 'all'
    };
    
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        
        switch (arg) {
            case '-e':
            case '--env':
                if (i + 1 < args.length) {
                    options.environment = args[++i];
                }
                break;
            case '-c':
            case '--clean':
                options.cleanFirst = true;
                break;
            case '-h':
            case '--help':
                showUsage();
                process.exit(0);
                break;
            default:
                if (!arg.startsWith('-')) {
                    options.testSpec = arg;
                }
                break;
        }
    }
    
    return options;
}

// Function to validate options
function validateOptions(options) {
    // Validate environment
    if (!config.validEnvs.includes(options.environment)) {
        log.error(`Invalid environment: ${options.environment}. Use 'dev' or 'qa'.`);
        process.exit(1);
    }
    
    // Validate test specification
    if (options.testSpec !== 'all' && !config.testSpecs[options.testSpec]) {
        // Check if it's a valid file path
        if (!fileExists(options.testSpec)) {
            log.error(`Invalid test specification: ${options.testSpec}`);
            log.error("Use 'all', 'login', 'order', or a valid feature file path.");
            process.exit(1);
        }
    }
    
    // Convert test spec to actual file path if needed
    if (config.testSpecs[options.testSpec]) {
        options.testSpec = config.testSpecs[options.testSpec];
    }
    
    return options;
}

// Main execution function
async function main() {
    try {
        log.header('🚀 Space SMS Framework - Automated Test Runner');
        
        // Parse and validate arguments
        const options = parseArguments();
        const validatedOptions = validateOptions(options);
        
        log.info(`Environment: ${validatedOptions.environment}`);
        log.info(`Test specification: ${validatedOptions.testSpec}`);
        log.info(`Clean previous runs: ${validatedOptions.cleanFirst}`);
        console.log('');
        
        // Execute the automation pipeline
        checkPrerequisites();
        
        if (validatedOptions.cleanFirst) {
            cleanPreviousRuns();
        }
        
        runTests(validatedOptions.testSpec, validatedOptions.environment);
        generateReport();
        openReport();
        
        console.log('');
        log.success('🎉 Automated test execution completed successfully!');
        log.info('Report opened in your default browser.');
        
        // Show manual report location
        if (fileExists('reports/.last-run')) {
            const lastRunDir = fs.readFileSync('reports/.last-run', 'utf8').trim();
            log.info(`Manual report location: ${lastRunDir}/allure-report/index.html`);
        }
        
    } catch (error) {
        log.error(`Unexpected error: ${error.message}`);
        process.exit(1);
    }
}

// Run the main function
if (require.main === module) {
    main();
}

module.exports = {
    executeCommand,
    checkPrerequisites,
    cleanPreviousRuns,
    runTests,
    generateReport,
    openReport
};