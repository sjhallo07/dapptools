import React, { useEffect, useState } from 'react'
import { BrowserProvider, JsonRpcProvider, Contract, formatUnits, parseUnits } from 'ethers'
import './TokenDashboard.css'

// DSToken ABI
const TOKEN_ABI = [
    'function name() public view returns (string)',
    'function symbol() public view returns (string)',
    'function decimals() public view returns (uint8)',
    'function totalSupply() public view returns (uint256)',
    'function balanceOf(address owner) public view returns (uint256)',
    'function transfer(address to, uint256 amount) public returns (bool)',
    'function approve(address spender, uint256 amount) public returns (bool)',
    'function mint(uint256 amount) public',
    'function mint(address to, uint256 amount) public',
    'function burn(uint256 amount) public',
    'event Transfer(address indexed from, address indexed to, uint256 value)'
]

interface TokenInfo
{
    symbol: string
    decimals: number
    totalSupply: string
    balance: string
}

const TokenDashboard: React.FC = () =>
{
    const [provider, setProvider] = useState<BrowserProvider | JsonRpcProvider | null>(null)
    const [account, setAccount] = useState<string>('')
    const [tokenAddress, setTokenAddress] = useState<string>('')
    const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string>('')
    const [transferAmount, setTransferAmount] = useState<string>('')
    const [transferTo, setTransferTo] = useState<string>('')

    useEffect(() =>
    {
        let isMounted = true

        const initialize = async () =>
        {
            // Try MetaMask first
            if (window.ethereum) {
                try {
                    const provider = new BrowserProvider(window.ethereum)
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[]
                    if (isMounted) {
                        setProvider(provider)
                        setAccount(accounts[0])
                        setError('')
                        return
                    }
                } catch (err) {
                    // MetaMask connection failed, fall through to use Anvil
                }
            }

            // Use Anvil local RPC as fallback
            const rpcUrl = import.meta.env.VITE_RPC_URL || 'http://127.0.0.1:8545'
            const deployerAddr = import.meta.env.VITE_DEPLOYER_ADDRESS || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
            const provider = new JsonRpcProvider(rpcUrl)
            if (isMounted) {
                setProvider(provider)
                setAccount(deployerAddr)
                setError('')
                console.log('Connected to Anvil at', rpcUrl)
            }
        }

        initialize().catch(err =>
        {
            if (isMounted) {
                setError(`Connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
            }
        })

        // Set default token address from env
        const defaultAddr = import.meta.env.VITE_DEFAULT_TOKEN_ADDRESS
        if (defaultAddr && isMounted) {
            setTokenAddress(defaultAddr)
        }

        return () =>
        {
            isMounted = false
        }
    }, [])

    const connectWallet = async () =>
    {
        try {
            // Try MetaMask
            if (window.ethereum) {
                try {
                    const provider = new BrowserProvider(window.ethereum)
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[]
                    setProvider(provider)
                    setAccount(accounts[0])
                    setError('')
                    return
                } catch (err) {
                    setError(`MetaMask connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
                    return
                }
            }

            setError('MetaMask not installed. Using Anvil fallback.')
        } catch (err) {
            setError(`Connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
        }
    }

    const loadTokenInfo = async () =>
    {
        if (!provider || !tokenAddress) {
            setError('Please connect wallet and enter token address')
            return
        }

        try {
            setIsLoading(true)
            const contract = new Contract(tokenAddress, TOKEN_ABI, provider)

            // Load each value with fallback handling
            let symbol = 'N/A'
            let decimals = 18
            let totalSupply = '0'
            let balance = '0'

            try {
                symbol = await contract.symbol()
            } catch {
                symbol = 'N/A'
            }

            try {
                decimals = await contract.decimals()
            } catch {
                decimals = 18
            }

            try {
                totalSupply = await contract.totalSupply()
            } catch {
                totalSupply = '0'
            }

            try {
                balance = await contract.balanceOf(account)
            } catch {
                balance = '0'
            }

            setTokenInfo({
                symbol: symbol || 'N/A',
                decimals: decimals || 18,
                totalSupply: formatUnits(totalSupply || '0', decimals || 18),
                balance: formatUnits(balance || '0', decimals || 18)
            })
            setError('')
        } catch (err) {
            setError(`Failed to load token: ${err instanceof Error ? err.message : 'Unknown error'}`)
        } finally {
            setIsLoading(false)
        }
    }

    const transferToken = async () =>
    {
        if (!provider || !tokenAddress || !transferAmount || !transferTo) {
            setError('Please fill all transfer fields')
            return
        }

        try {
            setIsLoading(true)

            // For Anvil, we can only read from the contract
            // Actual transfers require a signer (which requires MetaMask or a private key)
            if (provider instanceof JsonRpcProvider) {
                setError('Transfers require MetaMask or a signed transaction. Use cast send command instead.')
                setIsLoading(false)
                return
            }

            const signer = await provider.getSigner()
            const contract = new Contract(tokenAddress, TOKEN_ABI, signer)
            const decimals = tokenInfo?.decimals || 18
            const amount = parseUnits(transferAmount, decimals)

            const tx = await contract.transfer(transferTo, amount)
            await tx.wait()

            setTransferAmount('')
            setTransferTo('')
            setError('')
            await loadTokenInfo() // Refresh balance
        } catch (err) {
            setError(`Transfer failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container">
            <h1>🪙 Token Dashboard</h1>

            {error && <div className="error">{error}</div>}

            <div className="card">
                <h2>Wallet Connection</h2>
                {account ? (
                    <p>Connected: <code>{account.slice(0, 6)}...{account.slice(-4)}</code></p>
                ) : (
                    <button onClick={connectWallet}>Connect MetaMask</button>
                )}
            </div>

            <div className="card">
                <h2>Load Token</h2>
                <div className="form-group">
                    <label>Token Address:</label>
                    <input
                        type="text"
                        placeholder="0x..."
                        value={tokenAddress}
                        onChange={(e) => setTokenAddress(e.target.value)}
                    />
                </div>
                <button onClick={loadTokenInfo} disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Load Token Info'}
                </button>
            </div>

            {tokenInfo && (
                <div className="card">
                    <h2>Token Info</h2>
                    <div className="info-grid">
                        <div>
                            <strong>Symbol:</strong> {tokenInfo.symbol}
                        </div>
                        <div>
                            <strong>Decimals:</strong> {tokenInfo.decimals}
                        </div>
                        <div>
                            <strong>Total Supply:</strong> {tokenInfo.totalSupply}
                        </div>
                        <div>
                            <strong>Your Balance:</strong> {tokenInfo.balance}
                        </div>
                    </div>
                </div>
            )}

            {tokenInfo && (
                <div className="card">
                    <h2>Transfer Tokens</h2>
                    <div className="form-group">
                        <label>Recipient Address:</label>
                        <input
                            type="text"
                            placeholder="0x..."
                            value={transferTo}
                            onChange={(e) => setTransferTo(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Amount:</label>
                        <input
                            type="number"
                            placeholder="0.0"
                            value={transferAmount}
                            onChange={(e) => setTransferAmount(e.target.value)}
                        />
                    </div>
                    <button onClick={transferToken} disabled={isLoading}>
                        {isLoading ? 'Transferring...' : 'Transfer'}
                    </button>
                </div>
            )}
        </div>
    )
}

export default TokenDashboard
