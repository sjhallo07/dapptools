import { JsonRpcClient } from './jsonRpcClient.js';
import { SmartContractManager } from './smartContractManager.js';
import * as fs from 'fs';
import * as path from 'path';

export interface DappAnalysis
{
    solidityVersion: string;
    contractsFound: number;
    security: {
        hasAccessControl: boolean;
        hasPausable: boolean;
        hasReentrancyGuard: boolean;
        hasUpgradeable: boolean;
    };
    modernization: {
        needsUpgrade: boolean;
        recommendations: string[];
        priority: 'low' | 'medium' | 'high';
    };
    dependencies: {
        foundry: boolean;
        openzeppelin: boolean;
        outdated: string[];
    };
}

export class DappAnalyzer
{
    private rpcClient: JsonRpcClient;
    private contractManager: SmartContractManager;
    private projectRoot: string;

    constructor(rpcUrl: string, projectRoot: string = process.cwd())
    {
        this.rpcClient = new JsonRpcClient(rpcUrl);
        this.contractManager = new SmartContractManager(rpcUrl);
        this.projectRoot = projectRoot;
    }

    /**
     * Analyze the entire dapp for modernization opportunities
     */
    async analyzeDapp(): Promise<DappAnalysis>
    {
        console.log('🔍 Analyzing dapp structure...\n');

        const analysis: DappAnalysis = {
            solidityVersion: 'unknown',
            contractsFound: 0,
            security: {
                hasAccessControl: false,
                hasPausable: false,
                hasReentrancyGuard: false,
                hasUpgradeable: false,
            },
            modernization: {
                needsUpgrade: false,
                recommendations: [],
                priority: 'low',
            },
            dependencies: {
                foundry: false,
                openzeppelin: false,
                outdated: [],
            },
        };

        // Find all Solidity files
        const contracts = this.findSolidityFiles();
        analysis.contractsFound = contracts.length;

        // Analyze each contract
        for (const contractPath of contracts) {
            const content = fs.readFileSync(contractPath, 'utf-8');
            this.analyzeContract(content, analysis);
        }

        // Check dependencies
        this.analyzeDependencies(analysis);

        // Generate recommendations
        this.generateRecommendations(analysis);

        return analysis;
    }

    /**
     * Find all Solidity files in the project
     */
    private findSolidityFiles(): string[]
    {
        const contracts: string[] = [];
        const searchDirs = ['src', 'contracts', 'examples'];

        for (const dir of searchDirs) {
            const fullPath = path.join(this.projectRoot, dir);
            if (fs.existsSync(fullPath)) {
                this.findSolidityFilesRecursive(fullPath, contracts);
            }
        }

        return contracts;
    }

    /**
     * Recursively find Solidity files
     */
    private findSolidityFilesRecursive(dir: string, contracts: string[]): void
    {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                this.findSolidityFilesRecursive(fullPath, contracts);
            } else if (file.endsWith('.sol')) {
                contracts.push(fullPath);
            }
        }
    }

    /**
     * Analyze a single contract
     */
    private analyzeContract(content: string, analysis: DappAnalysis): void
    {
        // Extract Solidity version
        const versionMatch = content.match(/pragma solidity ([\^>=<\s0-9.]+);/);
        if (versionMatch) {
            analysis.solidityVersion = versionMatch[1].trim();
        }

        // Check for security features
        if (content.includes('Ownable') || content.includes('AccessControl')) {
            analysis.security.hasAccessControl = true;
        }
        if (content.includes('Pausable') || content.includes('pause()')) {
            analysis.security.hasPausable = true;
        }
        if (content.includes('ReentrancyGuard') || content.includes('nonReentrant')) {
            analysis.security.hasReentrancyGuard = true;
        }
        if (content.includes('Upgradeable') || content.includes('UUPSUpgradeable')) {
            analysis.security.hasUpgradeable = true;
        }

        // Check for old patterns
        if (content.includes('function () external payable') || content.includes('function() public payable')) {
            analysis.modernization.needsUpgrade = true;
            analysis.modernization.recommendations.push('⚠️  Old fallback function syntax detected - upgrade to receive() and fallback()');
        }

        if (content.includes('address.transfer') || content.includes('address.send')) {
            analysis.modernization.needsUpgrade = true;
            analysis.modernization.recommendations.push('⚠️  Using .transfer() or .send() - consider using .call{value:}()');
        }

        if (!content.includes('SPDX-License-Identifier')) {
            analysis.modernization.recommendations.push('📝 Add SPDX license identifier');
        }

        // Check Solidity version
        if (analysis.solidityVersion.startsWith('^0.4') || analysis.solidityVersion.startsWith('0.4')) {
            analysis.modernization.needsUpgrade = true;
            analysis.modernization.priority = 'high';
            analysis.modernization.recommendations.push('🚨 Critical: Solidity 0.4.x is outdated - upgrade to 0.8.x');
        } else if (analysis.solidityVersion.startsWith('^0.6') || analysis.solidityVersion.startsWith('0.6')) {
            analysis.modernization.needsUpgrade = true;
            analysis.modernization.priority = 'medium';
            analysis.modernization.recommendations.push('⚠️  Solidity 0.6.x is old - upgrade to 0.8.x for better security');
        }
    }

    /**
     * Analyze project dependencies
     */
    private analyzeDependencies(analysis: DappAnalysis): void
    {
        // Check for foundry.toml
        const foundryPath = path.join(this.projectRoot, 'foundry.toml');
        if (fs.existsSync(foundryPath)) {
            analysis.dependencies.foundry = true;
        }

        // Check for OpenZeppelin
        const libPath = path.join(this.projectRoot, 'lib');
        if (fs.existsSync(libPath)) {
            const libs = fs.readdirSync(libPath);
            if (libs.includes('openzeppelin-contracts')) {
                analysis.dependencies.openzeppelin = true;
            }
        }

        // Check for package.json
        const packagePath = path.join(this.projectRoot, 'package.json');
        if (fs.existsSync(packagePath)) {
            const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
            // Check for outdated frontend dependencies
            if (packageJson.dependencies) {
                if (packageJson.dependencies.react && packageJson.dependencies.react.startsWith('^16')) {
                    analysis.dependencies.outdated.push('React 16.x - upgrade to React 18.x');
                }
                if (packageJson.dependencies.ethers && packageJson.dependencies.ethers.startsWith('^5')) {
                    analysis.dependencies.outdated.push('ethers.js 5.x - upgrade to ethers.js 6.x');
                }
            }
        }
    }

    /**
     * Generate comprehensive recommendations
     */
    private generateRecommendations(analysis: DappAnalysis): void
    {
        // Security recommendations
        if (!analysis.security.hasAccessControl) {
            analysis.modernization.recommendations.push('🔐 Consider adding AccessControl for better permission management');
        }
        if (!analysis.security.hasPausable) {
            analysis.modernization.recommendations.push('⏸️  Add Pausable functionality for emergency stops');
        }
        if (!analysis.security.hasReentrancyGuard) {
            analysis.modernization.recommendations.push('🛡️  Add ReentrancyGuard to prevent reentrancy attacks');
        }

        // Modern features recommendations
        if (!analysis.security.hasUpgradeable) {
            analysis.modernization.recommendations.push('🔄 Consider making contracts upgradeable with UUPS or Transparent Proxy');
        }

        // Foundry recommendation
        if (!analysis.dependencies.foundry) {
            analysis.modernization.recommendations.push('⚡ Migrate to Foundry for faster testing and deployment');
        }

        // OpenZeppelin recommendation
        if (!analysis.dependencies.openzeppelin) {
            analysis.modernization.recommendations.push('📦 Install OpenZeppelin contracts for battle-tested security');
        }

        // Outdated dependencies
        for (const outdated of analysis.dependencies.outdated) {
            analysis.modernization.recommendations.push(`📦 ${outdated}`);
        }

        // Set priority based on findings
        if (analysis.modernization.recommendations.length === 0) {
            analysis.modernization.priority = 'low';
        } else if (analysis.modernization.needsUpgrade) {
            // Already set by version checks
        } else if (analysis.modernization.recommendations.length > 5) {
            analysis.modernization.priority = 'medium';
        }
    }

    /**
     * Print analysis report
     */
    printReport(analysis: DappAnalysis): void
    {
        console.log('═══════════════════════════════════════════════════════════');
        console.log('           DAPP MODERNIZATION ANALYSIS REPORT              ');
        console.log('═══════════════════════════════════════════════════════════\n');

        console.log(`📊 Project Overview:`);
        console.log(`   • Solidity Version: ${analysis.solidityVersion}`);
        console.log(`   • Contracts Found: ${analysis.contractsFound}`);
        console.log(`   • Priority Level: ${analysis.modernization.priority.toUpperCase()}\n`);

        console.log(`🔒 Security Features:`);
        console.log(`   ${analysis.security.hasAccessControl ? '✅' : '❌'} Access Control`);
        console.log(`   ${analysis.security.hasPausable ? '✅' : '❌'} Pausable`);
        console.log(`   ${analysis.security.hasReentrancyGuard ? '✅' : '❌'} Reentrancy Guard`);
        console.log(`   ${analysis.security.hasUpgradeable ? '✅' : '❌'} Upgradeable\n`);

        console.log(`📦 Dependencies:`);
        console.log(`   ${analysis.dependencies.foundry ? '✅' : '❌'} Foundry`);
        console.log(`   ${analysis.dependencies.openzeppelin ? '✅' : '❌'} OpenZeppelin\n`);

        if (analysis.modernization.recommendations.length > 0) {
            console.log(`💡 Recommendations (${analysis.modernization.recommendations.length}):\n`);
            analysis.modernization.recommendations.forEach((rec, i) =>
            {
                console.log(`   ${i + 1}. ${rec}`);
            });
            console.log();
        }

        console.log('═══════════════════════════════════════════════════════════\n');

        if (analysis.modernization.priority === 'high') {
            console.log('🚨 HIGH PRIORITY: Immediate action recommended!');
        } else if (analysis.modernization.priority === 'medium') {
            console.log('⚠️  MEDIUM PRIORITY: Consider upgrading soon');
        } else {
            console.log('✅ LOW PRIORITY: Your dapp is relatively modern');
        }
        console.log();
    }

    /**
     * Generate upgrade script
     */
    async generateUpgradeScript(analysis: DappAnalysis): Promise<string>
    {
        let script = '#!/bin/bash\n\n';
        script += '# Dapp Modernization Script\n';
        script += '# Generated by MCP Server Analyzer\n\n';

        script += 'echo "🚀 Starting dapp modernization process..."\n\n';

        // Install Foundry if needed
        if (!analysis.dependencies.foundry) {
            script += '# Install Foundry\n';
            script += 'echo "Installing Foundry..."\n';
            script += 'curl -L https://foundry.paradigm.xyz | bash\n';
            script += 'foundryup\n\n';
        }

        // Install OpenZeppelin if needed
        if (!analysis.dependencies.openzeppelin) {
            script += '# Install OpenZeppelin Contracts\n';
            script += 'echo "Installing OpenZeppelin..."\n';
            script += 'forge install OpenZeppelin/openzeppelin-contracts\n\n';
        }

        // Update Solidity version if needed
        if (analysis.modernization.needsUpgrade) {
            script += '# Update Solidity version\n';
            script += 'echo "Updating Solidity version in contracts..."\n';
            script += 'find . -name "*.sol" -type f -exec sed -i "s/pragma solidity.*$/pragma solidity ^0.8.20;/g" {} \\;\n\n';
        }

        // Compile contracts
        script += '# Compile contracts\n';
        script += 'echo "Compiling contracts..."\n';
        script += 'forge build\n\n';

        // Run tests
        script += '# Run tests\n';
        script += 'echo "Running tests..."\n';
        script += 'forge test\n\n';

        script += 'echo "✅ Modernization complete!"\n';

        return script;
    }
}
