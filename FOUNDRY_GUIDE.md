# Foundry Integration Guide

**Foundry v1.5.1-stable** has been installed! This is a modern Ethereum development toolkit alongside your existing dapp/hevm tools.

## 🎯 What is Foundry?

Foundry is a portable and modular toolkit for Ethereum application development, written in Rust. It provides:

- **forge** - Solidity testing and development framework
- **cast** - CLI tool for interacting with smart contracts and blockchains
- **anvil** - Local Ethereum node for testing
- **chisel** - Solidity REPL for interactive development

## ✅ Installation Status

All Foundry tools are installed and verified:

```
✓ forge 1.5.1-stable - Ethereum testing & development framework
✓ cast  1.5.1-stable - Blockchain interaction CLI
✓ anvil 1.5.1-stable - Local Ethereum node
✓ chisel 1.5.1-stable - Solidity interactive shell
```

Installation location: `~/.foundry/bin/`

## 🚀 Quick Start

### Create a New Foundry Project

```bash
forge init my-project
cd my-project
```

### Compile Smart Contracts

```bash
forge build
```

### Run Tests

```bash
forge test
```

### Start a Local Blockchain (Anvil)

```bash
anvil
# Runs on http://127.0.0.1:8545
```

### Interact with Smart Contracts (Cast)

```bash
# Call a contract function
cast call 0x... "function()"

# Send a transaction
cast send 0x... "function()"

# Get account balance
cast balance 0x...
```

### Interactive Solidity REPL (Chisel)

```bash
chisel
> uint x = 5;
> x + 3
> 8
```

## 📚 Common Commands

### Forge

```bash
forge init              # Create new Foundry project
forge build             # Compile Solidity contracts
forge test              # Run test suite
forge test -vv          # Verbose output
forge test --match <pattern>  # Run specific tests
forge fmt               # Format Solidity code
forge create            # Deploy contract
forge verify-contract   # Verify on Etherscan
forge script            # Run deployment scripts
```

### Cast

```bash
cast call <addr> "<sig>" [args]          # Call function (read-only)
cast send <addr> "<sig>" [args]          # Send transaction
cast balance <addr>                       # Get ETH balance
cast code <addr>                          # Get contract bytecode
cast storage <addr> <slot>                # Read storage slot
cast estimate <addr> "<sig>" [args]       # Estimate gas
cast decode-calldata <calldata>           # Decode calldata
```

### Anvil

```bash
anvil                           # Start local blockchain (default: 8545)
anvil --port 8000              # Custom port
anvil --fork-url <rpc>          # Fork mainnet
anvil --accounts 20             # Create 20 test accounts
anvil --block-time 10           # Auto-mine blocks every 10s
```

### Chisel

```bash
chisel              # Start interactive REPL
> help              # Show help
> !clear            # Clear session
> !save session.sol # Save code to file
> !load file.sol    # Load from file
```

## 🔧 Integration with dapptools

Your environment now has both toolkits:

| Tool | Framework | Purpose |
|------|-----------|---------|
| **dapp** | dapptools (Haskell) | Test suite, build system |
| **hevm** | dapptools (Haskell) | EVM execution, debugging |
| **seth** | dapptools (Shell) | CLI blockchain interaction |
| **forge** | Foundry (Rust) | Modern Solidity testing |
| **anvil** | Foundry (Rust) | Local blockchain node |
| **cast** | Foundry (Rust) | Blockchain CLI tool |

### When to Use Each

- Use **dapp/hevm** for: Legacy projects, advanced debugging, custom test flows
- Use **forge** for: Modern Solidity, quick testing, standard workflows
- Use **anvil** for: Local development blockchain, fork testing
- Use **cast** for: Quick blockchain interactions, contract queries

## 📖 Documentation

- **Official Book**: https://book.getfoundry.sh/
- **GitHub**: https://github.com/foundry-rs/foundry
- **Chat Support**: https://t.me/foundry_rs/

## 🎓 Example: Test DSToken with Forge

Here's how to test your DSToken using Foundry:

```solidity
// test/DSToken.t.sol
pragma solidity ^0.6.7;

import "forge-std/Test.sol";
import "../src/DSToken.sol";

contract DSTokenTest is Test {
    DSToken token;

    function setUp() public {
        token = new DSToken("TEST");
    }

    function testTransfer() public {
        token.mint(address(this), 100);
        
        address recipient = address(0x123);
        token.transfer(recipient, 50);
        
        assertEq(token.balanceOf(recipient), 50);
        assertEq(token.balanceOf(address(this)), 50);
    }

    function testMintAndBurn() public {
        token.mint(address(this), 1000);
        assertEq(token.totalSupply(), 1000);
        
        token.burn(500);
        assertEq(token.totalSupply(), 500);
    }
}
```

Run with:
```bash
forge test
```

## 🔐 Advanced Features

### Fuzz Testing

```solidity
function testFuzzTransfer(uint256 amount) public {
    vm.assume(amount > 0 && amount < 10000000 ether);
    token.mint(address(this), amount);
    token.transfer(address(0x123), amount / 2);
    // assertions...
}
```

### Invariant Testing

```solidity
function invariant_BalanceAlwaysPositive() public {
    assertGe(token.balanceOf(address(this)), 0);
}
```

### Symbolic Execution with Chisel

```solidity
chisel> uint x = 5
chisel> uint y = 10
chisel> x + y
15
chisel> uint[] memory arr = new uint[](3)
chisel> arr[0] = 100
chisel> arr[0]
100
```

## 🌐 Testing on Testnets

### Deploy with Forge

```bash
forge create src/MyContract.sol \
  --rpc-url https://sepolia.infura.io/v3/YOUR_KEY \
  --private-key 0xYOUR_KEY \
  --etherscan-api-key YOUR_ETHERSCAN_KEY \
  --verify
```

### Use Cast to Interact

```bash
cast call 0xContractAddress "balanceOf(address)" 0xYourAddress \
  --rpc-url https://sepolia.infura.io/v3/YOUR_KEY
```

## 💾 Configuration

Create `foundry.toml` in your project root:

```toml
[profile.default]
src = 'src'
out = 'out'
libs = ['lib']
test = 'test'
solc_version = '0.8.21'

[rpc_endpoints]
sepolia = "https://sepolia.infura.io/v3/${INFURA_KEY}"
mainnet = "https://mainnet.infura.io/v3/${INFURA_KEY}"

[etherscan]
sepolia = { key = "${ETHERSCAN_KEY}" }
mainnet = { key = "${ETHERSCAN_KEY}" }
```

## 🔄 Next Steps

1. **Create a Foundry Project**: `forge init my-dapp`
2. **Migrate DSToken**: Copy your token to Foundry project
3. **Write Tests**: Use forge test framework
4. **Deploy Locally**: Test with anvil before mainnet
5. **Verify on Chain**: Use forge verify-contract

## 📞 Troubleshooting

### Command Not Found
```bash
source ~/.bashrc
# or add to your shell config permanently
export PATH="$PATH:$HOME/.foundry/bin"
```

### Version Conflicts
```bash
foundryup --help  # See update options
foundryup -v      # Current version info
```

### Anvil Port Already in Use
```bash
anvil --port 8001  # Use different port
```

---

**Happy testing with Foundry! 🚀**
