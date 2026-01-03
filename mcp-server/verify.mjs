#!/usr/bin/env node

/**
 * Quick verification of MCP Server components
 */

import { DappAnalyzer } from './dist/dappAnalyzer.js';

console.log('🧪 Testing MCP Server Components...\n');

async function test() {
    try {
        // Test DappAnalyzer
        console.log('1. Testing DappAnalyzer...');
        const analyzer = new DappAnalyzer('http://127.0.0.1:8545', '/workspaces/dapptools');
        const analysis = await analyzer.analyzeDapp();

        console.log('✅ Analysis completed:');
        console.log(`   📊 Contracts found: ${analysis.contractsFound}`);
        console.log(`   🔧 Solidity version: ${analysis.solidityVersion}`);
        console.log(`   ⚡ Priority: ${analysis.modernization.priority}`);
        console.log(`   💡 Recommendations: ${analysis.modernization.recommendations.length}`);

        if (analysis.modernization.recommendations.length > 0) {
            console.log('\n   Top recommendations:');
            analysis.modernization.recommendations.slice(0, 3).forEach((rec, i) => {
                console.log(`      ${i + 1}. ${rec}`);
            });
        }

        console.log('\n2. Testing MCP Server...');
        const { DappModernizationMCPServer } = await import('./dist/mcpServer.js');
        console.log('✅ MCP Server class loaded successfully');

        console.log('\n🎉 All components working correctly!');
        console.log('\n📋 Ready to test with MCP Inspector:');
        console.log('   npx @modelcontextprotocol/inspector node /workspaces/dapptools/mcp-server/dist/mcpServer.js');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n🔧 Try rebuilding:');
        console.log('   cd /workspaces/dapptools/mcp-server && npm run build');
    }
}

test();