# 🔗 Integration Guide: Smart Contracts + Frontend

## Quick Start - Connect Frontend to Your Token

### Step 1: Deploy Your Token Contract

**Option A: Using Remix IDE** (Easiest)
1. Go to https://remix.ethereum.org
2. Create new file: `DSToken.sol`
3. Copy your Solidity code from `/workspaces/dapptools/src/dapp-tests/lib/ds-token/token.sol`
4. Compile with Solidity 0.6.7
5. Deploy to Sepolia testnet (with MetaMask)
6. Copy the deployed contract address

**Option B: Using Hardhat** (Local)
```bash
# Create Hardhat project
npx hardhat init

# Create contracts/DSToken.sol with code from:
# /workspaces/dapptools/src/dapp-tests/lib/ds-token/token.sol

# Deploy to Sepolia
ETHERSCAN_API_KEY=xxx npx hardhat run scripts/deploy.js --network sepolia

# Get contract address from deployment output
```

**Option C: Using Existing Testnet Token**
Use any existing ERC20 token on Sepolia, Goerli, or Ethereum mainnet.

### Step 2: Get Wallet Ready

1. Install MetaMask if not already installed
2. Create or import a wallet
3. Get testnet ETH for gas fees:
   - https://sepoliafaucet.com (Sepolia)
   - https://goerlifaucet.com (Goerli)
4. Switch to correct network in MetaMask

### Step 3: Start the Frontend Dev Server

```bash
cd /workspaces/dapptools/frontend
npm run dev

# Output:
#   ➜  Local:   http://localhost:5173/
```

### Step 4: Connect & Test

1. Open http://localhost:5173 in your browser
2. Click **"Connect MetaMask"**
3. Approve the connection in MetaMask popup
4. Paste your token contract address into **"Token Address"** field
5. Click **"Load Token Info"**
6. See your token details appear!
7. Try a test transfer (if you have tokens)

## Component Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Browser                           │
├──────────────────┬──────────────────┬───────────────┤
│  React/Vite      │  MetaMask        │  Ethers.js    │
│  (UI)            │  (Provider)      │  (Web3)       │
├──────────────────┴──────────────────┴───────────────┤
│           Ethereum JSON-RPC                         │
├────────────────────────────────────────────────────┤
│    Smart Contract (Token)                           │
│  - balanceOf() - transfer() - mint() - burn()      │
└────────────────────────────────────────────────────┘
```

## How It Works

### Token Loading Flow

```
User enters address
        ↓
App creates Contract instance
        ↓
ethers.js calls contract functions
        ↓
Contract returns data (symbol, balance, etc)
        ↓
UI displays information
```

### Transfer Flow

```
User enters recipient & amount
        ↓
App validates inputs
        ↓
ethers.js prepares transaction
        ↓
MetaMask shows confirmation
        ↓
User approves in MetaMask
        ↓
Transaction sent to blockchain
        ↓
Contract.transfer() executes
        ↓
UI shows success & updates balance
```

## Code Example: How to Add More Functions

Want to add a new feature? Here's how:

### Example: Add Approve Button

1. **Update Token ABI** in `TokenDashboard.tsx`:

```typescript
const TOKEN_ABI = [
  // ... existing functions ...
  'function approve(address spender, uint256 amount) public returns (bool)',
  'function allowance(address owner, address spender) public view returns (uint256)',
]
```

2. **Add State & Handler**:

```typescript
const [approveSpender, setApproveSpender] = useState<string>('')
const [approveAmount, setApproveAmount] = useState<string>('')

const approveToken = async () => {
  const signer = await provider.getSigner()
  const contract = new Contract(tokenAddress, TOKEN_ABI, signer)
  const decimals = tokenInfo?.decimals || 18
  const amount = parseUnits(approveAmount, decimals)
  
  const tx = await contract.approve(approveSpender, amount)
  await tx.wait()
  
  setApproveSpender('')
  setApproveAmount('')
}
```

3. **Add UI Form**:

```tsx
<div className="card">
  <h2>Approve Spending</h2>
  <div className="form-group">
    <label>Spender Address:</label>
    <input
      value={approveSpender}
      onChange={(e) => setApproveSpender(e.target.value)}
      placeholder="0x..."
    />
  </div>
  <div className="form-group">
    <label>Amount:</label>
    <input
      value={approveAmount}
      onChange={(e) => setApproveAmount(e.target.value)}
      placeholder="0.0"
    />
  </div>
  <button onClick={approveToken}>Approve</button>
</div>
```

## Testing Checklist

- [ ] MetaMask connects
- [ ] Token address loads token info
- [ ] Balance displays correctly
- [ ] Transfer button is enabled
- [ ] Transfer shows in MetaMask popup
- [ ] Transaction succeeds
- [ ] Balance updates after transfer
- [ ] Error messages appear for invalid addresses
- [ ] UI works on mobile

## Common Contract Functions to Add

```solidity
// ERC20 Standard
function name() public view returns (string)
function symbol() public view returns (string)  
function decimals() public view returns (uint8)
function totalSupply() public view returns (uint256)
function balanceOf(address account) public view returns (uint256)
function transfer(address to, uint256 amount) public returns (bool)
function allowance(address owner, address spender) public view returns (uint256)
function approve(address spender, uint256 amount) public returns (bool)
function transferFrom(address from, address to, uint256 amount) public returns (bool)

// Minting/Burning (if supported)
function mint(address to, uint256 amount) public
function burn(uint256 amount) public
function burnFrom(address account, uint256 amount) public

// Events
event Transfer(address indexed from, address indexed to, uint256 value)
event Approval(address indexed owner, address indexed spender, uint256 value)
```

## Debugging

### Enable Browser Console Logs

Add to `TokenDashboard.tsx`:

```typescript
const loadTokenInfo = async () => {
  try {
    setIsLoading(true)
    console.log('Loading token from:', tokenAddress)
    
    const contract = new Contract(tokenAddress, TOKEN_ABI, provider)
    console.log('Contract created:', contract)
    
    const balance = await contract.balanceOf?.(account)
    console.log('Balance raw:', balance)
    console.log('Balance formatted:', formatUnits(balance, 18))
    
    // ... rest of code
  } catch (err) {
    console.error('Full error:', err)
    console.error('Error message:', err instanceof Error ? err.message : 'Unknown')
    console.error('Error code:', (err as any).code)
  }
}
```

### Check MetaMask Connection

```typescript
// In browser console:
window.ethereum.request({ method: 'eth_chainId' })  // Get network ID
window.ethereum.request({ method: 'eth_accounts' }) // Get connected accounts
window.ethereum.request({ method: 'net_version' })  // Get network
```

### Verify Contract on Etherscan

1. Deploy contract code from `/src/dapp-tests/lib/ds-token/token.sol`
2. Go to Etherscan (Sepolia, Goerli, or Mainnet)
3. Paste contract address
4. Click "Verify and Publish Source Code"
5. Check bytecode matches

## Network Configuration

### Supported Networks

| Network | Chain ID | RPC | Faucet |
|---------|----------|-----|--------|
| Sepolia | 11155111 | https://sepolia.infura.io/v3/YOUR_KEY | https://sepoliafaucet.com |
| Goerli | 5 | https://goerli.infura.io/v3/YOUR_KEY | https://goerlifaucet.com |
| Mainnet | 1 | https://mainnet.infura.io/v3/YOUR_KEY | N/A |
| Localhost | 31337 | http://127.0.0.1:8545 | N/A |

### Add Custom RPC

1. In MetaMask, click network selector
2. "Add Network"
3. Fill in RPC details
4. Save and switch

## Performance Tips

1. **Use Contract Events** instead of polling:
```typescript
contract.on('Transfer', (from, to, value) => {
  console.log(`Transferred ${value} from ${from} to ${to}`)
  // Update UI
})
```

2. **Cache Contract Instances**:
```typescript
const contractRef = useRef(null)
if (!contractRef.current) {
  contractRef.current = new Contract(tokenAddress, TOKEN_ABI, provider)
}
```

3. **Batch Calls** with ethers Provider.call():
```typescript
const results = await provider.call({
  to: tokenAddress,
  data: iface.encodeFunctionData('balanceOf', [account])
})
```

## Security Reminders

⚠️ **DO NOT:**
- Store private keys in frontend code
- Display sensitive user data
- Trust unverified contract addresses
- Call arbitrary contract functions

✅ **DO:**
- Always verify contract addresses on Etherscan
- Test on testnet first
- Use hardware wallets for mainnet
- Validate user input
- Handle errors gracefully

## Real-World Example

To interact with a real token (e.g., USDC on Sepolia):

1. Get USDC Sepolia address: 0x6f14C02Fc1F78322cFd7d707aB90f18baD938e4d
2. Paste into Token Dashboard
3. Click "Load Token Info"
4. See: Symbol "USDC", Decimals 6, Total Supply
5. Transfer works just like your custom token!

---

**Now go build amazing Web3 apps!** 🚀
