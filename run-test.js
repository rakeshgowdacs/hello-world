#!/usr/bin/env node

/**
 * Test Runner Script for Space Automation Framework
 * Demonstrates how to run tests with proper setup
 */

const { exec } = require('child_process');
const path = require('path');
const moment = require('moment');

// Configuration
const config = {
  browser: process.env.BROWSER || 'chrome',
  headless: process.env.HEADLESS !== 'false',
  env: process.env.ENV || 'qa',
  tags: process.env.TAGS || '@smoke'
};

console.log('🚀 Space Automation Framework Test Runner');
console.log('==========================================');
console.log(`Environment: ${config.env}`);
console.log(`Browser: ${config.browser}`);
console.log(`Headless: ${config.headless}`);
console.log(`Tags: ${config.tags}`);
console.log(`Timestamp: ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
console.log('==========================================\n');

// Build Cypress command
let command = 'npx cypress run';

// Add browser
command += ` --browser ${config.browser}`;

// Add headless flag
if (!config.headless) {
  command += ' --headed';
}

// Add environment variables
command += ` --env allure=true,TAGS='${config.tags}',ENV='${config.env}'`;

console.log(`🏃 Running command: ${command}\n`);

// Execute the test
const testProcess = exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Test execution failed: ${error.message}`);
    process.exit(1);
  }
  
  if (stderr) {
    console.error(`⚠️  stderr: ${stderr}`);
  }
  
  console.log(stdout);
  console.log('\n✅ Test execution completed!');
  
  // Generate Allure report
  console.log('\n📊 Generating Allure report...');
  
  const allureCommand = 'npx allure generate allure-results --clean -o allure-report';
  exec(allureCommand, (allureError, allureStdout, allureStderr) => {
    if (allureError) {
      console.error(`❌ Allure report generation failed: ${allureError.message}`);
      return;
    }
    
    console.log('✅ Allure report generated successfully!');
    console.log('📁 Report location: ./allure-report/index.html');
    console.log('\n🎉 Test execution and reporting completed!');
    
    // Optionally open the report
    if (process.env.OPEN_REPORT === 'true') {
      console.log('🌐 Opening Allure report...');
      exec('npx allure open allure-report');
    }
  });
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n⏹️  Test execution interrupted by user');
  testProcess.kill('SIGINT');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error(`💥 Uncaught exception: ${error.message}`);
  process.exit(1);
});