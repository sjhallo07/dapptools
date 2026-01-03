#!/bin/bash

# Dapp Modernization Entry Point
# This script launches the MCP Server modernization tool

set -e

echo "═══════════════════════════════════════════════════════════"
echo "       🚀 DAPP MODERNIZATION & UPGRADE TOOL               "
echo "           Powered by MCP Server Integration              "
echo "═══════════════════════════════════════════════════════════"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    echo "Please install npm"
    exit 1
fi

# Navigate to MCP server directory
cd "$(dirname "$0")/mcp-server"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    npm install
    echo ""
fi

# Build if needed
if [ ! -d "dist" ]; then
    echo -e "${BLUE}🔨 Building MCP server...${NC}"
    npm run build
    echo ""
fi

# Get RPC URL from environment or use default
RPC_URL="${RPC_URL:-http://127.0.0.1:8545}"

# Get project root (parent directory of this script)
PROJECT_ROOT="$(dirname "$0")"

echo -e "${GREEN}✅ Starting modernization tool...${NC}"
echo -e "${BLUE}📂 Project: ${PROJECT_ROOT}${NC}"
echo -e "${BLUE}🌐 RPC URL: ${RPC_URL}${NC}"
echo ""

# Launch the modernization CLI
npm run modernize -- "$PROJECT_ROOT" "$RPC_URL"
