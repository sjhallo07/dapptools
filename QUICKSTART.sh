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

echo "2. Develop Frontend:"
echo "   cd frontend"
echo "   npm install    # (already done)"
echo "   npm run dev    # Start dev server on localhost:5173"
echo ""

echo "3. Build Frontend:"
echo "   cd frontend"
echo "   npm run build  # Creates optimized dist/"
echo ""

echo "4. Rebuild Everything:"
echo "   nix build      # Rebuilds all dapp tools"
echo ""

echo "5. Run Tests:"
echo "   cd src/dapp-tests"
echo "   dapp test      # Runs test suite with hevm"
echo ""

echo "📡 Running Services:"
echo ""
echo "Development Servers:"
echo "  Frontend (Vite):  http://localhost:5173   (npm run dev)"
echo "  Token UI:         http://localhost:8000   (python -m http.server 8000)"
echo ""

echo "🌐 Smart Contract Interaction:"
echo ""
echo "1. Deploy token contract"
echo "2. Copy contract address"
echo "3. Open http://localhost:5173"
echo "4. Click 'Connect MetaMask'"
echo "5. Paste contract address in Token Dashboard"
echo "6. Click 'Load Token Info'"
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
