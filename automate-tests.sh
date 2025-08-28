#!/bin/bash

# 🚀 Space SMS Framework - Automated Test Runner
# This script automates the entire process: run tests → generate report → open report

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    if ! command_exists allure; then
        print_warning "Allure command line tool not found. Installing..."
        npm install -g allure-commandline
    fi
    
    print_success "Prerequisites check completed!"
}

# Function to clean previous runs
clean_previous_runs() {
    print_status "Cleaning previous test runs..."
    npm run clean
    print_success "Cleanup completed!"
}

# Function to run tests
run_tests() {
    local test_spec="$1"
    local environment="${2:-dev}"
    
    print_status "Running tests with environment: $environment"
    print_status "Test specification: $test_spec"
    
    if [ "$test_spec" = "all" ]; then
        NODE_ENV="$environment" npx cypress run
    else
        NODE_ENV="$environment" npx cypress run --spec "$test_spec"
    fi
    
    if [ $? -eq 0 ]; then
        print_success "Tests completed successfully!"
    else
        print_error "Tests failed! Check the output above for details."
        exit 1
    fi
}

# Function to generate report
generate_report() {
    print_status "Generating Allure report..."
    npm run report:generate
    
    if [ $? -eq 0 ]; then
        print_success "Report generated successfully!"
    else
        print_error "Report generation failed!"
        exit 1
    fi
}

# Function to open report
open_report() {
    print_status "Opening Allure report..."
    
    # Get the report directory
    if [ -f "reports/.last-run" ]; then
        REPORT_DIR=$(cat reports/.last-run)
        REPORT_PATH="$REPORT_DIR/allure-report"
        
        if [ -d "$REPORT_PATH" ]; then
            print_success "Report found at: $REPORT_PATH"
            
            # Try to open report based on OS
            if [[ "$OSTYPE" == "darwin"* ]]; then
                # macOS
                open "$REPORT_PATH/index.html"
            elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
                # Linux
                if command_exists xdg-open; then
                    xdg-open "$REPORT_PATH/index.html"
                elif command_exists gnome-open; then
                    gnome-open "$REPORT_PATH/index.html"
                else
                    print_warning "Could not automatically open report. Please open manually: $REPORT_PATH/index.html"
                fi
            else
                print_warning "Could not automatically open report. Please open manually: $REPORT_PATH/index.html"
            fi
            
            print_success "Report opened in browser!"
        else
            print_error "Report directory not found: $REPORT_PATH"
            exit 1
        fi
    else
        print_error "Last run file not found. Cannot determine report location."
        exit 1
    fi
}

# Function to show usage
show_usage() {
    echo "🚀 Space SMS Framework - Automated Test Runner"
    echo ""
    echo "Usage: $0 [OPTIONS] [TEST_SPEC]"
    echo ""
    echo "OPTIONS:"
    echo "  -e, --env ENV        Environment to use (dev|qa) [default: dev]"
    echo "  -c, --clean          Clean previous test runs before execution"
    echo "  -h, --help           Show this help message"
    echo ""
    echo "TEST_SPEC:"
    echo "  all                  Run all tests (default)"
    echo "  login                Run only login tests"
    echo "  order                Run only order flow tests"
    echo "  path/to/feature      Run specific feature file"
    echo ""
    echo "EXAMPLES:"
    echo "  $0                    # Run all tests in dev environment"
    echo "  $0 -e qa             # Run all tests in qa environment"
    echo "  $0 login             # Run only login tests in dev environment"
    echo "  $0 -e qa order       # Run order tests in qa environment"
    echo "  $0 -c                # Clean and run all tests"
    echo "  $0 \"cypress/e2e/login/login.feature\"  # Run specific feature"
    echo ""
}

# Main execution function
main() {
    local test_spec="all"
    local environment="dev"
    local clean_first=false
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -e|--env)
                environment="$2"
                shift 2
                ;;
            -c|--clean)
                clean_first=true
                shift
                ;;
            -h|--help)
                show_usage
                exit 0
                ;;
            -*)
                print_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
            *)
                test_spec="$1"
                shift
                ;;
        esac
    done
    
    # Validate environment
    if [[ "$environment" != "dev" && "$environment" != "qa" ]]; then
        print_error "Invalid environment: $environment. Use 'dev' or 'qa'."
        exit 1
    fi
    
    # Validate test specification
    if [[ "$test_spec" != "all" && "$test_spec" != "login" && "$test_spec" != "order" ]]; then
        # Check if it's a valid file path
        if [[ ! -f "$test_spec" ]]; then
            print_error "Invalid test specification: $test_spec"
            print_error "Use 'all', 'login', 'order', or a valid feature file path."
            exit 1
        fi
    fi
    
    # Convert test spec to actual file path if needed
    case $test_spec in
        "login")
            test_spec="cypress/e2e/login/login.feature"
            ;;
        "order")
            test_spec="cypress/e2e/order/orderFlow.feature"
            ;;
    esac
    
    print_status "Starting automated test execution..."
    print_status "Environment: $environment"
    print_status "Test specification: $test_spec"
    print_status "Clean previous runs: $clean_first"
    echo ""
    
    # Execute the automation pipeline
    check_prerequisites
    
    if [ "$clean_first" = true ]; then
        clean_previous_runs
    fi
    
    run_tests "$test_spec" "$environment"
    generate_report
    open_report
    
    echo ""
    print_success "🎉 Automated test execution completed successfully!"
    print_status "Report opened in your default browser."
    print_status "You can also manually open: $(cat reports/.last-run)/allure-report/index.html"
}

# Run main function with all arguments
main "$@"