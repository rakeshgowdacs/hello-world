# 🚀 Space SMS Framework - Makefile for Test Automation
# This Makefile provides simple commands for running tests and generating reports

.PHONY: help clean test test-full test-login test-order test-all test-qa test-dev auto-test auto-login auto-order install deps

# Default target
help:
	@echo "🚀 Space SMS Framework - Test Automation Commands"
	@echo ""
	@echo "📋 Available Commands:"
	@echo "  make help          - Show this help message"
	@echo "  make install       - Install dependencies"
	@echo "  make clean         - Clean previous test runs"
	@echo ""
	@echo "🧪 Test Execution:"
	@echo "  make test          - Run all tests and generate report"
	@echo "  make test-full     - Run tests, generate report, and open it"
	@echo "  make test-login    - Run only login tests with full automation"
	@echo "  make test-order    - Run only order flow tests with full automation"
	@echo "  make test-all      - Run all tests with full automation"
	@echo "  make test-qa       - Run all tests in QA environment"
	@echo "  make test-dev      - Run all tests in DEV environment"
	@echo ""
	@echo "🤖 Full Automation:"
	@echo "  make auto-test     - Clean, run all tests, generate report, and open"
	@echo "  make auto-login    - Clean, run login tests, generate report, and open"
	@echo "  make auto-order    - Clean, run order tests, generate report, and open"
	@echo ""
	@echo "🔧 Utility Commands:"
	@echo "  make deps          - Check and install dependencies"
	@echo "  make clean         - Remove all reports and artifacts"
	@echo "  make cypress-open  - Open Cypress UI"
	@echo "  make report-gen    - Generate Allure report only"
	@echo "  make report-open   - Open Allure report only"

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	npm install
	@echo "✅ Dependencies installed successfully!"

# Check and install dependencies
deps: install

# Clean previous runs
clean:
	@echo "🧹 Cleaning previous test runs..."
	npm run clean
	@echo "✅ Cleanup completed!"

# Run tests and generate report
test:
	@echo "🧪 Running tests and generating report..."
	npm run test
	@echo "✅ Test execution and report generation completed!"

# Run tests, generate report, and open
test-full:
	@echo "🧪 Running tests, generating report, and opening..."
	npm run test:full
	@echo "✅ Full automation completed!"

# Run login tests with full automation
test-login:
	@echo "🔐 Running login tests with full automation..."
	npm run test:login
	@echo "✅ Login test automation completed!"

# Run order flow tests with full automation
test-order:
	@echo "🛒 Running order flow tests with full automation..."
	npm run test:order
	@echo "✅ Order flow test automation completed!"

# Run all tests with full automation
test-all:
	@echo "🚀 Running all tests with full automation..."
	npm run test:all
	@echo "✅ All test automation completed!"

# Run tests in QA environment
test-qa:
	@echo "🌍 Running tests in QA environment..."
	npm run test:qa
	@echo "✅ QA environment test automation completed!"

# Run tests in DEV environment
test-dev:
	@echo "💻 Running tests in DEV environment..."
	npm run test:dev
	@echo "✅ DEV environment test automation completed!"

# Full automation: clean, test, report, open
auto-test:
	@echo "🤖 Starting full automation pipeline..."
	@echo "1️⃣ Cleaning previous runs..."
	make clean
	@echo "2️⃣ Running all tests with full automation..."
	make test-full
	@echo "🎉 Full automation pipeline completed!"

# Full automation for login tests
auto-login:
	@echo "🤖 Starting login test automation pipeline..."
	@echo "1️⃣ Cleaning previous runs..."
	make clean
	@echo "2️⃣ Running login tests with full automation..."
	make test-login
	@echo "🎉 Login test automation pipeline completed!"

# Full automation for order tests
auto-order:
	@echo "🤖 Starting order test automation pipeline..."
	@echo "1️⃣ Cleaning previous runs..."
	make clean
	@echo "2️⃣ Running order tests with full automation..."
	make test-order
	@echo "🎉 Order test automation pipeline completed!"

# Open Cypress UI
cypress-open:
	@echo "🖥️ Opening Cypress UI..."
	npm run cypress:open

# Generate Allure report only
report-gen:
	@echo "📊 Generating Allure report..."
	npm run report:generate
	@echo "✅ Report generated successfully!"

# Open Allure report only
report-open:
	@echo "🌐 Opening Allure report..."
	npm run report:open

# Quick test run (no report generation)
quick-test:
	@echo "⚡ Running quick test execution..."
	npm run cypress:run
	@echo "✅ Quick test execution completed!"

# Quick test run for specific feature
quick-test-login:
	@echo "⚡ Running quick login test execution..."
	NODE_ENV=dev npx cypress run --spec "cypress/e2e/login/login.feature"
	@echo "✅ Quick login test execution completed!"

# Quick test run for order feature
quick-test-order:
	@echo "⚡ Running quick order test execution..."
	NODE_ENV=dev npx cypress run --spec "cypress/e2e/order/orderFlow.feature"
	@echo "✅ Quick order test execution completed!"

# Environment-specific quick tests
quick-test-qa:
	@echo "⚡ Running quick test execution in QA environment..."
	NODE_ENV=qa npx cypress run
	@echo "✅ Quick QA test execution completed!"

quick-test-dev:
	@echo "⚡ Running quick test execution in DEV environment..."
	NODE_ENV=dev npx cypress run
	@echo "✅ Quick DEV test execution completed!"

# Show current status
status:
	@echo "📊 Current Framework Status:"
	@echo "================================"
	@if [ -f "reports/.last-run" ]; then \
		echo "📁 Last run directory: $$(cat reports/.last-run)"; \
		echo "📊 Report available at: $$(cat reports/.last-run)/allure-report/index.html"; \
	else \
		echo "❌ No previous test runs found"; \
	fi
	@echo ""
	@echo "🔧 Dependencies:"
	@if [ -d "node_modules/cypress" ]; then \
		echo "✅ Cypress: Installed"; \
	else \
		echo "❌ Cypress: Not installed"; \
	fi
	@if [ -d "node_modules/@shelex/cypress-allure-plugin" ]; then \
		echo "✅ Allure Plugin: Installed"; \
	else \
		echo "❌ Allure Plugin: Not installed"; \
	fi
	@echo ""
	@echo "📁 Environment files:"
	@if [ -f ".env.dev" ]; then \
		echo "✅ .env.dev: Available"; \
	else \
		echo "❌ .env.dev: Missing"; \
	fi
	@if [ -f ".env.qa" ]; then \
		echo "✅ .env.qa: Available"; \
	else \
		echo "❌ .env.qa: Missing"; \
	fi

# Show help for specific command
help-test:
	@echo "🧪 Test Execution Help:"
	@echo "========================"
	@echo "make test          - Basic test execution with report generation"
	@echo "make test-full     - Full automation (test + report + open)"
	@echo "make test-login    - Login tests only with full automation"
	@echo "make test-order    - Order flow tests only with full automation"
	@echo "make test-all      - All tests with full automation"
	@echo "make test-qa       - All tests in QA environment"
	@echo "make test-dev      - All tests in DEV environment"

help-auto:
	@echo "🤖 Automation Help:"
	@echo "==================="
	@echo "make auto-test     - Clean + test + report + open (all tests)"
	@echo "make auto-login    - Clean + test + report + open (login only)"
	@echo "make auto-order    - Clean + test + report + open (order only)"
	@echo ""
	@echo "These commands perform the complete pipeline:"
	@echo "1. Clean previous runs"
	@echo "2. Execute tests"
	@echo "3. Generate Allure report"
	@echo "4. Open report in browser"

help-quick:
	@echo "⚡ Quick Test Help:"
	@echo "==================="
	@echo "make quick-test        - Run tests without report generation"
	@echo "make quick-test-login  - Run login tests quickly"
	@echo "make quick-test-order  - Run order tests quickly"
	@echo "make quick-test-qa     - Run tests in QA environment quickly"
	@echo "make quick-test-dev    - Run tests in DEV environment quickly"
	@echo ""
	@echo "Use these for development and debugging (faster execution)"