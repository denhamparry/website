#!/bin/bash

# Colours for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Colour

echo -e "${BLUE}🧪 Running Website Test Suite${NC}\n"

# Check if npm dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing npm dependencies...${NC}"
    npm install
fi

# Function to check if hugo server is running
check_hugo_server() {
    curl -s -o /dev/null -w "%{http_code}" http://localhost:1313
}

# Run Hugo build tests
echo -e "\n${BLUE}1. Running Hugo Build Tests...${NC}"
npm run test:hugo
HUGO_TEST_RESULT=$?

# Start Hugo server for functional and accessibility tests
if [ "$(check_hugo_server)" != "200" ]; then
    echo -e "\n${YELLOW}Starting Hugo server for functional tests...${NC}"
    hugo server &
    HUGO_PID=$!
    sleep 3 # Wait for server to start
else
    echo -e "\n${GREEN}Hugo server already running${NC}"
    HUGO_PID=""
fi

# Run functional tests
echo -e "\n${BLUE}2. Running Functional Tests...${NC}"
npm run test:functional
FUNCTIONAL_TEST_RESULT=$?

# Run accessibility tests
echo -e "\n${BLUE}3. Running Accessibility Tests...${NC}"
npm run test:accessibility
ACCESSIBILITY_TEST_RESULT=$?

# Run link checker
echo -e "\n${BLUE}4. Running Link Checker...${NC}"
npm run test:links
LINK_TEST_RESULT=$?

# Kill Hugo server if we started it
if [ ! -z "$HUGO_PID" ]; then
    echo -e "\n${YELLOW}Stopping Hugo server...${NC}"
    kill $HUGO_PID 2>/dev/null
fi

# Summary
echo -e "\n${BLUE}===============================================${NC}"
echo -e "${BLUE}Test Summary:${NC}"
echo -e "${BLUE}===============================================${NC}"

TOTAL_FAILURES=0

if [ $HUGO_TEST_RESULT -eq 0 ]; then
    echo -e "${GREEN}✅ Hugo Build Tests: PASSED${NC}"
else
    echo -e "${RED}❌ Hugo Build Tests: FAILED${NC}"
    ((TOTAL_FAILURES++))
fi

if [ $FUNCTIONAL_TEST_RESULT -eq 0 ]; then
    echo -e "${GREEN}✅ Functional Tests: PASSED${NC}"
else
    echo -e "${RED}❌ Functional Tests: FAILED${NC}"
    ((TOTAL_FAILURES++))
fi

if [ $ACCESSIBILITY_TEST_RESULT -eq 0 ]; then
    echo -e "${GREEN}✅ Accessibility Tests: PASSED${NC}"
else
    echo -e "${RED}❌ Accessibility Tests: FAILED${NC}"
    ((TOTAL_FAILURES++))
fi

if [ $LINK_TEST_RESULT -eq 0 ]; then
    echo -e "${GREEN}✅ Link Tests: PASSED${NC}"
else
    echo -e "${RED}❌ Link Tests: FAILED${NC}"
    ((TOTAL_FAILURES++))
fi

echo -e "${BLUE}===============================================${NC}"

if [ $TOTAL_FAILURES -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "\n${RED}❌ $TOTAL_FAILURES test suite(s) failed!${NC}"
    exit 1
fi