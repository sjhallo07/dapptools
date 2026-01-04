# Integration Guide: Advanced Tokens & MCP Server

## 🎯 Quick Start

This guide walks you through integrating the new advanced token contracts, token creator UI, and MCP server into your dapptools workflow.

## 📋 What Was Added

### 1. **Advanced Token Contracts** (`examples/foundry-dstoken/src/`)
- `AdvancedToken.sol` - ERC20 with roles, snapshots, pausable, blacklist
- `TokenFactory.sol` - Factory for creating multiple tokens
- `DeployAdvanced.s.sol` - Deployment script

### 2. **React Components** (`frontend/src/`)
- `TokenCreator.tsx` + `TokenCreator.css` - UI for creating tokens
- Updated `App.tsx` - Tab navigation between Dashboard & Creator

### 3. **MCP Server** (`mcp-server/`)
- JSON RPC 2.0 client
- Smart contract manager
- CLI tool for testing
- Full TypeScript implementation

### 4. **Documentation**
- `ADVANCED_FEATURES.md` - Complete feature reference
- This file - integration guide

---

## 🚀 Step-by-Step Setup

### Step 1: Build & Deploy Smart Contracts

```bash
# Navigate to contract directory
cd /workspaces/dapptools/examples/foundry-dstoken

# Build contracts
forge build

# Start Anvil (if not running)
anvil --port 8545 &

# Deploy using the script
forge script script/DeployAdvanced.s.sol \
  --rpc-url http://127.0.0.1:8545 \
  --broadcast
```

**Note the deployed addresses:**
- TokenFactory contract address
- Sample token address (if created)

### Step 2: Set Up MCP Server

```bash
# Navigate to MCP server
cd /workspaces/dapptools/mcp-server

# Already installed, but you can verify
npm install

# Build TypeScript
npm run build

# Test with MCP Inspector (recommended)
npx @modelcontextprotocol/inspector node dist/mcpServer.js
# Then open http://localhost:6274 in your browser

# Or test the CLI (alternative)
RPC_URL=http://127.0.0.1:8545 npm start
```

**Testing with MCP Inspector:**
1. Open http://localhost:6274
2. Test Resources tab (analysis, reports, scripts)
3. Test Tools tab (analyze_dapp, security_audit, etc.)
4. Test Prompts tab (modernization_plan, security_checklist)

**Or in the CLI, test commands:**
```bash
mcp> network
mcp> accounts
mcp> help
mcp> exit
```

**See [mcp-server/TESTING.md](./mcp-server/TESTING.md) for detailed testing instructions.**

### Step 3: Update Frontend Configuration

```bash
cd /workspaces/dapptools/frontend

# Install dependencies (if not done)
npm install

# Create .env file (optional, for default addresses)
cat > .env.local << EOF
VITE_RPC_URL=http://127.0.0.1:8545
VITE_DEPLOYER_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
VITE_DEFAULT_TOKEN_ADDRESS=0x... # Token address from step 1
VITE_FACTORY_ADDRESS=0x... # Factory address from step 1
EOF
```

### Step 4: Start Frontend Dev Server

```bash
# From /workspaces/dapptools/frontend
npm run dev
```

Open browser: http://localhost:5173

---

## 📱 Using the Token Creator

### In the Frontend UI:

1. **Navigate to "Token Creator" tab**
2. **Enter TokenFactory address** (from Step 1 deployment)
3. **Fill in token details:**
   - Name: e.g., "My Custom Token"
   - Symbol: e.g., "MCT" (unique)
   - Decimals: 18 (standard)
   - Initial Supply: e.g., 1000000 (will be 1,000,000 MCT with 18 decimals)
4. **Click "Create Token"**
5. **Confirm in MetaMask**
6. **View newly created token in "Recently Created Tokens" section**

### Programmatically via MCP Server:

```typescript
import { createMCPServer } from './mcp-server/src/index'

const server = createMCPServer('http://127.0.0.1:8545')

// Get all accounts
const accounts = await server.getAccounts()
console.log('Available accounts:', accounts)

// Get token info
const tokenInfo = await server.getTokenMetadata('0x...')
console.log('Token:', tokenInfo.name, tokenInfo.symbol)

// Get balance
const balance = await server.getTokenBalance('0x...', '0x...')
console.log('Balance:', balance)
```

---

## 🧪 Testing & Debugging

### Test Contract Functions via MCP

```typescript
const server = createMCPServer()

// Call read-only function
const abi = ['function balanceOf(address) view returns (uint256)']
const balance = await server.callFunction(
  tokenAddress,
  abi,
  'balanceOf',
  [accountAddress]
)
console.log('Balance:', balance)
```

### Estimate Gas

```typescript
const gasEstimate = await server.estimateGas({
  to: tokenAddress,
  from: accountAddress,
  data: encodedCallData
})
console.log('Gas needed:', gasEstimate)
```

### Test with Snapshots

```typescript
// Create snapshot
const snapshotId = await server.createSnapshot()
console.log('Snapshot created:', snapshotId)

// Make changes...

// Revert to snapshot
await server.revertSnapshot(snapshotId)
console.log('Reverted to snapshot')
```

---

## 🔧 Advanced Features

### Token Snapshots

After deploying AdvancedToken, take snapshots for voting/airdrops:

```solidity
// In your contract or test script
IAdvancedToken token = IAdvancedToken(0x...);

// Take snapshot
uint256 snapshotId = token.snapshot();

// Query historical balance
uint256 historicalBalance = token.balanceOfAt(address, snapshotId);
```

### Role Management

```solidity
AdvancedToken token = AdvancedToken(0x...);

// Add addresses that can mint
token.addMinter(0x...);

// Add addresses that can burn
token.addBurner(0x...);

// Add addresses that can pause
token.addPauser(0x...);

// Check roles
require(token.isMinter(msg.sender), "Not a minter");
```

### Pause/Unpause

```solidity
AdvancedToken token = AdvancedToken(0x...);

// Pause transfers (only pauser can call)
token.pause();

// Unpause (only owner can call)
token.unpause();
```

### Blacklist

```solidity
AdvancedToken token = AdvancedToken(0x...);

// Block an address
token.addToBlacklist(badActor);

// Unblock
token.removeFromBlacklist(goodActor);
```

---

## 📦 Project Structure After Integration

```
/workspaces/dapptools/
├── examples/foundry-dstoken/
│   ├── src/
│   │   ├── DSMath.sol (original)
│   │   ├── DSToken.sol (original)
│   │   ├── AdvancedToken.sol ✨ NEW
│   │   └── TokenFactory.sol ✨ NEW
│   ├── script/
│   │   ├── Counter.s.sol (original)
│   │   └── DeployAdvanced.s.sol ✨ NEW
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── App.tsx (updated)
│   │   ├── TokenDashboard.tsx (original)
│   │   ├── TokenCreator.tsx ✨ NEW
│   │   ├── TokenCreator.css ✨ NEW
│   │   ├── App.css (updated)
│   │   └── ...
│   └── ...
├── mcp-server/ ✨ NEW
│   ├── src/
│   │   ├── index.ts (MCP Server)
│   │   ├── jsonRpcClient.ts
│   │   ├── smartContractManager.ts
│   │   └── cli.ts
│   ├── dist/ (compiled)
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
├── ADVANCED_FEATURES.md ✨ NEW
└── ...
```

---

## 🐛 Troubleshooting

### "Symbol already exists"
**Problem:** Tried to create token with duplicate symbol
**Solution:** Use unique symbol (e.g., MCT1, MCT2)

### "Token Creator shows nothing"
**Problem:** Factory address not set
**Solution:** Deploy TokenFactory first, paste address in "TokenFactory Address" field

### "MetaMask connection failed"
**Problem:** MetaMask not installed or not unlocked
**Solution:** 
- Install MetaMask extension
- Unlock wallet
- Switch to localhost network (127.0.0.1:8545)

### MCP Server won't connect
**Problem:** Anvil not running
**Solution:**
```bash
# Start Anvil in new terminal
anvil --port 8545
```

### "Only owner" error
**Problem:** Using non-owner account
**Solution:** Use the deployer account (usually first Anvil account)

---

## 📚 Next Steps

1. **Deploy to testnet:**
   - Update RPC_URL to Sepolia, Goerli, etc.
   - Fund wallet with testnet ETH
   - Deploy using same scripts

2. **Create custom token:**
   - Use TokenCreator UI
   - Set custom roles for team members
   - Enable snapshots for voting

3. **Build frontend features:**
   - Add token transfer UI
   - Implement role management UI
   - Create snapshot/voting UI

4. **Extend MCP server:**
   - Add transaction signing
   - Implement batch operations
   - Build GraphQL layer

---

## 💡 Tips

- **Always test on Anvil first** before deploying to testnet/mainnet
- **Save deployed addresses** in .env or config files
- **Use snapshots** for testing to avoid resetting Anvil
- **Check gas estimates** before large transactions
- **Monitor logs** in Anvil terminal for debugging

---

## 🤝 Support

For issues or questions:
1. Check ADVANCED_FEATURES.md for detailed API reference
2. Review contract code comments in src/ files
3. Test with MCP CLI for debugging
4. Check browser console for frontend errors

---

## 📄 Files Reference

| File | Purpose |
|------|---------|
| `AdvancedToken.sol` | Main enhanced token contract |
| `TokenFactory.sol` | Factory for creating tokens |
| `DeployAdvanced.s.sol` | Foundry deploy script |
| `TokenCreator.tsx` | React component for UI |
| `mcp-server/src/index.ts` | MCP Server interface |
| `mcp-server/src/jsonRpcClient.ts` | JSON RPC client |
| `mcp-server/src/smartContractManager.ts` | Contract interaction |
| `ADVANCED_FEATURES.md` | Complete documentation |

---

**Happy token creating! 🚀**
