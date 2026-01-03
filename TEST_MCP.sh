#!/bin/bash

# Test MCP Dapp Modernization Server with Inspector
# This script demonstrates testing the MCP server using the MCP Inspector

set -e

echo "═══════════════════════════════════════════════════════════"
echo "       🧪 TESTING MCP DAPP MODERNIZATION SERVER           "
echo "═══════════════════════════════════════════════════════════"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if the MCP server is built
if [ ! -f "/workspaces/dapptools/mcp-server/dist/mcpServer.js" ]; then
    echo -e "${BLUE}🔨 Building MCP server...${NC}"
    cd /workspaces/dapptools/mcp-server
    npm run build
    echo ""
fi

echo -e "${GREEN}✅ MCP Server ready for testing${NC}"
echo ""
echo -e "${YELLOW}📋 Available testing methods:${NC}"
echo ""
echo "1. 🔍 Direct Inspector Testing:"
echo "   npx @modelcontextprotocol/inspector node /workspaces/dapptools/mcp-server/dist/mcpServer.js"
echo ""
echo "2. 🚀 Interactive Inspector (Recommended):"
echo "   This will launch the MCP Inspector web interface"
echo ""
echo "3. 📊 CLI Testing:"
echo "   Test individual components using our CLI tools"
echo ""

read -p "Choose testing method (1-3): " choice

case $choice in
    1)
        echo -e "${BLUE}🔍 Launching MCP Inspector directly...${NC}"
        echo ""
        echo "The Inspector will connect to our dapp modernization server"
        echo "You can test:"
        echo "  - Resources: analysis, reports, scripts"
        echo "  - Tools: analyze_dapp, security_audit, generate_upgrade_script"
        echo "  - Prompts: modernization_plan, security_checklist"
        echo ""
        echo "Press Ctrl+C to stop"
        echo ""
        npx @modelcontextprotocol/inspector node /workspaces/dapptools/mcp-server/dist/mcpServer.js
        ;;
        
    2)
        echo -e "${BLUE}🚀 Starting interactive testing...${NC}"
        echo ""
        echo "This will start the MCP server and show you how to connect the Inspector"
        echo ""
        echo "1. Start the MCP server in background:"
        echo "   cd /workspaces/dapptools/mcp-server"
        echo "   node dist/mcpServer.js &"
        echo ""
        echo "2. In another terminal, run the Inspector:"
        echo "   npx @modelcontextprotocol/inspector"
        echo ""
        echo "3. Configure the Inspector to connect via stdio to:"
        echo "   Command: node"
        echo "   Args: /workspaces/dapptools/mcp-server/dist/mcpServer.js"
        echo ""
        
        read -p "Press Enter to start the server..."
        cd /workspaces/dapptools/mcp-server
        echo -e "${GREEN}🌟 MCP Server starting...${NC}"
        echo "Connect your Inspector to: node /workspaces/dapptools/mcp-server/dist/mcpServer.js"
        echo ""
        node dist/mcpServer.js
        ;;
        
    3)
        echo -e "${BLUE}📊 CLI Testing Mode${NC}"
        echo ""
        echo "Testing our dapp analysis components:"
        echo ""
        
        # Test the analyzer directly
        echo -e "${BLUE}1. Testing Dapp Analyzer...${NC}"
        cd /workspaces/dapptools/mcp-server
        node -e "
        import('./dist/dappAnalyzer.js').then(module => {
          const analyzer = new module.DappAnalyzer('http://127.0.0.1:8545', '/workspaces/dapptools');
          return analyzer.analyzeDapp();
        }).then(analysis => {
          console.log('✅ Analysis completed:');
          console.log('  - Contracts found:', analysis.contractsFound);
          console.log('  - Solidity version:', analysis.solidityVersion);
          console.log('  - Priority:', analysis.modernization.priority);
          console.log('  - Recommendations:', analysis.modernization.recommendations.length);
        }).catch(console.error);
        "
        
        echo ""
        echo -e "${BLUE}2. Testing MCP Server Integration...${NC}"
        
        # Test server creation
        node -e "
        import('./dist/mcpServer.js').then(module => {
          console.log('✅ MCP Server module loaded successfully');
          console.log('Available exports:', Object.keys(module));
        }).catch(console.error);
        "
        
        echo ""
        echo -e "${GREEN}✅ CLI tests completed${NC}"
        echo ""
        echo "To test with the full MCP Inspector, use option 1 or 2"
        ;;
        
    *)
        echo "Invalid option. Please choose 1-3."
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Testing session complete!${NC}"
echo ""
echo "📚 Learn more about MCP Inspector features:"
echo "   - Resources: View analysis reports and upgrade scripts"
echo "   - Tools: Execute dapp analysis and security audits"  
echo "   - Prompts: Generate modernization plans and checklists"
echo ""
echo "🔗 For more advanced testing:"
echo "   - Check the logs for any errors"
echo "   - Test with different project paths"
echo "   - Try all available tools and resources"