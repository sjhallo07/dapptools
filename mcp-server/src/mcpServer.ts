#!/usr/bin/env node

/**
 * MCP Server for Dapp Modernization and Analysis
 * Implements the Model Context Protocol for blockchain smart contract analysis
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import
{
    ListResourcesRequestSchema,
    ReadResourceRequestSchema,
    ListToolsRequestSchema,
    CallToolRequestSchema,
    ListPromptsRequestSchema,
    GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { DappAnalyzer } from './dappAnalyzer.js';
import { MCPServer as DappMCPServer } from './index.js';
import * as fs from 'fs';
import * as path from 'path';

class DappModernizationMCPServer
{
    private server: Server;
    private dappAnalyzer: DappAnalyzer;
    private mcpServer: DappMCPServer;
    private projectRoot: string;

    constructor()
    {
        this.server = new Server({
            name: 'dapp-modernization-server',
            version: '1.0.0',
        }, {
            capabilities: {
                resources: {},
                tools: {},
                prompts: {},
            },
        });

        // Get project root from environment or use current directory
        this.projectRoot = process.env.PROJECT_ROOT || process.cwd();
        const rpcUrl = process.env.RPC_URL || 'http://127.0.0.1:8545';

        this.dappAnalyzer = new DappAnalyzer(rpcUrl, this.projectRoot);
        this.mcpServer = new DappMCPServer(rpcUrl, this.projectRoot);

        this.setupHandlers();
    }

    private setupHandlers()
    {
        // Resources handler - provides access to analysis reports and files
        this.server.setRequestHandler(ListResourcesRequestSchema, async () =>
        {
            return {
                resources: [
                    {
                        uri: 'analysis://current',
                        mimeType: 'application/json',
                        name: 'Current Dapp Analysis',
                        description: 'Real-time analysis of the dapp structure and modernization opportunities',
                    },
                    {
                        uri: 'report://modernization',
                        mimeType: 'text/markdown',
                        name: 'Modernization Report',
                        description: 'Detailed modernization report with recommendations',
                    },
                    {
                        uri: 'script://upgrade',
                        mimeType: 'text/x-shellscript',
                        name: 'Upgrade Script',
                        description: 'Generated bash script for automated upgrades',
                    },
                    {
                        uri: 'contracts://list',
                        mimeType: 'application/json',
                        name: 'Contract List',
                        description: 'List of all Solidity contracts found in the project',
                    },
                ],
            };
        });

        this.server.setRequestHandler(ReadResourceRequestSchema, async (request) =>
        {
            const uri = request.params.uri;

            switch (uri) {
                case 'analysis://current': {
                    const analysis = await this.dappAnalyzer.analyzeDapp();
                    return {
                        contents: [{
                            uri,
                            mimeType: 'application/json',
                            text: JSON.stringify(analysis, null, 2),
                        }],
                    };
                }

                case 'report://modernization': {
                    const analysis = await this.dappAnalyzer.analyzeDapp();
                    const report = this.generateMarkdownReport(analysis);
                    return {
                        contents: [{
                            uri,
                            mimeType: 'text/markdown',
                            text: report,
                        }],
                    };
                }

                case 'script://upgrade': {
                    const analysis = await this.dappAnalyzer.analyzeDapp();
                    const script = await this.dappAnalyzer.generateUpgradeScript(analysis);
                    return {
                        contents: [{
                            uri,
                            mimeType: 'text/x-shellscript',
                            text: script,
                        }],
                    };
                }

                case 'contracts://list': {
                    const contracts = this.findSolidityFiles();
                    return {
                        contents: [{
                            uri,
                            mimeType: 'application/json',
                            text: JSON.stringify(contracts.map(file => ({
                                path: file,
                                relativePath: path.relative(this.projectRoot, file),
                            })), null, 2),
                        }],
                    };
                }

                default:
                    throw new Error(`Unknown resource: ${uri}`);
            }
        });

        // Tools handler - provides dapp analysis and modernization tools
        this.server.setRequestHandler(ListToolsRequestSchema, async () =>
        {
            return {
                tools: [
                    {
                        name: 'analyze_dapp',
                        description: 'Analyze the entire dapp for modernization opportunities and security issues',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                project_path: {
                                    type: 'string',
                                    description: 'Path to the dapp project (optional, defaults to current directory)',
                                },
                            },
                        },
                    },
                    {
                        name: 'security_audit',
                        description: 'Perform a focused security audit of the smart contracts',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                contract_path: {
                                    type: 'string',
                                    description: 'Path to specific contract file (optional)',
                                },
                            },
                        },
                    },
                    {
                        name: 'generate_upgrade_script',
                        description: 'Generate an automated upgrade script based on analysis',
                        inputSchema: {
                            type: 'object',
                            properties: {},
                        },
                    },
                    {
                        name: 'check_dependencies',
                        description: 'Check project dependencies and suggest upgrades',
                        inputSchema: {
                            type: 'object',
                            properties: {},
                        },
                    },
                    {
                        name: 'estimate_gas_savings',
                        description: 'Estimate potential gas savings from modernization',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                contract_address: {
                                    type: 'string',
                                    description: 'Contract address to analyze (optional)',
                                },
                            },
                        },
                    },
                ],
            };
        });

        this.server.setRequestHandler(CallToolRequestSchema, async (request) =>
        {
            const { name, arguments: args } = request.params;

            switch (name) {
                case 'analyze_dapp': {
                    const projectPath = (args?.project_path as string) || this.projectRoot;
                    const analyzer = new DappAnalyzer('http://127.0.0.1:8545', projectPath);
                    const analysis = await analyzer.analyzeDapp();

                    return {
                        content: [{
                            type: 'text',
                            text: JSON.stringify(analysis, null, 2),
                        }],
                    };
                }

                case 'security_audit': {
                    const analysis = await this.dappAnalyzer.analyzeDapp();
                    const audit = this.generateSecurityAudit(analysis);

                    return {
                        content: [{
                            type: 'text',
                            text: audit,
                        }],
                    };
                }

                case 'generate_upgrade_script': {
                    const analysis = await this.dappAnalyzer.analyzeDapp();
                    const script = await this.dappAnalyzer.generateUpgradeScript(analysis);

                    return {
                        content: [{
                            type: 'text',
                            text: script,
                        }],
                    };
                }

                case 'check_dependencies': {
                    const analysis = await this.dappAnalyzer.analyzeDapp();
                    const deps = this.analyzeDependencies(analysis);

                    return {
                        content: [{
                            type: 'text',
                            text: deps,
                        }],
                    };
                }

                case 'estimate_gas_savings': {
                    const contractAddress = args?.contract_address as string | undefined;
                    const savings = await this.estimateGasSavings(contractAddress);

                    return {
                        content: [{
                            type: 'text',
                            text: savings,
                        }],
                    };
                }

                default:
                    throw new Error(`Unknown tool: ${name}`);
            }
        });

        // Prompts handler - provides templated prompts for common tasks
        this.server.setRequestHandler(ListPromptsRequestSchema, async () =>
        {
            return {
                prompts: [
                    {
                        name: 'modernization_plan',
                        description: 'Generate a comprehensive modernization plan for a dapp',
                        arguments: [
                            {
                                name: 'priority',
                                description: 'Priority level (low, medium, high)',
                                required: false,
                            },
                            {
                                name: 'budget',
                                description: 'Development budget constraints',
                                required: false,
                            },
                        ],
                    },
                    {
                        name: 'security_checklist',
                        description: 'Generate a security checklist based on current analysis',
                        arguments: [],
                    },
                    {
                        name: 'upgrade_proposal',
                        description: 'Create a detailed upgrade proposal document',
                        arguments: [
                            {
                                name: 'timeline',
                                description: 'Proposed timeline for upgrades',
                                required: false,
                            },
                        ],
                    },
                    {
                        name: 'advanced_token_factory_deploy',
                        description: 'Plan advanced token features (pausable/blacklist/snapshot/roles) and deployment steps using OpenZeppelin Contracts Wizard and TokenFactory',
                        arguments: [
                            {
                                name: 'network',
                                description: 'Target network name or RPC URL',
                                required: false,
                            },
                            {
                                name: 'token_name',
                                description: 'Token name to generate in wizard',
                                required: false,
                            },
                            {
                                name: 'token_symbol',
                                description: 'Token symbol to generate in wizard',
                                required: false,
                            },
                            {
                                name: 'initial_supply',
                                description: 'Initial supply (wei units) for factory-created token',
                                required: false,
                            },
                        ],
                    },
                ],
            };
        });

        this.server.setRequestHandler(GetPromptRequestSchema, async (request) =>
        {
            const { name, arguments: args } = request.params;

            switch (name) {
                case 'modernization_plan': {
                    const analysis = await this.dappAnalyzer.analyzeDapp();
                    const priority = args?.priority || 'medium';
                    const budget = args?.budget || 'moderate';

                    return {
                        messages: [
                            {
                                role: 'user',
                                content: {
                                    type: 'text',
                                    text: `Create a comprehensive modernization plan for this dapp based on the following analysis:

${JSON.stringify(analysis, null, 2)}

Priority Level: ${priority}
Budget Constraints: ${budget}

Please provide:
1. Executive Summary
2. Priority Recommendations
3. Implementation Timeline
4. Cost-Benefit Analysis
5. Risk Assessment
6. Success Metrics`,
                                },
                            },
                        ],
                    };
                }

                case 'security_checklist': {
                    const analysis = await this.dappAnalyzer.analyzeDapp();

                    return {
                        messages: [
                            {
                                role: 'user',
                                content: {
                                    type: 'text',
                                    text: `Generate a comprehensive security checklist based on this dapp analysis:

${JSON.stringify(analysis, null, 2)}

Include:
- Pre-deployment security checks
- Code review guidelines
- Testing requirements
- Audit recommendations
- Monitoring setup`,
                                },
                            },
                        ],
                    };
                }

                case 'upgrade_proposal': {
                    const analysis = await this.dappAnalyzer.analyzeDapp();
                    const timeline = args?.timeline || '3 months';

                    return {
                        messages: [
                            {
                                role: 'user',
                                content: {
                                    type: 'text',
                                    text: `Create a detailed upgrade proposal document based on this analysis:

${JSON.stringify(analysis, null, 2)}

Proposed Timeline: ${timeline}

Structure the proposal with:
1. Current State Assessment
2. Proposed Changes
3. Technical Implementation Plan
4. Timeline and Milestones
5. Resource Requirements
6. Risk Mitigation
7. Success Criteria`,
                                },
                            },
                        ],
                    };
                }

                case 'advanced_token_factory_deploy': {
                    const analysis = await this.dappAnalyzer.analyzeDapp();
                    const network = args?.network || 'http://127.0.0.1:8545';
                    const tokenName = args?.token_name || 'AdvancedToken';
                    const tokenSymbol = args?.token_symbol || 'ADV';
                    const initialSupply = args?.initial_supply || '1000000e18';

                    return {
                        messages: [
                            {
                                role: 'user',
                                content: {
                                    type: 'text',
                                    text: `Design and outline steps to configure advanced token features and deploy a TokenFactory-powered token using OpenZeppelin Contracts Wizard.

Current dapp analysis:
${JSON.stringify(analysis, null, 2)}

Requirements:
- Use OpenZeppelin Contracts Wizard (repo: https://github.com/OpenZeppelin/contracts-wizard , app: https://wizard.openzeppelin.com) to generate a role-based ERC20 with:
  - Pausable transfers
  - Snapshot capability
  - Mint/Burn roles
  - Blacklist-style transfer guard (if not available, describe how to extend)
- Token metadata defaults: name=${tokenName}, symbol=${tokenSymbol}, decimals=18, initialSupply=${initialSupply} (adjustable by user).
- Integrate the generated implementation into TokenFactory so factory-created tokens expose these features.
- Deployment target network: ${network} (allow overriding via RPC URL / PRIVATE_KEY env vars).
- Provide Foundry commands to build, test, and deploy (using existing scripts when possible) and how to point the factory createToken call to the new implementation.

Deliverables to include in the answer:
1) Summary of advanced features and security rationale (pausable, snapshot, blacklist/guard, role separation, reentrancy/overflow considerations).
2) Steps to fetch or embed the Contracts Wizard output into src/AdvancedToken.sol (or new file) and wire it to TokenFactory.
3) Deployment steps: anvil/local, then testnet/mainnet, including forge script/broadcast flags and env vars.
4) Post-deploy checks: events, role setup, pause/unpause, snapshot readbacks, blacklist toggling, mint/burn sanity, allowance flows.
5) Optional: guidance on storing factory metadata (creator, createdAt, symbol uniqueness) and recommended monitoring/logging.

Keep instructions concise and actionable.`,
                                },
                            },
                        ],
                    };
                }

                default:
                    throw new Error(`Unknown prompt: ${name}`);
            }
        });
    }

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

    private generateMarkdownReport(analysis: any): string
    {
        return `# Dapp Modernization Report

## Executive Summary

- **Solidity Version**: ${analysis.solidityVersion}
- **Contracts Found**: ${analysis.contractsFound}
- **Priority Level**: ${analysis.modernization.priority.toUpperCase()}

## Security Status

| Feature | Status |
|---------|--------|
| Access Control | ${analysis.security.hasAccessControl ? '✅' : '❌'} |
| Pausable | ${analysis.security.hasPausable ? '✅' : '❌'} |
| Reentrancy Guard | ${analysis.security.hasReentrancyGuard ? '✅' : '❌'} |
| Upgradeable | ${analysis.security.hasUpgradeable ? '✅' : '❌'} |

## Dependencies

- **Foundry**: ${analysis.dependencies.foundry ? '✅' : '❌'}
- **OpenZeppelin**: ${analysis.dependencies.openzeppelin ? '✅' : '❌'}

## Recommendations

${analysis.modernization.recommendations.map((rec: string, i: number) => `${i + 1}. ${rec}`).join('\n')}

## Next Steps

1. Review recommendations in priority order
2. Run generated upgrade script
3. Perform comprehensive testing
4. Deploy with monitoring

---

*Report generated by MCP Dapp Modernization Server*
`;
    }

    private generateSecurityAudit(analysis: any): string
    {
        const missing = [];
        if (!analysis.security.hasAccessControl) missing.push('Access Control');
        if (!analysis.security.hasPausable) missing.push('Pausable');
        if (!analysis.security.hasReentrancyGuard) missing.push('Reentrancy Guard');
        if (!analysis.security.hasUpgradeable) missing.push('Upgradeable');

        return `🔒 SECURITY AUDIT REPORT

Critical Missing Features: ${missing.length}
${missing.map((f: string) => `- ${f}`).join('\n')}

Recommendations:
${analysis.modernization.recommendations.filter((r: string) => r.includes('🛡️') || r.includes('🔐') || r.includes('⚠️')).join('\n')}

Overall Security Score: ${missing.length === 0 ? 'EXCELLENT' : missing.length <= 2 ? 'GOOD' : 'NEEDS_IMPROVEMENT'}`;
    }

    private analyzeDependencies(analysis: any): string
    {
        return `📦 DEPENDENCY ANALYSIS

Current Dependencies:
- Foundry: ${analysis.dependencies.foundry ? 'Installed' : 'Missing'}
- OpenZeppelin: ${analysis.dependencies.openzeppelin ? 'Installed' : 'Missing'}

Outdated Dependencies:
${analysis.dependencies.outdated.length > 0 ? analysis.dependencies.outdated.map((dep: string) => `- ${dep}`).join('\n') : '- None detected'}

Recommended Actions:
${!analysis.dependencies.foundry ? '- Install Foundry for better tooling\n' : ''}${!analysis.dependencies.openzeppelin ? '- Install OpenZeppelin for security patterns\n' : ''}${analysis.dependencies.outdated.map((dep: string) => `- Update ${dep}\n`).join('')}`;
    }

    private async estimateGasSavings(contractAddress?: string): Promise<string>
    {
        // This is a simplified estimation - in practice, you'd analyze specific patterns
        return `⛽ GAS SAVINGS ESTIMATION

Potential optimizations:
- Custom errors instead of strings: ~50-80% gas savings on reverts
- Immutable variables: ~2,100 gas per SLOAD saved
- Packed structs: ~20,000 gas per slot saved
- Unchecked arithmetic: ~200-300 gas per operation

Estimated total savings: 15-30% on contract interactions

${contractAddress ? `Analysis for contract: ${contractAddress}` : 'General estimation - deploy test contract for precise measurements'}`;
    }

    async run()
    {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('Dapp Modernization MCP Server running on stdio');
    }
}

// Start server if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const server = new DappModernizationMCPServer();
    server.run().catch(console.error);
}

export { DappModernizationMCPServer };