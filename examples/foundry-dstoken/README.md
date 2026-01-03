# Foundry DSToken Example

This is a complete example Foundry project demonstrating how to build, test, and deploy the DSToken contract.

## Quick Start

```bash
# Install dependencies
forge install

# Build contracts
forge build

# Run tests
forge test -vv

# Test with gas report
forge test --gas-report

# Deploy to Anvil
anvil &
forge create src/DSToken.sol:DSToken --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb476cadccdddfb2deed29e8d5b417

# Interact with contract
cast call 0x<deployed_address> "symbol()" --rpc-url http://localhost:8545
```

## Project Structure

```
.
├── src/
│   ├── DSToken.sol          # Token contract
│   └── DSMath.sol           # Safe math library
├── test/
│   └── DSToken.t.sol        # Test suite
├── script/
│   └── Deploy.s.sol         # Deployment script
├── foundry.toml             # Configuration
└── README.md               # This file
```

## Features

- ✅ Solidity 0.6.7+
- ✅ Comprehensive test coverage
- ✅ Gas reports
- ✅ Deployment scripts
- ✅ Formal verification ready

## Tests

```bash
# Run all tests
forge test

# Run specific test
forge test --match testTransfer

# Run with gas reporting
forge test --gas-report

# Run with verbose output
forge test -vv

# Run with trace
forge test -vvv
```
