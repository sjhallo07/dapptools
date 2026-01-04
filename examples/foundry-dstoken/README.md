# Foundry DSToken Example

This example shows a minimal ERC20-like token implemented with Foundry on Solidity **^0.8.20**. It includes unit, fuzz, and invariant tests plus a deployment script.

## Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation) installed (`forge`, `cast`, `anvil`).
- This repository cloned and the current working directory set to `examples/foundry-dstoken`.

## Quick Start

```bash
# (Optional) refresh dependencies if needed
forge install

# Build
forge build

# Run tests with traces
forge test -vv

# Gas report
forge test --gas-report
```

## Deploy

Deploy locally to Anvil using the provided script (mints 1M tokens to the broadcaster):

```bash
anvil &

forge script script/Deploy.s.sol:DeployDSToken \
	--rpc-url http://127.0.0.1:8545 \
	--private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb476cadccdddfb2deed29e8d5b417 \
	--broadcast

# Read the symbol after deployment (use the address from the broadcast output)
cast call 0x<deployed_address> "symbol()" --rpc-url http://127.0.0.1:8545
```

For testnets, replace `--rpc-url` and `--private-key` with your own values or configure them via environment variables.

## Project Structure

```
examples/foundry-dstoken/
├── src/
│   ├── DSToken.sol          # Token contract (mint/burn/transfer/approve)
│   └── DSMath.sol           # Minimal safe-math helpers
├── test/
│   └── DSToken.t.sol        # Unit, fuzz, and invariant tests
├── script/
│   └── Deploy.s.sol         # Broadcastable deployment script
├── foundry.toml             # Foundry config (solc 0.8.20)
└── README.md                # This file
```

## Features

- ✅ Solidity ^0.8.20
- ✅ Mint, burn, transfer, approve/transferFrom
- ✅ Unit + fuzz + simple invariant tests
- ✅ Gas reporting
- ✅ Deployment script with broadcast support

## Test Commands

```bash
# Run all tests
forge test

# Match a specific test
forge test --match testTransfer

# Gas reporting
forge test --gas-report

# Verbose traces
forge test -vvv
```
