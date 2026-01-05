#!/bin/bash
# Quick start guide for DApp Tools complete stack

echo "🚀 DApp Tools Complete Environment"
echo "===================================="
echo ""

# Check installations
echo "✓ Checking environment..."
echo ""

if command -v nix &> /dev/null; then
    echo "✅ Nix: $(nix --version)"
else
    echo "❌ Nix not found - run: curl -L https://nixos.org/nix/install | sh"
fi

if command -v node &> /dev/null; then
    echo "✅ Node.js: $(node --version)"
fi

if command -v npm &> /dev/null; then
    echo "✅ npm: $(npm --version)"
fi

if command -v dapp &> /dev/null; then
    echo "✅ dapp: $(dapp --version)"
else
    echo "⚠️  dapp not in PATH - run: source /nix/profile.d/nix.sh"
fi

echo ""
echo "📁 Project Structure:"
echo "  /workspaces/dapptools/"
echo "  ├── src/dapp-tests/       Smart contracts & test suite"
echo "  ├── src/dapp/             dapp CLI tool source"
echo "  ├── src/hevm/             hevm virtual machine source"
echo "  ├── src/seth/             seth CLI tool source"
echo "  ├── frontend/             React+Ethers.js Web3 UI"
echo "  └── result/               Built binaries (dapp, hevm, seth, ethsign)"
echo ""

echo "🔧 Common Commands:"
echo ""
echo "1. Build Smart Contracts:"
echo "   cd src/dapp-tests"
echo "   dapp build"
echo "   dapp test"
echo ""

echo "2. Develop Frontend (local):"
echo "   cd frontend"
echo "   npm install             # first time"
echo "   npm run dev             # starts Vite on http://localhost:5173"
echo ""

echo "3. Run local chain (Anvil):"
echo "   anvil                   # defaults: chainId 31337, funded dev keys"
echo ""

echo "4. Local signing options:"
echo "   - .env sets VITE_USE_ANVIL_SIGNER=true to auto-sign with the Anvil dev key"
echo "   - Set VITE_USE_ANVIL_SIGNER=false to require MetaMask signatures"
echo ""

echo "5. Build Frontend:"
echo "   cd frontend"
echo "   npm run build           # creates optimized dist/"
echo ""

echo "6. Rebuild Everything:"
echo "   nix build               # rebuilds all dapp tools"
echo ""

echo "7. Run Tests:"
echo "   cd src/dapp-tests"
echo "   dapp test               # hevm-based test suite"
echo ""

echo "📡 Running Services:"
echo ""
echo "Development Servers:"
echo "  Frontend (Vite):  http://localhost:5173   (npm run dev)"
echo "  Anvil RPC:        http://127.0.0.1:8545   (anvil)"
echo ""

echo "🌐 Smart Contract Interaction (local):"
echo ""
echo "1. Start anvil in a separate terminal."
echo "2. (Optional) Use prefilled .env addresses or deploy via Token Creator." 
echo "3. Open http://localhost:5173 (frontend)."
echo "4. If VITE_USE_ANVIL_SIGNER=true (default), actions auto-sign with Anvil dev key."
echo "   If false, click 'Connect MetaMask' and approve signatures."
echo "5. Token Dashboard: load token address, transfer/mint/burn."
echo "6. Counter Dashboard: interact with the default Counter deployment."
echo ""

echo "📚 Documentation:"
echo "  README.md              - Root project documentation"
echo "  ARCHITECTURE.md        - System architecture"
echo "  src/dapp/README.md     - dapp tool documentation"
echo "  src/hevm/README.md     - hevm documentation"
echo "  src/seth/README.md     - seth tool documentation"
echo "  frontend/README.md     - Frontend development guide"
echo "  FRONTEND_BUILD.md      - Frontend build summary"
echo ""

echo "🎯 Next Steps:"
echo "  [ ] Start dev server: cd frontend && npm run dev"
echo "  [ ] Deploy test token to Sepolia testnet"
echo "  [ ] Connect MetaMask wallet"
echo "  [ ] Test token transfer in UI"
echo ""

echo "✨ Complete! Your DApp environment is ready!"
