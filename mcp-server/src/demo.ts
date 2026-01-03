#!/usr/bin/env node

/**
 * Quick Demo of MCP Server Modernization Features
 */

import { MCPServer } from './index.js';

async function demo()
{
    console.log('═══════════════════════════════════════════════════════════');
    console.log('       MCP SERVER - DAPP MODERNIZATION DEMO               ');
    console.log('═══════════════════════════════════════════════════════════\n');

    // Initialize MCP Server
    const projectRoot = process.argv[2] || '/workspaces/dapptools';
    const rpcUrl = process.argv[3] || 'http://127.0.0.1:8545';

    console.log(`📂 Analyzing project: ${projectRoot}`);
    console.log(`🌐 Using RPC: ${rpcUrl}\n`);

    const server = new MCPServer(rpcUrl, projectRoot);

    try {
        // Analyze the dapp
        console.log('🔍 Running analysis...\n');
        const analysis = await server.analyzeDapp();

        // Print the report
        server.printDappReport(analysis);

        // Generate upgrade script
        if (analysis.modernization.recommendations.length > 0) {
            console.log('📋 Generating upgrade script...\n');
            const script = await server.generateUpgradeScript(analysis);
            console.log('Upgrade Script:');
            console.log('═══════════════════════════════════════════════════════════');
            console.log(script);
            console.log('═══════════════════════════════════════════════════════════\n');
        }

        // Summary
        console.log('✅ Analysis Complete!\n');
        console.log('To use the interactive tool, run:');
        console.log('   ./MODERNIZE.sh\n');
        console.log('Or programmatically:');
        console.log('   npm run modernize\n');

    } catch (error) {
        console.error('❌ Error:', (error as Error).message);
        process.exit(1);
    }
}

demo().catch(console.error);
