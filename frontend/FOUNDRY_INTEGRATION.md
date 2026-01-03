# 🔗 Foundry + React Frontend Integration Guide

Complete guide to building smart contracts with Foundry and interacting with them via your React frontend.

---

## 📋 Development Workflow

```
┌─────────────────────────────────────────────────┐
│         1. Build Smart Contracts                │
│              (Foundry forge)                    │
├─────────────────────────────────────────────────┤
│         2. Test & Deploy                        │
│     (forge test, forge create, anvil)          │
├─────────────────────────────────────────────────┤
│         3. Generate ABIs                        │
│   (Extract from forge build artifacts)         │
├─────────────────────────────────────────────────┤
│    4. Connect Frontend to Contract              │
│    (Update contract address in React)           │
├─────────────────────────────────────────────────┤
│       5. Test in Browser                        │
│    (Connect MetaMask, run transactions)        │
└─────────────────────────────────────────────────┘
```

---

## 🛠️ Step 1: Create Foundry Project

### Initialize Project
```bash
# Create new Foundry project
forge init my-token-contracts
cd my-token-contracts
```

### Project Structure
```
my-token-contracts/
├── src/
│   ├── MyToken.sol         # Your token contract
│   └── MyMath.sol          # Helper library
├── test/
│   └── MyToken.t.sol       # Test suite
├── script/
│   └── Deploy.s.sol        # Deployment script
├── foundry.toml            # Configuration
└── lib/
    └── forge-std/          # Standard library
```

---

## 💻 Step 2: Write Smart Contract

### Example: Create an ERC20 Token

**src/MyToken.sol:**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MyToken {
    string public name = "My Token";
    string public symbol = "MTK";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    function transfer(address to, uint256 amount) public returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function mint(address to, uint256 amount) public {
        balanceOf[to] += amount;
        totalSupply += amount;
        emit Transfer(address(0), to, amount);
    }
}
```

---

## 🧪 Step 3: Write Tests

**test/MyToken.t.sol:**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MyToken.sol";

contract MyTokenTest is Test {
    MyToken token;
    address alice = address(0x1);
    address bob = address(0x2);

    function setUp() public {
        token = new MyToken();
    }

    function testMint() public {
        token.mint(alice, 1000e18);
        assertEq(token.balanceOf(alice), 1000e18);
    }

    function testTransfer() public {
        token.mint(alice, 1000e18);
        
        vm.prank(alice);
        token.transfer(bob, 500e18);
        
        assertEq(token.balanceOf(alice), 500e18);
        assertEq(token.balanceOf(bob), 500e18);
    }

    function testApprove() public {
        token.approve(bob, 1000e18);
        assertEq(token.allowance(msg.sender, bob), 1000e18);
    }
}
```

### Run Tests
```bash
forge build                    # Compile
forge test                     # Run tests
forge test -vv                 # Verbose output
forge test --gas-report        # Gas report
```

---

## 🚀 Step 4: Deploy Contract

### Option A: Deploy to Local Anvil

**script/Deploy.s.sol:**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MyToken.sol";

contract DeployMyToken is Script {
    function run() external {
        vm.startBroadcast();
        
        MyToken token = new MyToken();
        token.mint(msg.sender, 1000000e18);
        
        console.log("Deployed MyToken at:", address(token));
        
        vm.stopBroadcast();
    }
}
```

### Deploy to Local Node
```bash
# Terminal 1: Start Anvil
anvil

# Terminal 2: Deploy
forge script script/Deploy.s.sol:DeployMyToken --rpc-url http://localhost:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb476cadccdddfb2deed29e8d5b417
```

### Deploy to Testnet
```bash
forge script script/Deploy.s.sol:DeployMyToken \
  --rpc-url https://sepolia.infura.io/v3/YOUR_INFURA_KEY \
  --private-key YOUR_PRIVATE_KEY \
  --broadcast
```

---

## 📄 Step 5: Extract ABI

### Get ABI from Build Output

After running `forge build`, check:
```bash
cat out/MyToken.sol/MyToken.json | jq '.abi'
```

### Create TypeScript Types (Optional)

```bash
npm install --save-dev typechain @typechain/ethers-v6

npx typechain --target ethers-v6 out/MyToken.sol/MyToken.json --out-dir frontend/src/types
```

---

## ⚛️ Step 6: Update React Frontend

### Update TokenDashboard.tsx

```typescript
import { BrowserProvider, Contract } from 'ethers'

// Add your contract ABI
const MY_TOKEN_ABI = [
  'function name() public view returns (string)',
  'function symbol() public view returns (string)',
  'function decimals() public view returns (uint8)',
  'function totalSupply() public view returns (uint256)',
  'function balanceOf(address owner) public view returns (uint256)',
  'function transfer(address to, uint256 amount) public returns (bool)',
  'function approve(address spender, uint256 amount) public returns (bool)',
  'function mint(address to, uint256 amount) public',
  'event Transfer(address indexed from, address indexed to, uint256 value)'
]

// Use it in your component
const contract = new Contract(contractAddress, MY_TOKEN_ABI, signer)
const balance = await contract.balanceOf(account)
```

### Full Example

```typescript
import React, { useState } from 'react'
import { BrowserProvider, Contract, formatUnits, parseUnits } from 'ethers'

const TokenDashboard: React.FC = () => {
  const [account, setAccount] = useState('')
  const [balance, setBalance] = useState('0')
  const [contractAddress, setContractAddress] = useState('')

  const MY_TOKEN_ABI = [
    'function name() public view returns (string)',
    'function symbol() public view returns (string)',
    'function balanceOf(address) public view returns (uint256)',
    'function transfer(address to, uint256 amount) public returns (bool)',
  ]

  const connectWallet = async () => {
    const provider = new BrowserProvider(window.ethereum)
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    })
    setAccount(accounts[0])
  }

  const loadBalance = async () => {
    const provider = new BrowserProvider(window.ethereum)
    const contract = new Contract(contractAddress, MY_TOKEN_ABI, provider)
    const bal = await contract.balanceOf(account)
    setBalance(formatUnits(bal, 18))
  }

  const transfer = async (to: string, amount: string) => {
    const provider = new BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new Contract(contractAddress, MY_TOKEN_ABI, signer)
    
    const tx = await contract.transfer(to, parseUnits(amount, 18))
    const receipt = await tx.wait()
    
    console.log('Transaction:', receipt.hash)
    await loadBalance()
  }

  return (
    <div>
      <button onClick={connectWallet}>Connect MetaMask</button>
      <p>Account: {account}</p>
      
      <input 
        placeholder="Contract address"
        value={contractAddress}
        onChange={(e) => setContractAddress(e.target.value)}
      />
      <button onClick={loadBalance}>Load Balance</button>
      <p>Balance: {balance} tokens</p>
    </div>
  )
}

export default TokenDashboard
```

---

## 🔌 Step 7: Test Frontend Integration

### 1. Start Everything

**Terminal 1: Local Blockchain**
```bash
anvil
# Runs on http://127.0.0.1:8545
# Pre-funded accounts with 10,000 ETH each
```

**Terminal 2: Deploy Contract**
```bash
cd my-token-contracts
forge script script/Deploy.s.sol:DeployMyToken \
  --rpc-url http://localhost:8545 \
  --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb476cadccdddfb2deed29e8d5b417
```

**Terminal 3: React Frontend**
```bash
cd /workspaces/dapptools/frontend
npm run dev
# Runs on http://localhost:5173
```

### 2. Test in Browser

1. Open http://localhost:5173
2. Click "Connect MetaMask"
3. Add network to MetaMask:
   - Network: Localhost
   - RPC: http://127.0.0.1:8545
   - Chain ID: 31337
4. Paste contract address from deployment output
5. Click "Load Token Info"
6. Test transfers with 1000 ETH pre-funded accounts

---

## 📊 Common Patterns

### Pattern: Check Balance

```typescript
const balance = await contract.balanceOf(address)
const formatted = formatUnits(balance, decimals)
```

### Pattern: Send Transaction

```typescript
const tx = await contract.transfer(recipient, amount)
const receipt = await tx.wait()
console.log('Confirmed:', receipt.blockNumber)
```

### Pattern: Listen to Events

```typescript
contract.on('Transfer', (from, to, value) => {
  console.log(`Transferred ${value} from ${from} to ${to}`)
})
```

### Pattern: Estimate Gas

```typescript
const gas = await contract.transfer.estimateGas(to, amount)
console.log('Gas needed:', gas.toString())
```

---

## 🔐 Security Checklist

Before deploying to mainnet:

- [ ] Contract code reviewed
- [ ] Full test coverage (forge test)
- [ ] Gas optimization checked (forge build --via-ir)
- [ ] No hardcoded secrets in code
- [ ] Private key in .env, not repo
- [ ] Tested on testnet first
- [ ] Reentrancy guards if needed
- [ ] Events emitted for state changes
- [ ] Input validation on all functions
- [ ] Verified on Etherscan

---

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] Tests passing: `forge test`
- [ ] Contract compiles: `forge build`
- [ ] ABI extracted
- [ ] Deployment script ready
- [ ] Private key in .env
- [ ] RPC endpoint available

### Deploy to Testnet
```bash
# Set environment
export PRIVATE_KEY=0x...
export INFURA_KEY=...

# Deploy
forge script script/Deploy.s.sol:DeployMyToken \
  --rpc-url https://sepolia.infura.io/v3/$INFURA_KEY \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_KEY
```

### Verify on Etherscan
```bash
forge verify-contract \
  --compiler-version 0.8.20 \
  --etherscan-api-key $ETHERSCAN_KEY \
  0xContractAddress \
  src/MyToken.sol:MyToken
```

---

## 📚 References

- **Foundry Book**: https://book.getfoundry.sh/
- **Ethers.js Docs**: https://docs.ethers.org/
- **OpenZeppelin Contracts**: https://docs.openzeppelin.com/contracts/
- **Solidity Docs**: https://docs.soliditylang.org/

---

## 🎯 Next Steps

1. ✅ Create Foundry project: `forge init my-project`
2. ✅ Write test contracts
3. ✅ Run tests locally: `forge test`
4. ✅ Deploy to Anvil: `forge script ... --broadcast`
5. ✅ Update React frontend with contract address
6. ✅ Test in browser with MetaMask
7. ✅ Deploy to testnet
8. ✅ Verify on Etherscan
9. ✅ Deploy to mainnet (after thorough testing!)

---

**Happy building with Foundry! 🚀**
