# Advanced Token & MCP Server Integration

This document describes the new features added to the dapptools project, including advanced token contracts, token creator interface, and MCP server for JSON RPC 2.0 integration.

## 📦 New Components

### 1. Smart Contracts

#### AdvancedToken.sol
An enhanced ERC20 token with advanced features:

**Features:**
- ✅ Standard ERC20 functions (transfer, approve, etc.)
- ✅ Role-based access control (owner, minter, burner, pauser)
- ✅ Pausable mechanism (pause/unpause token transfers)
- ✅ Blacklist functionality (block specific addresses)
- ✅ Snapshot support (track historical balances)
- ✅ Safe arithmetic via DSMath
- ✅ Increased/decreased allowance functions

**Constructor:**
```solidity
constructor(
    string memory _name,
    string memory _symbol,
    uint8 _decimals,
    uint256 _initialSupply
)
```

**Key Functions:**
```solidity
// Minting & Burning
function mint(address to, uint256 amount) public onlyMinter
function burn(uint256 amount) public onlyBurner
function burnFrom(address account, uint256 amount) public onlyBurner

// Snapshots
function snapshot() public onlyOwner returns (uint256)
function balanceOfAt(address account, uint256 snapshotId) public view returns (uint256)
function totalSupplyAt(uint256 snapshotId) public view returns (uint256)

// Access Control
function addMinter(address account) public onlyOwner
function removeMinter(address account) public onlyOwner
function addBurner(address account) public onlyOwner
function removeBurner(address account) public onlyOwner
function addPauser(address account) public onlyOwner
function removePauser(address account) public onlyOwner

// Pausable
function pause() public onlyPauser
function unpause() public onlyOwner

// Blacklist
function addToBlacklist(address account) public onlyOwner
function removeFromBlacklist(address account) public onlyOwner
```

#### TokenFactory.sol
A factory contract to create and manage multiple tokens.

**Features:**
- ✅ Create new AdvancedToken instances
- ✅ Track all deployed tokens
- ✅ Prevent duplicate symbols
- ✅ Query tokens by index or symbol

**Key Functions:**
```solidity
function createToken(
    string memory _name,
    string memory _symbol,
    uint8 _decimals,
    uint256 _initialSupply
) public returns (address)

function getTokenCount() public view returns (uint256)
function getTokenAt(uint256 index) public view returns (address)
function getAllTokens() public view returns (address[])
function getTokenBySymbol(string memory _symbol) public view returns (address)
```

### 2. React Components

#### TokenCreator.tsx
A user interface for creating new tokens using the TokenFactory contract.

**Features:**
- ✅ Form to input token parameters (name, symbol, decimals, initial supply)
- ✅ Real-time token creation via MetaMask
- ✅ Display recently created tokens
- ✅ Error handling and success messages
- ✅ Responsive design

**Usage:**
```tsx
import TokenCreator from './TokenCreator'

function App() {
  return <TokenCreator factoryAddress="0x..." />
}
```

### 3. MCP Server for JSON RPC 2.0

Located in `/workspaces/dapptools/mcp-server/`

#### Core Modules

**JsonRpcClient.ts**
Low-level JSON RPC 2.0 client for Ethereum-compatible chains.

**Methods:**
```typescript
// Network Methods
getChainId(): Promise<string>
getNetworkVersion(): Promise<string>
getGasPrice(): Promise<string>
getBlockNumber(): Promise<string>

// Account Methods
getBalance(address, block?): Promise<string>
getTransactionCount(address, block?): Promise<string>
getCode(address, block?): Promise<string>

// Transaction Methods
sendTransaction(tx): Promise<string>
sendRawTransaction(signedTx): Promise<string>
getTransaction(txHash): Promise<unknown>
getTransactionReceipt(txHash): Promise<unknown>

// Call Methods
call(tx, block?): Promise<string>
estimateGas(tx): Promise<string>

// Testing Methods (Anvil/Hardhat)
impersonateAccount(address): Promise<void>
setBalance(address, balance): Promise<void>
mine(blocks?): Promise<void>
increaseTime(seconds): Promise<void>
snapshot(): Promise<string>
revert(snapshotId): Promise<void>
```

**SmartContractManager.ts**
High-level contract interaction manager.

**Methods:**
```typescript
// Token Operations
getTokenBalance(tokenAddress, account): Promise<string>
getTokenInfo(tokenAddress): Promise<{name, symbol, decimals, totalSupply}>

// Contract Calls
callContractFunction(contractAddress, abi, functionName, params): Promise<unknown>
encodeFunction(abi, functionName, params): string
decodeFunction(abi, functionName, data): unknown[]

// Storage Operations
getContractCode(contractAddress): Promise<string>
getStorageValue(contractAddress, position, block?): Promise<string>
```

**MCPServer.ts**
High-level server interface combining JSON RPC and contract management.

**Methods:**
```typescript
// Network & Account Info
getNetworkInfo(): Promise<{chainId, blockNumber, gasPrice}>
getAccountInfo(address): Promise<{balance, nonce, code}>

// Transaction & Block Info
getTransactionDetails(txHash): Promise<unknown>
getBlockInfo(blockNumber?): Promise<unknown>

// Token Operations
getTokenBalance(tokenAddress, account): Promise<string>
getTokenMetadata(tokenAddress): Promise<{name, symbol, decimals, totalSupply}>

// Contract Operations
callFunction(contractAddress, abi, functionName, params): Promise<unknown>
estimateGas(tx): Promise<string>

// Testing Utilities
impersonate(address): Promise<void>
setBalance(address, balance): Promise<void>
mineBlocks(count?): Promise<void>
increaseTime(seconds): Promise<void>
createSnapshot(): Promise<string>
revertSnapshot(snapshotId): Promise<void>
```

#### CLI Tool

Interactive CLI for testing MCP server functionality.

**Installation:**
```bash
cd /workspaces/dapptools/mcp-server
npm install
npm run build
```

**Usage:**
```bash
# Start CLI
RPC_URL=http://127.0.0.1:8545 npm start

# Available commands in CLI:
mcp> help
mcp> network
mcp> account 0x...
mcp> balance 0x...
mcp> tx 0x...
mcp> token 0x...
mcp> block
mcp> accounts
mcp> exit
```

## 🚀 Getting Started

### 1. Deploy Contracts

```bash
cd /workspaces/dapptools/examples/foundry-dstoken
forge build
forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast
```

### 2. Set Up MCP Server

```bash
cd /workspaces/dapptools/mcp-server
npm install
npm run build
RPC_URL=http://127.0.0.1:8545 npm start
```

### 3. Use Token Creator in Frontend

1. Deploy TokenFactory contract
2. Update `TokenCreator.tsx` with deployed factory address
3. Start frontend dev server:
```bash
cd /workspaces/dapptools/frontend
npm run dev
```

### 4. Wallet Connection (MetaMask)
- Install MetaMask in your browser and create/unlock a wallet.
- Ensure MetaMask is on the same network as your contracts (e.g., http://127.0.0.1:8545 or your testnet).
- When the frontend loads, click “Connect Wallet” (MetaMask will prompt for approval).
- If the network differs, switch the network in MetaMask or add the local RPC URL.

### 5. Using the Token Creator UI
1) Open the frontend at http://localhost:5173.
2) In the “Token Creator” tab, enter your deployed TokenFactory address.
3) Fill in Name, Symbol, Decimals, and Initial Supply.
4) Click “Create Token” and confirm the transaction in MetaMask.
5) After mining, the new token address appears in the recent tokens list; use it in the dashboard to view balances or transfer.

## 📝 Example Usage

### Create Token via UI
1. Open frontend at http://localhost:5173
2. Click "Create New Token" section
3. Fill in token details:
   - Name: "My Token"
   - Symbol: "MTK"
   - Decimals: 18
   - Initial Supply: 1000000
4. Click "Create Token"
5. Confirm transaction in MetaMask

### Query Token Info via MCP Server

```typescript
import { createMCPServer } from './mcp-server/src/index'

const server = createMCPServer('http://127.0.0.1:8545')

// Get token metadata
const tokenInfo = await server.getTokenMetadata('0x...')
console.log(tokenInfo)
// {
//   name: 'My Token',
//   symbol: 'MTK',
//   decimals: 18,
//   totalSupply: '1000000000000000000000000'
// }

// Get account balance
const balance = await server.getTokenBalance('0x...', '0x...')
console.log(balance)

// Get network info
const networkInfo = await server.getNetworkInfo()
console.log(networkInfo)
```

## 🔐 Security Considerations

- AdvancedToken uses safe arithmetic via DSMath to prevent overflow/underflow
- Role-based access control prevents unauthorized minting/burning/pausing
- Blacklist feature allows blocking malicious addresses
- Snapshots enable historical balance tracking for dividends/voting

## 📚 Advanced Features

### Snapshots
Track historical token balances for voting, dividends, or airdrops:

```solidity
// Create snapshot
uint256 snapshotId = token.snapshot();

// Query historical balance
uint256 historicalBalance = token.balanceOfAt(address, snapshotId);
```

### Role Management
Assign specific roles to addresses:

```solidity
// Add minter
token.addMinter(0x...);

// Check if address is minter
bool isMinter = token.isMinter(0x...);

// Remove minter
token.removeMinter(0x...);
```

### Pause/Unpause
Pause transfers in emergency situations:

```solidity
// Pause transfers
token.pause();

// Resume transfers
token.unpause();
```

## 🐛 Troubleshooting

**"Token already exists"**
- Symbol already used by another token
- Solution: Use a unique symbol

**"Only minter" error**
- Address is not a minter
- Solution: Use owner account or add as minter first

**"Token is paused" error**
- Token transfers are paused
- Solution: Wait for admin to unpause

## 📦 Dependencies

### Smart Contracts
- Solidity ^0.8.20
- Foundry (for compilation/deployment)

### Frontend
- React 18
- ethers.js 6
- TypeScript
- Vite

### MCP Server
- Node.js 18+
- TypeScript 5
- ethers.js 6
- axios

## 📄 License

All contracts and code are released under MIT license.

## 🤝 Contributing

Contributions welcome! Please ensure:
- Contracts are tested with Foundry
- Frontend components have proper error handling
- TypeScript code passes type checks
- All functions have JSDoc comments
