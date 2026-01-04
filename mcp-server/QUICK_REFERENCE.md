# MCP Server Quick Reference

Quick reference guide for the Dapp Modernization MCP Server.

## 🚀 Quick Start

```bash
# Navigate and build
cd mcp-server
npm install && npm run build

# Test with inspector
npx @modelcontextprotocol/inspector node dist/mcpServer.js

# Open in browser
open http://localhost:6274
```

## 📊 Resources

Access analysis and reports via the Resources tab:

| URI | Description | Format |
|-----|-------------|--------|
| `analysis://current` | Current dapp analysis | JSON |
| `report://modernization` | Modernization report | Markdown |
| `script://upgrade` | Auto-generated upgrade script | Shell |
| `contracts://list` | All Solidity contracts | JSON |

## 🛠️ Tools

Execute tools for analysis and automation:

| Tool | Purpose | Arguments |
|------|---------|-----------|
| `analyze_dapp` | Full dapp analysis | `project_path` (optional) |
| `security_audit` | Security assessment | `contract_path` (optional) |
| `generate_upgrade_script` | Create upgrade script | none |
| `check_dependencies` | Dependency analysis | none |
| `estimate_gas_savings` | Gas optimization estimates | `contract_address` (optional) |

### Example Tool Calls

```json
// Analyze a dapp
{
  "name": "analyze_dapp",
  "arguments": {
    "project_path": "/path/to/dapp"
  }
}

// Security audit
{
  "name": "security_audit",
  "arguments": {}
}

// Check dependencies
{
  "name": "check_dependencies",
  "arguments": {}
}
```

## 💬 Prompts

Generate AI instructions for complex tasks:

| Prompt | Purpose | Arguments |
|--------|---------|-----------|
| `modernization_plan` | Comprehensive modernization strategy | `priority`, `budget` |
| `security_checklist` | Security verification checklist | none |
| `upgrade_proposal` | Detailed upgrade proposal | `timeline` |

### Example Prompt Calls

```json
// Modernization plan
{
  "name": "modernization_plan",
  "arguments": {
    "priority": "high",
    "budget": "moderate"
  }
}

// Security checklist
{
  "name": "security_checklist",
  "arguments": {}
}

// Upgrade proposal
{
  "name": "upgrade_proposal",
  "arguments": {
    "timeline": "3 months"
  }
}
```

## 🔧 Configuration

### Environment Variables

```bash
export RPC_URL=http://127.0.0.1:8545
export PROJECT_ROOT=/path/to/your/dapp
```

### NPM Scripts

```bash
npm run build      # Compile TypeScript
npm run mcp        # Run production server
npm run mcp-dev    # Run development server
npm start          # Run CLI interface
```

## 🔗 Claude Desktop Integration

**Config location:**
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

**Configuration:**
```json
{
  "mcpServers": {
    "dapp-modernization": {
      "command": "node",
      "args": ["/path/to/dapptools/mcp-server/dist/mcpServer.js"],
      "env": {
        "PROJECT_ROOT": "/path/to/your/dapp",
        "RPC_URL": "http://127.0.0.1:8545"
      }
    }
  }
}
```

## 🧪 Testing

### Automated Test Suite

```bash
# Run all tests
./test-mcp-automated.sh

# Expected: 29 tests, all passing
```

### Manual Testing

```bash
# Test analyzer
node -e "
import('./dist/dappAnalyzer.js').then(m => {
  const a = new m.DappAnalyzer('http://127.0.0.1:8545', '.');
  return a.analyzeDapp();
}).then(r => console.log(r));
"

# Test with inspector
npx @modelcontextprotocol/inspector node dist/mcpServer.js
```

## 📝 Analysis Output Format

```json
{
  "contractsFound": 23,
  "solidityVersion": "^0.8.20",
  "modernization": {
    "priority": "medium",
    "recommendations": [
      "⚠️  Upgrade Solidity to 0.8.x",
      "💡 Add OpenZeppelin",
      "🔐 Implement access control"
    ]
  },
  "security": {
    "hasAccessControl": false,
    "hasPausable": true,
    "hasReentrancyGuard": false,
    "hasUpgradeable": false
  },
  "dependencies": {
    "foundry": false,
    "openzeppelin": false,
    "outdated": []
  }
}
```

## 🎯 Common Workflows

### Workflow 1: Initial Analysis

1. Start inspector
2. View `analysis://current` resource
3. Execute `security_audit` tool
4. Use `modernization_plan` prompt

### Workflow 2: Modernization

1. Execute `analyze_dapp` tool
2. View `report://modernization` resource
3. Execute `generate_upgrade_script` tool
4. View `script://upgrade` resource
5. Use `upgrade_proposal` prompt

### Workflow 3: Security Review

1. Execute `security_audit` tool
2. Use `security_checklist` prompt
3. Review recommendations
4. Execute `check_dependencies` tool

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Inspector won't start | Run `npm run build` first |
| No contracts found | Check `PROJECT_ROOT` env var |
| Port in use | Kill other inspector instances |
| Module errors | Run `npm install` |
| Build fails | Check TypeScript version |

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Complete documentation |
| `TESTING.md` | Testing guide with examples |
| `ADDING_PROMPTS.md` | How to add custom prompts |
| `../test-mcp-automated.sh` | Automated test script |

## 🔑 Key Concepts

### Resources
Static or dynamic content accessible via URIs. Read-only access to data.

### Tools
Executable functions that perform actions and return results.

### Prompts
Templates that generate structured requests for AI assistants.

## 📊 Priority Levels

- **Low**: Minor improvements, future-proofing
- **Medium**: Some concerns, should address
- **High**: Critical issues, address immediately

## 🛡️ Security Icons

- ⚠️ = Warning/Important
- 🔐 = Security-related
- 💡 = Suggestion
- 🛡️ = Protection
- ⛽ = Gas optimization
- 📦 = Dependencies

## 🎓 Learn More

- Full docs: [README.md](README.md)
- Testing: [TESTING.md](TESTING.md)
- Custom prompts: [ADDING_PROMPTS.md](ADDING_PROMPTS.md)
- MCP Protocol: https://modelcontextprotocol.io/

## 💡 Tips

- Always test with inspector before Claude Desktop integration
- Use `PROJECT_ROOT` to analyze different projects
- Check logs with `2> debug.log` for troubleshooting
- Start with basic prompts, add complexity as needed
- Use automated tests to verify changes

---

**Quick Help:** `npx @modelcontextprotocol/inspector node dist/mcpServer.js`
