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

Create a `.env` file if needed:

```env
VITE_DEFAULT_TOKEN_ADDRESS=0x...    # Optional: pre-fill token address
VITE_NETWORK_ID=11155111            # Sepolia testnet
```

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
