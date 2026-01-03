import React, { useState } from 'react'
import { BrowserProvider, Contract, parseUnits } from 'ethers'
import './TokenCreator.css'

// TokenFactory ABI
const FACTORY_ABI = [
    'function createToken(string _name, string _symbol, uint8 _decimals, uint256 _initialSupply) public returns (address)',
    'function getTokenCount() public view returns (uint256)',
    'function getAllTokens() public view returns (address[])',
    'function getTokenBySymbol(string _symbol) public view returns (address)',
    'event TokenCreated(address indexed tokenAddress, string name, string symbol, address indexed creator, uint256 timestamp)'
]

interface TokenCreationForm
{
    name: string
    symbol: string
    decimals: number
    initialSupply: string
}

const TokenCreator: React.FC<{ factoryAddress: string }> = ({ factoryAddress }) =>
{
    const [form, setForm] = useState<TokenCreationForm>({
        name: '',
        symbol: '',
        decimals: 18,
        initialSupply: ''
    })

    const [createdTokens, setCreatedTokens] = useState<
        Array<{ address: string; name: string; symbol: string; timestamp: number }>
    >([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<string>('')

    const createToken = async () =>
    {
        if (!form.name || !form.symbol || !form.initialSupply) {
            setError('Please fill all required fields')
            return
        }

        try {
            setIsLoading(true)
            setError('')
            setSuccess('')

            // Get provider and signer
            if (!window.ethereum) {
                throw new Error('MetaMask not found')
            }

            const provider = new BrowserProvider(window.ethereum)
            const signer = await provider.getSigner()
            const factory = new Contract(factoryAddress, FACTORY_ABI, signer)

            // Parse initial supply
            const initialSupply = parseUnits(form.initialSupply, form.decimals)

            // Call createToken
            const tx = await factory.createToken(
                form.name,
                form.symbol,
                form.decimals,
                initialSupply
            )

            const receipt = await tx.wait()

            // Parse event
            const events = receipt?.logs || []
            if (events.length > 0) {
                const iface = factory.interface
                const eventLog = iface.parseLog(events[events.length - 1])
                if (eventLog?.name === 'TokenCreated') {
                    const tokenAddress = eventLog.args[0]
                    setSuccess(`✅ Token created successfully at ${tokenAddress}`)

                    // Add to created tokens list
                    setCreatedTokens([
                        ...createdTokens,
                        {
                            address: tokenAddress as string,
                            name: form.name,
                            symbol: form.symbol,
                            timestamp: Date.now()
                        }
                    ])

                    // Reset form
                    setForm({
                        name: '',
                        symbol: '',
                        decimals: 18,
                        initialSupply: ''
                    })
                }
            }
        } catch (err) {
            setError(`Failed to create token: ${err instanceof Error ? err.message : 'Unknown error'}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="token-creator">
            <h2>🪙 Create New Token</h2>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="form-section">
                <div className="form-group">
                    <label>Token Name *</label>
                    <input
                        type="text"
                        placeholder="e.g., MyToken"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        disabled={isLoading}
                    />
                </div>

                <div className="form-group">
                    <label>Token Symbol *</label>
                    <input
                        type="text"
                        placeholder="e.g., MTK"
                        value={form.symbol}
                        onChange={(e) => setForm({ ...form, symbol: e.target.value.toUpperCase() })}
                        disabled={isLoading}
                        maxLength={10}
                    />
                </div>

                <div className="form-group">
                    <label>Decimals</label>
                    <input
                        type="number"
                        min="0"
                        max="18"
                        value={form.decimals}
                        onChange={(e) => setForm({ ...form, decimals: parseInt(e.target.value) })}
                        disabled={isLoading}
                    />
                </div>

                <div className="form-group">
                    <label>Initial Supply *</label>
                    <input
                        type="text"
                        placeholder="e.g., 1000000"
                        value={form.initialSupply}
                        onChange={(e) => setForm({ ...form, initialSupply: e.target.value })}
                        disabled={isLoading}
                    />
                </div>

                <button onClick={createToken} disabled={isLoading} className="create-btn">
                    {isLoading ? 'Creating...' : 'Create Token'}
                </button>
            </div>

            {createdTokens.length > 0 && (
                <div className="created-tokens">
                    <h3>Recently Created Tokens</h3>
                    <div className="token-list">
                        {createdTokens.map((token, index) => (
                            <div key={index} className="token-item">
                                <div>
                                    <strong>{token.name}</strong> ({token.symbol})
                                </div>
                                <code>{token.address}</code>
                                <small>{new Date(token.timestamp).toLocaleString()}</small>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default TokenCreator
