# Token Dashboard - DApp Frontend

A modern React + TypeScript + Ethers.js Web3 frontend for interacting with ERC20-like token contracts (DSToken).

## Features

- 🔌 **MetaMask Integration**: Connect your Ethereum wallet
- 📊 **Token Info Display**: View symbol, decimals, total supply
- 💰 **Balance Tracking**: Check your token balance in real-time
- ✨ **Token Transfer**: Send tokens to other addresses
- 🎨 **Modern UI**: Beautiful responsive design with Vite + React 18

## Tech Stack

- **React 18.2.0**: UI framework
- **TypeScript**: Type safety
- **Ethers.js v6**: Blockchain interaction
- **Vite 5.0.0**: Lightning-fast build tool
- **CSS3**: Modern styling with gradients and animations

## Setup

### Prerequisites

- Node.js v16+ installed
- MetaMask browser extension
- Ethereum testnet wallet (Sepolia, Goerli, etc.)

### Installation

```bash
cd frontend
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview  # Preview production build locally
```

## Usage

1. **Connect Wallet**
   - Click "Connect MetaMask"
   - Approve the connection in MetaMask

2. **Load Token**
   - Enter the token contract address
   - Click "Load Token Info"
   - View token details (symbol, decimals, supply, balance)

3. **Transfer Tokens**
   - Enter recipient address
   - Enter amount to transfer
   - Click "Transfer"
   - Approve the transaction in MetaMask

## Supported Token Functions

- `balanceOf(address)` - Get token balance
- `symbol()` - Get token symbol
- `decimals()` - Get token decimals
- `totalSupply()` - Get total supply
- `transfer(address, uint256)` - Transfer tokens
- `approve(address, uint256)` - Approve spending
- `mint(uint256)` or `mint(address, uint256)` - Mint tokens
- `burn(uint256)` - Burn tokens

## Project Structure

```
frontend/
├── src/
│   ├── App.tsx              # Main app component
│   ├── App.css              # App styles
│   ├── TokenDashboard.tsx   # Token dashboard component
│   ├── TokenDashboard.css   # Dashboard styles
│   ├── main.tsx             # React entry point
│   └── vite-env.d.ts        # Vite + window.ethereum types
├── index.html               # HTML template
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript config
├── tsconfig.node.json      # Vite TypeScript config
├── package.json            # Dependencies
└── .env                    # Environment variables (optional)
```

## Environment Variables

Create a `.env` file (already present in this repo with local defaults):

```env
# Local Anvil defaults (chainId 31337)
VITE_DEFAULT_TOKEN_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
VITE_FACTORY_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
VITE_NETWORK_ID=31337
VITE_DEPLOYER_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
VITE_RPC_URL=http://127.0.0.1:8545
```

If you target a public testnet (e.g., Sepolia), switch `VITE_NETWORK_ID`, `VITE_RPC_URL`, and the addresses accordingly.

### Local Anvil (Foundry 1.5.1) Snapshot

```
Foundry 1.5.1-stable (b0a9dd9ced)
Chain ID: 31337
Base Fee: 1 gwei
Gas Limit: 30,000,000
Genesis Timestamp: 1767409580
Genesis Number: 0
```

#### Accounts (10,000 ETH each)

```
(0) 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (Deployer)
(1) 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
(2) 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
(3) 0x90F79bf6EB2c4f870365E785982E1f101E93b906
(4) 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65
(5) 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc
(6) 0x976EA74026E726554dB657fA54763abd0C3a0aa9
(7) 0x14dC79964da2C08b23698B3D3cc7Ca32193d9955
(8) 0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f
(9) 0xa0Ee7A142d267C1f36714E4a8F75612F20a79720
```

#### Private Keys (local use only)

⚠️ **Security warning:** The following private keys and mnemonic are well-known public test credentials (Hardhat/Anvil). They must **never** be used with real funds or on public networks. They are for **local development and testing only**.
```
(0) 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
(1) 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
(2) 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
(3) 0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6
(4) 0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a
(5) 0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba
(6) 0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e
(7) 0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356
(8) 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97
(9) 0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6
```

Mnemonic (local only): `test test test test test test test test test test test junk`
Derivation path: `m/44'/60'/0'/0/`

> 🔗 **Contract Addresses (Anvil 31337)**
>
>   DSToken (ERC20 Token)
>   └─ 0x5FbDB2315678afecb367f032d93F642f64180aa3

## Testing with Local Blockchain

To test with a local Ethereum instance:

1. Install Hardhat or Ganache
2. Deploy the DSToken contract
3. Copy the contract address
4. Enter it in the Token Dashboard

### Example: Deploy with Hardhat

```bash
# From dapp-tests directory
npx hardhat node  # Runs local blockchain on 8545

# In another terminal, deploy token
npx hardhat run scripts/deploy.js --network localhost
```

## Troubleshooting

### MetaMask Connection Issues
- Ensure MetaMask is installed and unlocked
- Check that you're on the correct network
- Try refreshing the page

### Token Loading Fails
- Verify the token address is correct
- Ensure the token contract implements required functions
- Check network connection and RPC endpoint

### Transaction Rejected
- Ensure you have enough gas
- Check wallet has sufficient token balance for transfers
- Verify the recipient address is valid (not a contract that can't receive)

## Security Considerations

⚠️ **This is a demonstration DApp. Use with caution on mainnet.**

- Never share your private keys
- Always verify contract addresses
- Test thoroughly on testnet first
- Use hardware wallets for production

## Learn More

- [Ethers.js Documentation](https://docs.ethers.org/v6/)
- [Vite Documentation](https://vitejs.dev/)
- [Ethereum Smart Contracts](https://ethereum.org/en/developers/docs/smart-contracts/)
- [MetaMask API](https://docs.metamask.io/guide/signing-data.html)

## License

MIT - See LICENSE file in root directory
