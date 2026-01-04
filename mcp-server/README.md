# Dapp Modernization MCP Server

A Model Context Protocol (MCP) server for analyzing and modernizing Ethereum smart contracts and dapp projects. This server provides tools, resources, and prompts for blockchain development automation.

## 🎯 What is MCP?

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/) is an open protocol that enables AI assistants to securely interact with local and remote resources. This MCP server exposes smart contract analysis and modernization capabilities to AI assistants like Claude Desktop.

## ✨ Features

This MCP server provides:

### 📊 Resources
- **Current Analysis** - Real-time analysis of dapp structure
- **Modernization Report** - Detailed markdown reports with recommendations
- **Upgrade Script** - Automated bash scripts for modernization
- **Contract List** - Inventory of all Solidity contracts in the project

### 🛠️ Tools
- **analyze_dapp** - Comprehensive dapp analysis for modernization opportunities
- **security_audit** - Focused security audit of smart contracts
- **generate_upgrade_script** - Create automated upgrade scripts
- **check_dependencies** - Analyze and suggest dependency upgrades
- **estimate_gas_savings** - Estimate potential gas optimization savings
- [Etherscan v2 Notes](./ETHERSCAN_V2.md) - Chain IDs, required params, sample endpoints

### 💬 Prompts
- **modernization_plan** - Generate comprehensive modernization plans
- **security_checklist** - Create security checklists based on analysis
- **upgrade_proposal** - Detailed upgrade proposal documents

## 🚀 Quick Start

### Installation

```bash
cd /path/to/dapptools/mcp-server
npm install
npm run build
```

### Testing with MCP Inspector

The [MCP Inspector](https://github.com/modelcontextprotocol/inspector) is the official tool for testing MCP servers:

```bash
# Start the inspector with your server
npx @modelcontextprotocol/inspector node dist/mcpServer.js
```

This will:
1. Start a proxy server on `127.0.0.1:6277`
2. Launch the web UI at `http://localhost:6274`
3. Connect to your MCP server via stdio

You'll see output like:
```
⚙️ Proxy server listening on 127.0.0.1:6277
🔑 Session token: [your-token-here]
🔗 Open inspector with token pre-filled:
   http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=[token]
```

Open the URL in your browser to interact with the server!

## 🔍 Using the MCP Inspector

Once the inspector is running in your browser:

### 1. View Available Resources

Click on **Resources** tab to see:
- `analysis://current` - Current dapp analysis (JSON)
- `report://modernization` - Modernization report (Markdown)
- `script://upgrade` - Upgrade script (Shell)
- `contracts://list` - Contract list (JSON)

Click any resource to view its contents.

### 2. Execute Tools

Click on **Tools** tab to execute:

**Example: Analyze a Dapp**
```json
{
  "name": "analyze_dapp",
  "arguments": {
    "project_path": "/path/to/your/dapp"
  }
}
```

**Example: Security Audit**
```json
{
  "name": "security_audit",
  "arguments": {}
}
```

**Example: Estimate Gas Savings**
```json
{
  "name": "estimate_gas_savings",
  "arguments": {
    "contract_address": "0x..."
  }
}
```

### 3. Use Prompts

Click on **Prompts** tab to generate:

**Example: Modernization Plan**
```json
{
  "name": "modernization_plan",
  "arguments": {
    "priority": "high",
    "budget": "moderate"
  }
}
```

The prompt will generate a comprehensive modernization plan with:
- Executive Summary
- Priority Recommendations
- Implementation Timeline
- Cost-Benefit Analysis
- Risk Assessment
- Success Metrics

## 🔧 Configuration

### Environment Variables

```bash
# RPC URL for blockchain connection (default: http://127.0.0.1:8545)
export RPC_URL=http://127.0.0.1:8545

# Project root directory (default: current directory)
export PROJECT_ROOT=/path/to/your/dapp
```

### Running in Different Modes

**Development Mode** (with TypeScript):
```bash
npm run mcp-dev
```

**Production Mode**:
```bash
npm run mcp
```

**Standalone CLI** (for debugging):
```bash
npm start
```

## 📝 Adding New Prompts

To add a new prompt to the MCP server:

### 1. Define the Prompt in `ListPromptsRequestSchema` Handler

Edit `src/mcpServer.ts` and add your prompt to the prompts array:

```typescript
this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return {
        prompts: [
            // ... existing prompts ...
            {
                name: 'your_new_prompt',
                description: 'Description of what this prompt does',
                arguments: [
                    {
                        name: 'param1',
                        description: 'Description of first parameter',
                        required: false,
                    },
                    {
                        name: 'param2',
                        description: 'Description of second parameter',
                        required: true,
                    },
                ],
            },
        ],
    };
});
```

### 2. Implement the Prompt Logic in `GetPromptRequestSchema` Handler

Add the case handler for your prompt:

```typescript
this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
        // ... existing cases ...
        
        case 'your_new_prompt': {
            const param1 = args?.param1 || 'default_value';
            const param2 = args?.param2;
            
            // Get necessary data
            const analysis = await this.dappAnalyzer.analyzeDapp();
            
            return {
                messages: [
                    {
                        role: 'user',
                        content: {
                            type: 'text',
                            text: `Your prompt template here using ${param1} and ${param2}
                            
Analysis data: ${JSON.stringify(analysis, null, 2)}

Instructions for the AI:
1. First instruction
2. Second instruction
3. etc.`,
                        },
                    },
                ],
            };
        }
    }
});
```

### 3. Rebuild and Test

```bash
npm run build
npx @modelcontextprotocol/inspector node dist/mcpServer.js
```

In the inspector, navigate to **Prompts** tab and test your new prompt!

### Example: Adding a "Test Plan" Prompt

```typescript
// In ListPromptsRequestSchema handler:
{
    name: 'test_plan',
    description: 'Generate a comprehensive test plan for smart contracts',
    arguments: [
        {
            name: 'coverage_target',
            description: 'Target test coverage percentage (e.g., "80")',
            required: false,
        },
    ],
}

// In GetPromptRequestSchema handler:
case 'test_plan': {
    const analysis = await this.dappAnalyzer.analyzeDapp();
    const coverageTarget = args?.coverage_target || '80';
    
    return {
        messages: [
            {
                role: 'user',
                content: {
                    type: 'text',
                    text: `Create a comprehensive test plan for this dapp:

${JSON.stringify(analysis, null, 2)}

Target Coverage: ${coverageTarget}%

Include:
1. Unit test requirements
2. Integration test scenarios
3. Edge cases to cover
4. Security test cases
5. Gas optimization tests
6. Test infrastructure recommendations`,
                },
            },
        ],
    };
}
```

## 📚 Adding New Tools

To add a new tool:

### 1. Define in `ListToolsRequestSchema`

```typescript
{
    name: 'your_new_tool',
    description: 'What this tool does',
    inputSchema: {
        type: 'object',
        properties: {
            param1: {
                type: 'string',
                description: 'Parameter description',
            },
        },
    },
}
```

### 2. Implement in `CallToolRequestSchema`

```typescript
case 'your_new_tool': {
    const param1 = args?.param1 as string;
    const result = await this.performYourToolLogic(param1);
    
    return {
        content: [{
            type: 'text',
            text: result,
        }],
    };
}
```

## 🧪 Running Tests

```bash
# Test the components
node verify.mjs

# Or use the test script
cd /path/to/dapptools
./TEST_MCP.sh
```

## 🔗 Integration with Claude Desktop

To use this MCP server with Claude Desktop:

1. Edit your Claude Desktop configuration:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. Add this server:

```json
{
  "mcpServers": {
    "dapp-modernization": {
      "command": "node",
      "args": [
        "/path/to/dapptools/mcp-server/dist/mcpServer.js"
      ],
      "env": {
        "PROJECT_ROOT": "/path/to/your/dapp",
        "RPC_URL": "http://127.0.0.1:8545"
      }
    }
  }
}
```

3. Restart Claude Desktop

4. The server's tools and resources will be available in Claude!

## 📖 API Reference

### DappAnalyzer

```typescript
import { DappAnalyzer } from './dist/dappAnalyzer.js';

const analyzer = new DappAnalyzer(
    'http://127.0.0.1:8545',  // RPC URL
    '/path/to/dapp'            // Project root
);

const analysis = await analyzer.analyzeDapp();
```

**Returns:**
```typescript
{
    contractsFound: number;
    solidityVersion: string;
    modernization: {
        priority: 'low' | 'medium' | 'high';
        recommendations: string[];
    };
    security: {
        hasAccessControl: boolean;
        hasPausable: boolean;
        hasReentrancyGuard: boolean;
        hasUpgradeable: boolean;
    };
    dependencies: {
        foundry: boolean;
        openzeppelin: boolean;
        outdated: string[];
    };
}
```

## 🛟 Troubleshooting

### Inspector won't connect

Make sure the server builds successfully:
```bash
npm run build
```

Check that `dist/mcpServer.js` exists.

### "Cannot find module" errors

Install dependencies:
```bash
npm install
```

### RPC connection errors

Ensure your blockchain node is running:
```bash
# For local testing with Anvil
anvil --port 8545
```

### Analysis returns no contracts

Check that `PROJECT_ROOT` points to a directory containing Solidity files in:
- `src/`
- `contracts/`
- `examples/`

## 🤝 Contributing

To contribute new features:

1. Add your tool/prompt/resource to `src/mcpServer.ts`
2. Implement the logic in the appropriate handler
3. Rebuild with `npm run build`
4. Test with the inspector
5. Update this README with usage examples

## 📄 License

Same as parent dapptools project.

## 🔗 Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Example MCP Servers](https://github.com/modelcontextprotocol/servers)

## 💡 Examples

### Example 1: Analyze and Generate Report

```bash
# Start inspector
npx @modelcontextprotocol/inspector node dist/mcpServer.js

# In the inspector:
# 1. Go to Resources tab
# 2. Click "report://modernization"
# 3. View the generated markdown report
```

### Example 2: Security Audit Workflow

```bash
# In inspector Tools tab, execute:
{
  "name": "security_audit",
  "arguments": {}
}

# Review the security findings
# Then generate an upgrade script:
{
  "name": "generate_upgrade_script",
  "arguments": {}
}
```

### Example 3: Custom Modernization Plan

```bash
# In inspector Prompts tab:
{
  "name": "modernization_plan",
  "arguments": {
    "priority": "high",
    "budget": "generous"
  }
}

# Claude will generate a comprehensive plan based on your dapp analysis
```

## 🎓 Learn More

- Check `INTEGRATION_GUIDE.md` in the parent directory for full dapp integration
- See `ADVANCED_FEATURES.md` for advanced token and contract features
- Review `src/mcpServer.ts` for implementation details

---

**Happy analyzing! 🚀**
