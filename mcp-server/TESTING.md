# MCP Server Testing Guide

This guide walks you through testing the Dapp Modernization MCP Server with the official MCP Inspector.

## ✅ Prerequisites

- Node.js 18+ installed
- The MCP server built (`npm run build`)
- Optional: A local Ethereum node (Anvil) running on port 8545

## 🎯 Quick Test (5 minutes)

### Step 1: Build the Server

```bash
cd /path/to/dapptools/mcp-server
npm install
npm run build
```

Verify the build:
```bash
ls -la dist/mcpServer.js  # Should exist
```

### Step 2: Start the Inspector

```bash
npx @modelcontextprotocol/inspector node dist/mcpServer.js
```

You'll see output like:
```
Starting MCP inspector...
⚙️ Proxy server listening on 127.0.0.1:6277
🔑 Session token: abc123...
🔗 Open inspector with token pre-filled:
   http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=abc123...
🔍 MCP Inspector is up and running at http://127.0.0.1:6274 🚀
```

### Step 3: Open the Inspector UI

Click the URL or open your browser to: `http://localhost:6274`

The inspector web interface will load with your MCP server connected!

## 🧪 Testing Resources

In the Inspector UI, click the **Resources** tab.

### Test: View Current Analysis

1. Click on `analysis://current`
2. You should see JSON output with:
   - `contractsFound`: Number of Solidity contracts detected
   - `solidityVersion`: Detected Solidity version(s)
   - `modernization.priority`: low/medium/high
   - `modernization.recommendations`: Array of suggestions
   - `security`: Security features detected
   - `dependencies`: Dependencies status

**Expected Output Example:**
```json
{
  "contractsFound": 23,
  "solidityVersion": "^0.8.20",
  "modernization": {
    "priority": "medium",
    "recommendations": [
      "⚠️  Solidity 0.6.x is old - upgrade to 0.8.x for better security",
      "💡 Consider adding OpenZeppelin for standard implementations",
      "🔐 Add access control to sensitive functions"
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

### Test: View Modernization Report

1. Click on `report://modernization`
2. You should see a formatted Markdown report with:
   - Executive Summary
   - Security Status table
   - Dependencies
   - Recommendations list
   - Next Steps

**Expected Output Example:**
```markdown
# Dapp Modernization Report

## Executive Summary

- **Solidity Version**: ^0.8.20
- **Contracts Found**: 23
- **Priority Level**: MEDIUM

## Security Status

| Feature | Status |
|---------|--------|
| Access Control | ❌ |
| Pausable | ✅ |
| Reentrancy Guard | ❌ |
| Upgradeable | ❌ |

...
```

### Test: View Contract List

1. Click on `contracts://list`
2. You should see JSON with all Solidity files found:

```json
[
  {
    "path": "/full/path/to/contract.sol",
    "relativePath": "src/contract.sol"
  },
  ...
]
```

### Test: Generate Upgrade Script

1. Click on `script://upgrade`
2. You should see a bash script with modernization commands

## 🔧 Testing Tools

In the Inspector UI, click the **Tools** tab.

### Test: Analyze Dapp Tool

1. Select `analyze_dapp` from the dropdown
2. Click "Execute" (or provide a `project_path` argument)
3. Review the analysis results

**Input Example:**
```json
{
  "project_path": "/path/to/dapptools"
}
```

**Expected Output:**
```json
{
  "contractsFound": 23,
  "solidityVersion": "^0.8.20",
  ...
}
```

### Test: Security Audit Tool

1. Select `security_audit`
2. Click "Execute"
3. Review the security audit report

**Expected Output:**
```
🔒 SECURITY AUDIT REPORT

Critical Missing Features: 3
- Access Control
- Reentrancy Guard
- Upgradeable

Recommendations:
⚠️  Solidity 0.6.x is old - upgrade to 0.8.x for better security
🔐 Add access control to sensitive functions
🛡️ Implement reentrancy guards on state-changing functions

Overall Security Score: NEEDS_IMPROVEMENT
```

### Test: Generate Upgrade Script Tool

1. Select `generate_upgrade_script`
2. Click "Execute"
3. You'll receive a bash script for modernization

### Test: Check Dependencies Tool

1. Select `check_dependencies`
2. Click "Execute"
3. Review dependency analysis

**Expected Output:**
```
📦 DEPENDENCY ANALYSIS

Current Dependencies:
- Foundry: Missing
- OpenZeppelin: Missing

Recommended Actions:
- Install Foundry for better tooling
- Install OpenZeppelin for security patterns
```

### Test: Estimate Gas Savings Tool

1. Select `estimate_gas_savings`
2. Optionally provide a `contract_address`
3. Click "Execute"

**Expected Output:**
```
⛽ GAS SAVINGS ESTIMATION

Potential optimizations:
- Custom errors instead of strings: ~50-80% gas savings on reverts
- Immutable variables: ~2,100 gas per SLOAD saved
- Packed structs: ~20,000 gas per slot saved
- Unchecked arithmetic: ~200-300 gas per operation

Estimated total savings: 15-30% on contract interactions
```

## 💬 Testing Prompts

In the Inspector UI, click the **Prompts** tab.

### Test: Modernization Plan Prompt

1. Select `modernization_plan`
2. Optional arguments:
   - `priority`: "low", "medium", or "high"
   - `budget`: "limited", "moderate", or "generous"
3. Click "Execute"

**Input Example:**
```json
{
  "priority": "high",
  "budget": "moderate"
}
```

**Expected Behavior:**
The prompt generates a comprehensive request to an AI assistant asking for:
- Executive Summary
- Priority Recommendations
- Implementation Timeline
- Cost-Benefit Analysis
- Risk Assessment
- Success Metrics

### Test: Security Checklist Prompt

1. Select `security_checklist`
2. Click "Execute"
3. The prompt will generate a request for a comprehensive security checklist

**Expected Output:**
A prompt requesting:
- Pre-deployment security checks
- Code review guidelines
- Testing requirements
- Audit recommendations
- Monitoring setup

### Test: Upgrade Proposal Prompt

1. Select `upgrade_proposal`
2. Optional argument: `timeline` (e.g., "3 months")
3. Click "Execute"

**Expected Output:**
A prompt requesting:
- Current State Assessment
- Proposed Changes
- Technical Implementation Plan
- Timeline and Milestones
- Resource Requirements
- Risk Mitigation
- Success Criteria

## 🔍 Verification Checklist

Use this checklist to verify everything works:

- [ ] Inspector starts without errors
- [ ] Web UI loads at http://localhost:6274
- [ ] All 4 resources are listed and readable:
  - [ ] `analysis://current`
  - [ ] `report://modernization`
  - [ ] `script://upgrade`
  - [ ] `contracts://list`
- [ ] All 5 tools execute successfully:
  - [ ] `analyze_dapp`
  - [ ] `security_audit`
  - [ ] `generate_upgrade_script`
  - [ ] `check_dependencies`
  - [ ] `estimate_gas_savings`
- [ ] All 3 prompts generate correctly:
  - [ ] `modernization_plan`
  - [ ] `security_checklist`
  - [ ] `upgrade_proposal`

## 🐛 Troubleshooting

### Inspector shows "Connection failed"

**Problem:** The MCP server didn't start properly

**Solution:**
```bash
# Check for build errors
cd /path/to/dapptools/mcp-server
npm run build

# Verify the output file exists
ls -la dist/mcpServer.js

# Try running directly to see errors
node dist/mcpServer.js
```

### "No contracts found" in analysis

**Problem:** The PROJECT_ROOT environment variable is not set or incorrect

**Solution:**
```bash
# Set the project root before starting
export PROJECT_ROOT=/path/to/dapptools
npx @modelcontextprotocol/inspector node dist/mcpServer.js
```

### Port already in use

**Problem:** Another inspector or service is using port 6274 or 6277

**Solution:**
```bash
# Find and stop the process
lsof -i :6274
lsof -i :6277

# Or use a different port (if the inspector supports it)
```

### Analysis takes a long time

**Problem:** Analyzing a large project with many contracts

**Solution:** This is normal for large projects. The analysis scans:
- `src/` directory
- `contracts/` directory
- `examples/` directory

Recursively for all `.sol` files.

## 📊 Understanding the Results

### Priority Levels

- **Low**: Minor improvements, mostly cosmetic or future-proofing
- **Medium**: Some security or efficiency concerns that should be addressed
- **High**: Critical security issues or major technical debt

### Security Features

- **Access Control**: Role-based permissions (Ownable, AccessControl)
- **Pausable**: Emergency stop functionality
- **Reentrancy Guard**: Protection against reentrancy attacks
- **Upgradeable**: Proxy pattern for contract upgrades

### Recommendation Icons

- ⚠️ = Warning/Important
- 🔐 = Security-related
- 💡 = Suggestion/Improvement
- 🛡️ = Protection/Guard
- ⛽ = Gas optimization
- 📦 = Dependency-related

## 🎓 Next Steps

After successful testing:

1. **Integrate with Claude Desktop** - See main README.md for configuration
2. **Add custom prompts** - Follow the guide in README.md
3. **Customize analysis** - Modify `src/dappAnalyzer.ts` for your needs
4. **Add new tools** - Extend `src/mcpServer.ts` with project-specific tools

## 📝 Automated Testing Script

Want to automate testing? Create a test script:

```bash
#!/bin/bash
# test-mcp.sh

echo "🧪 Testing MCP Server..."

cd /path/to/dapptools/mcp-server

# Build
echo "Building..."
npm run build || exit 1

# Test analyzer directly
echo "Testing analyzer..."
node -e "
import('./dist/dappAnalyzer.js').then(m => {
  const a = new m.DappAnalyzer('http://127.0.0.1:8545', process.cwd());
  return a.analyzeDapp();
}).then(r => {
  console.log('✅ Found', r.contractsFound, 'contracts');
  console.log('✅ Priority:', r.modernization.priority);
  process.exit(0);
}).catch(e => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
" || exit 1

# Start inspector (will run until Ctrl+C)
echo "Starting inspector..."
echo "Press Ctrl+C to stop"
npx @modelcontextprotocol/inspector node dist/mcpServer.js
```

Make it executable:
```bash
chmod +x test-mcp.sh
./test-mcp.sh
```

## 🎉 Success!

If all tests pass, your MCP server is working correctly and ready to:
- Be used with Claude Desktop
- Analyze any Ethereum dapp project
- Generate modernization recommendations
- Create security audits
- Provide AI-powered development assistance

---

**Need help?** Check the main README.md or the MCP documentation at https://modelcontextprotocol.io/
