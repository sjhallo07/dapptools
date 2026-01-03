#!/usr/bin/env node

import { DappAnalyzer } from './dappAnalyzer.js';
import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function prompt(question: string): Promise<string>
{
    return new Promise((resolve) =>
    {
        rl.question(question, (answer) =>
        {
            resolve(answer);
        });
    });
}

async function main()
{
    console.log('═══════════════════════════════════════════════════════════');
    console.log('        MCP SERVER - DAPP MODERNIZATION TOOL              ');
    console.log('═══════════════════════════════════════════════════════════\n');

    // Get project root
    const projectRoot = process.argv[2] || process.cwd();
    console.log(`📂 Project Root: ${projectRoot}\n`);

    // Get RPC URL
    const defaultRpc = 'http://127.0.0.1:8545';
    const rpcUrl = process.argv[3] || defaultRpc;
    console.log(`🌐 RPC URL: ${rpcUrl}\n`);

    // Create analyzer
    const analyzer = new DappAnalyzer(rpcUrl, projectRoot);

    // Show menu
    while (true) {
        console.log('\n🔧 MODERNIZATION MENU:\n');
        console.log('1. 🔍 Analyze Dapp');
        console.log('2. 📋 Generate Upgrade Script');
        console.log('3. 🚀 Auto-Upgrade (Interactive)');
        console.log('4. 📊 Security Audit');
        console.log('5. 🎨 Code Style Modernization');
        console.log('6. 📦 Dependency Check');
        console.log('7. ❌ Exit\n');

        const choice = await prompt('Select option (1-7): ');

        switch (choice.trim()) {
            case '1':
                await analyzeCommand(analyzer);
                break;
            case '2':
                await generateScriptCommand(analyzer);
                break;
            case '3':
                await autoUpgradeCommand(analyzer);
                break;
            case '4':
                await securityAuditCommand(analyzer);
                break;
            case '5':
                await codeStyleCommand(analyzer);
                break;
            case '6':
                await dependencyCheckCommand(analyzer);
                break;
            case '7':
                console.log('\n👋 Goodbye!\n');
                rl.close();
                process.exit(0);
            default:
                console.log('❌ Invalid option. Please try again.');
        }
    }
}

async function analyzeCommand(analyzer: DappAnalyzer)
{
    console.log('\n🔍 Starting analysis...\n');
    const analysis = await analyzer.analyzeDapp();
    analyzer.printReport(analysis);

    await prompt('\nPress Enter to continue...');
}

async function generateScriptCommand(analyzer: DappAnalyzer)
{
    console.log('\n📋 Generating upgrade script...\n');
    const analysis = await analyzer.analyzeDapp();
    const script = await analyzer.generateUpgradeScript(analysis);

    const scriptPath = path.join(process.cwd(), 'upgrade-dapp.sh');
    fs.writeFileSync(scriptPath, script, { mode: 0o755 });

    console.log(`✅ Script generated: ${scriptPath}`);
    console.log('\nTo run the upgrade:');
    console.log(`   bash ${scriptPath}\n`);

    await prompt('Press Enter to continue...');
}

async function autoUpgradeCommand(analyzer: DappAnalyzer)
{
    console.log('\n🚀 AUTO-UPGRADE WIZARD\n');
    const analysis = await analyzer.analyzeDapp();

    console.log('This will perform the following actions:\n');
    analysis.modernization.recommendations.forEach((rec, i) =>
    {
        console.log(`   ${i + 1}. ${rec}`);
    });
    console.log();

    const confirm = await prompt('Proceed with auto-upgrade? (yes/no): ');

    if (confirm.toLowerCase() === 'yes' || confirm.toLowerCase() === 'y') {
        console.log('\n⚙️  Performing upgrades...\n');

        // Install dependencies
        if (!analysis.dependencies.foundry) {
            console.log('📦 Installing Foundry...');
            // This would run actual installation
            console.log('   ℹ️  Please install Foundry manually: curl -L https://foundry.paradigm.xyz | bash');
        }

        if (!analysis.dependencies.openzeppelin) {
            console.log('📦 Installing OpenZeppelin...');
            console.log('   ℹ️  Run: forge install OpenZeppelin/openzeppelin-contracts');
        }

        // Update Solidity version
        if (analysis.modernization.needsUpgrade) {
            console.log('📝 Updating Solidity versions...');
            console.log('   ℹ️  Backup your contracts before running: find . -name "*.sol" -exec sed -i "s/pragma solidity.*$/pragma solidity ^0.8.20;/g" {} \\;');
        }

        console.log('\n✅ Upgrade recommendations provided!');
        console.log('⚠️  Please review and test thoroughly before deploying.\n');
    } else {
        console.log('\n❌ Auto-upgrade cancelled.\n');
    }

    await prompt('Press Enter to continue...');
}

async function securityAuditCommand(analyzer: DappAnalyzer)
{
    console.log('\n🔒 SECURITY AUDIT\n');
    const analysis = await analyzer.analyzeDapp();

    console.log('Security Features Status:\n');
    console.log(`   ${analysis.security.hasAccessControl ? '✅' : '❌'} Access Control (RBAC)`);
    console.log(`   ${analysis.security.hasPausable ? '✅' : '❌'} Emergency Pause`);
    console.log(`   ${analysis.security.hasReentrancyGuard ? '✅' : '❌'} Reentrancy Protection`);
    console.log(`   ${analysis.security.hasUpgradeable ? '✅' : '❌'} Upgradeability Pattern\n`);

    const missingFeatures = [];
    if (!analysis.security.hasAccessControl) missingFeatures.push('Access Control');
    if (!analysis.security.hasPausable) missingFeatures.push('Pausable');
    if (!analysis.security.hasReentrancyGuard) missingFeatures.push('Reentrancy Guard');

    if (missingFeatures.length > 0) {
        console.log('⚠️  Missing Critical Security Features:\n');
        missingFeatures.forEach((feature, i) =>
        {
            console.log(`   ${i + 1}. ${feature}`);
        });
        console.log('\n💡 Recommendation: Add these features before mainnet deployment\n');
    } else {
        console.log('✅ All critical security features are implemented!\n');
    }

    await prompt('Press Enter to continue...');
}

async function codeStyleCommand(analyzer: DappAnalyzer)
{
    console.log('\n🎨 CODE STYLE MODERNIZATION\n');

    console.log('Recommended modern practices:\n');
    console.log('   1. ✨ Use Custom Errors instead of require strings (saves gas)');
    console.log('   2. 📝 Add NatSpec documentation (@notice, @param, @return)');
    console.log('   3. 🎯 Use named return variables for clarity');
    console.log('   4. 🔒 Mark visibility explicitly (public, external, internal, private)');
    console.log('   5. 📦 Use immutable for constructor-set variables');
    console.log('   6. ⚡ Use unchecked for safe arithmetic (Solidity 0.8+)');
    console.log('   7. 🎭 Use events for important state changes');
    console.log('   8. 🛡️  Add input validation with descriptive errors\n');

    console.log('Example modern contract structure:\n');
    console.log('```solidity');
    console.log('// SPDX-License-Identifier: MIT');
    console.log('pragma solidity ^0.8.20;');
    console.log('');
    console.log('import "@openzeppelin/contracts/access/Ownable.sol";');
    console.log('import "@openzeppelin/contracts/security/Pausable.sol";');
    console.log('');
    console.log('/// @title MyContract');
    console.log('/// @notice This contract does X, Y, and Z');
    console.log('/// @dev Implements modern Solidity patterns');
    console.log('contract MyContract is Ownable, Pausable {');
    console.log('    // Custom errors');
    console.log('    error InvalidAmount();');
    console.log('    error InsufficientBalance();');
    console.log('    ');
    console.log('    // Events');
    console.log('    event ValueUpdated(uint256 oldValue, uint256 newValue);');
    console.log('    ');
    console.log('    // State variables');
    console.log('    uint256 private _value;');
    console.log('    ');
    console.log('    // Functions...');
    console.log('}');
    console.log('```\n');

    await prompt('Press Enter to continue...');
}

async function dependencyCheckCommand(analyzer: DappAnalyzer)
{
    console.log('\n📦 DEPENDENCY CHECK\n');
    const analysis = await analyzer.analyzeDapp();

    console.log('Smart Contract Dependencies:\n');
    console.log(`   ${analysis.dependencies.foundry ? '✅' : '❌'} Foundry (Testing & Deployment)`);
    console.log(`   ${analysis.dependencies.openzeppelin ? '✅' : '❌'} OpenZeppelin Contracts\n`);

    if (analysis.dependencies.outdated.length > 0) {
        console.log('⚠️  Outdated Dependencies:\n');
        analysis.dependencies.outdated.forEach((dep, i) =>
        {
            console.log(`   ${i + 1}. ${dep}`);
        });
        console.log();
    }

    console.log('Recommended Tooling:\n');
    console.log('   • Foundry - Fast Ethereum toolkit (forge, cast, anvil)');
    console.log('   • OpenZeppelin - Secure smart contract library');
    console.log('   • Slither - Static analysis tool');
    console.log('   • Mythril - Security analysis tool');
    console.log('   • Hardhat - Development environment (alternative)');
    console.log('   • Tenderly - Monitoring and debugging\n');

    console.log('Installation Commands:\n');
    console.log('   forge install OpenZeppelin/openzeppelin-contracts');
    console.log('   pip3 install slither-analyzer');
    console.log('   docker pull mythril/myth\n');

    await prompt('Press Enter to continue...');
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () =>
{
    console.log('\n\n👋 Goodbye!\n');
    rl.close();
    process.exit(0);
});

main().catch((error) =>
{
    console.error('❌ Error:', error.message);
    rl.close();
    process.exit(1);
});
