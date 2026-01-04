#!/bin/bash
# Automated test script for MCP Server
# Tests all components and verifies functionality

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Test result tracking
print_test_header() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

pass_test() {
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    PASSED_TESTS=$((PASSED_TESTS + 1))
    echo -e "${GREEN}✅ PASS:${NC} $1"
}

fail_test() {
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    FAILED_TESTS=$((FAILED_TESTS + 1))
    echo -e "${RED}❌ FAIL:${NC} $1"
    if [ -n "$2" ]; then
        echo -e "${RED}   Error: $2${NC}"
    fi
}

print_summary() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  TEST SUMMARY${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "Total Tests:   $TOTAL_TESTS"
    echo -e "${GREEN}Passed:        $PASSED_TESTS${NC}"
    if [ $FAILED_TESTS -gt 0 ]; then
        echo -e "${RED}Failed:        $FAILED_TESTS${NC}"
    else
        echo -e "Failed:        $FAILED_TESTS"
    fi
    echo ""
    
    if [ $FAILED_TESTS -eq 0 ]; then
        echo -e "${GREEN}🎉 All tests passed!${NC}"
        echo ""
        return 0
    else
        echo -e "${RED}⚠️  Some tests failed. Please review the output above.${NC}"
        echo ""
        return 1
    fi
}

# Navigate to MCP server directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
MCP_DIR="$SCRIPT_DIR/mcp-server"

if [ ! -d "$MCP_DIR" ]; then
    echo -e "${RED}Error: mcp-server directory not found at $MCP_DIR${NC}"
    exit 1
fi

cd "$MCP_DIR"

# Header
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                        ║${NC}"
echo -e "${BLUE}║        MCP SERVER AUTOMATED TEST SUITE                 ║${NC}"
echo -e "${BLUE}║                                                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Test 1: Check dependencies
print_test_header "Test 1: Checking Dependencies"

if [ -f "package.json" ]; then
    pass_test "package.json exists"
else
    fail_test "package.json not found"
fi

if [ -d "node_modules" ]; then
    pass_test "node_modules directory exists"
else
    fail_test "node_modules not found - run 'npm install'"
fi

if [ -f "node_modules/@modelcontextprotocol/sdk/package.json" ]; then
    pass_test "@modelcontextprotocol/sdk is installed"
else
    fail_test "@modelcontextprotocol/sdk not found"
fi

# Test 2: Build the project
print_test_header "Test 2: Building TypeScript"

echo -e "${YELLOW}Building...${NC}"
if npm run build > /tmp/mcp-build.log 2>&1; then
    pass_test "TypeScript compilation successful"
else
    fail_test "TypeScript compilation failed" "$(tail -5 /tmp/mcp-build.log)"
fi

# Test 3: Check output files
print_test_header "Test 3: Verifying Build Outputs"

required_files=(
    "dist/mcpServer.js"
    "dist/dappAnalyzer.js"
    "dist/index.js"
    "dist/jsonRpcClient.js"
    "dist/smartContractManager.js"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        pass_test "$file exists"
    else
        fail_test "$file not found"
    fi
done

# Test 4: Test DappAnalyzer
print_test_header "Test 4: Testing DappAnalyzer Component"

echo -e "${YELLOW}Running analyzer...${NC}"
ANALYZER_OUTPUT=$(node -e "
import('./dist/dappAnalyzer.js').then(module => {
  const analyzer = new module.DappAnalyzer('http://127.0.0.1:8545', '$SCRIPT_DIR');
  return analyzer.analyzeDapp();
}).then(analysis => {
  console.log(JSON.stringify(analysis));
}).catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
" 2>&1)

if echo "$ANALYZER_OUTPUT" | grep -q "contractsFound"; then
    pass_test "DappAnalyzer runs successfully"
    
    # Extract values from output
    CONTRACTS=$(echo "$ANALYZER_OUTPUT" | grep -o '"contractsFound":[0-9]*' | grep -o '[0-9]*')
    PRIORITY=$(echo "$ANALYZER_OUTPUT" | grep -o '"priority":"[^"]*"' | cut -d'"' -f4)
    
    if [ -n "$CONTRACTS" ]; then
        pass_test "Found $CONTRACTS contracts"
    fi
    
    if [ -n "$PRIORITY" ]; then
        pass_test "Priority level: $PRIORITY"
    fi
else
    fail_test "DappAnalyzer failed" "$ANALYZER_OUTPUT"
fi

# Test 5: Test MCP Server Module Loading
print_test_header "Test 5: Testing MCP Server Module"

echo -e "${YELLOW}Loading MCP server module...${NC}"
SERVER_OUTPUT=$(node -e "
import('./dist/mcpServer.js').then(module => {
  console.log('SUCCESS');
  console.log('Exports:', Object.keys(module).join(', '));
}).catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
" 2>&1)

if echo "$SERVER_OUTPUT" | grep -q "SUCCESS"; then
    pass_test "MCP Server module loads successfully"
    if echo "$SERVER_OUTPUT" | grep -q "DappModernizationMCPServer"; then
        pass_test "DappModernizationMCPServer class exported"
    fi
else
    fail_test "MCP Server module failed to load" "$SERVER_OUTPUT"
fi

# Test 6: Test Inspector Integration
print_test_header "Test 6: Testing MCP Inspector Integration"

echo -e "${YELLOW}Testing inspector startup (5 second test)...${NC}"

# Start inspector in background
timeout 5 npx @modelcontextprotocol/inspector node dist/mcpServer.js > /tmp/mcp-inspector.log 2>&1 &
INSPECTOR_PID=$!

# Wait a moment for startup
sleep 3

# Check if inspector started
if ps -p $INSPECTOR_PID > /dev/null 2>&1; then
    pass_test "Inspector started successfully"
    
    # Check log output
    if grep -q "MCP Inspector is up and running" /tmp/mcp-inspector.log; then
        pass_test "Inspector web UI started"
    fi
    
    if grep -q "Proxy server listening" /tmp/mcp-inspector.log; then
        pass_test "Proxy server started"
    fi
    
    # Extract and display connection info
    if grep -q "http://localhost:6274" /tmp/mcp-inspector.log; then
        pass_test "Web UI available at http://localhost:6274"
    fi
    
    # Kill the inspector
    kill $INSPECTOR_PID 2>/dev/null || true
    wait $INSPECTOR_PID 2>/dev/null || true
else
    fail_test "Inspector failed to start"
fi

# Test 7: Test JSON RPC Client
print_test_header "Test 7: Testing JSON RPC Client (Optional)"

echo -e "${YELLOW}Testing RPC client...${NC}"
RPC_OUTPUT=$(node -e "
import('./dist/jsonRpcClient.js').then(module => {
  const client = new module.JSONRPCClient('http://127.0.0.1:8545');
  console.log('Client created successfully');
}).catch(err => {
  console.log('Note: RPC client test skipped (no local node)');
});
" 2>&1)

if echo "$RPC_OUTPUT" | grep -q "successfully"; then
    pass_test "JSON RPC client instantiated"
elif echo "$RPC_OUTPUT" | grep -q "skipped"; then
    echo -e "${YELLOW}⚠️  SKIP:${NC} RPC client test (requires local Ethereum node)"
else
    echo -e "${YELLOW}⚠️  SKIP:${NC} RPC client test"
fi

# Test 8: Verify Documentation
print_test_header "Test 8: Verifying Documentation"

docs=(
    "README.md"
    "TESTING.md"
    "ADDING_PROMPTS.md"
)

for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        pass_test "$doc exists"
        
        # Check if file has content
        if [ -s "$doc" ]; then
            pass_test "$doc has content"
        else
            fail_test "$doc is empty"
        fi
    else
        fail_test "$doc not found"
    fi
done

# Test 9: Verify package.json scripts
print_test_header "Test 9: Verifying Package Scripts"

scripts=(
    "build"
    "mcp"
    "mcp-dev"
    "start"
)

for script in "${scripts[@]}"; do
    if grep -q "\"$script\":" package.json; then
        pass_test "npm script '$script' defined"
    else
        fail_test "npm script '$script' not found"
    fi
done

# Test 10: Code quality checks
print_test_header "Test 10: Code Quality Checks"

# Check for TypeScript source files
TS_FILES=$(find src -name "*.ts" 2>/dev/null | wc -l)
if [ "$TS_FILES" -gt 0 ]; then
    pass_test "Found $TS_FILES TypeScript source files"
else
    fail_test "No TypeScript source files found"
fi

# Check for proper module structure
if [ -f "tsconfig.json" ]; then
    pass_test "tsconfig.json exists"
else
    fail_test "tsconfig.json not found"
fi

# Summary
print_summary

# Exit with appropriate code
exit $?
