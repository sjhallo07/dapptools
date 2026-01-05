import React, { useEffect, useState } from 'react'
import { BrowserProvider, JsonRpcProvider, Contract, Wallet } from 'ethers'
import './CounterDashboard.css'

const COUNTER_ABI = [
    'function number() view returns (uint256)',
    'function setNumber(uint256 newNumber)',
    'function increment()'
]

const CounterDashboard: React.FC = () =>
{
    const [provider, setProvider] = useState<BrowserProvider | JsonRpcProvider | null>(null)
    const [account, setAccount] = useState<string>('')
    const [counterAddress, setCounterAddress] = useState<string>('')
    const [current, setCurrent] = useState<string>('0')
    const [newValue, setNewValue] = useState<string>('')
    const [status, setStatus] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() =>
    {
        let mounted = true

        const init = async () =>
        {
            const envAddr = import.meta.env.VITE_COUNTER_ADDRESS
            if (envAddr && mounted) setCounterAddress(envAddr)

            if (window.ethereum) {
                try {
                    const browserProvider = new BrowserProvider(window.ethereum)
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[]
                    if (mounted) {
                        setProvider(browserProvider)
                        setAccount(accounts[0])
                        setStatus('Connected with MetaMask')
                    }
                    return
                } catch (err) {
                    if (mounted) {
                        setStatus(`MetaMask connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
                    }
                    return
                }
            }

            // Fallback to Anvil RPC
            const rpcUrl = import.meta.env.VITE_RPC_URL || 'http://127.0.0.1:8545'
            const deployer = import.meta.env.VITE_DEPLOYER_ADDRESS || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
            const fallbackProvider = new JsonRpcProvider(rpcUrl)
            if (mounted) {
                setProvider(fallbackProvider)
                setAccount(deployer)
                setStatus(`Connected to RPC ${rpcUrl} as ${deployer}`)
            }
        }

        init()

        return () => { mounted = false }
    }, [])

    const loadValue = async () =>
    {
        if (!provider || !counterAddress) {
            setStatus('Enter counter address and ensure provider is ready.')
            return
        }
        try {
            setIsLoading(true)
            const contract = new Contract(counterAddress, COUNTER_ABI, provider)
            const val = await contract.number()
            setCurrent(val.toString())
            setStatus('Value loaded')
        } catch (err) {
            setStatus(`Read failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
        } finally {
            setIsLoading(false)
        }
    }

    const writeWithSigner = async (fn: (contract: Contract) => Promise<unknown>) =>
    {
        if (!provider || !counterAddress) {
            setStatus('Enter counter address and connect a signer (MetaMask or Anvil key).')
            return
        }

        const useAnvilSigner = (import.meta.env.VITE_USE_ANVIL_SIGNER || 'false').toLowerCase() === 'true'
        const rpcUrl = import.meta.env.VITE_RPC_URL || 'http://127.0.0.1:8545'
        const anvilPrivateKey = import.meta.env.VITE_ANVIL_PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

        try {
            setIsLoading(true)

            let signerContract: Contract

            if (provider instanceof BrowserProvider) {
                const signer = await provider.getSigner()
                signerContract = new Contract(counterAddress, COUNTER_ABI, signer)
            } else {
                if (!useAnvilSigner) {
                    setStatus('Writes require MetaMask, or enable VITE_USE_ANVIL_SIGNER for local key signing.')
                    return
                }

                if (!anvilPrivateKey) {
                    setStatus('Missing VITE_ANVIL_PRIVATE_KEY for local signing.')
                    return
                }

                const localProvider = provider instanceof JsonRpcProvider ? provider : new JsonRpcProvider(rpcUrl)
                const wallet = new Wallet(anvilPrivateKey, localProvider)
                signerContract = new Contract(counterAddress, COUNTER_ABI, wallet)
            }

            const tx = await fn(signerContract)
            if (tx && typeof (tx as any).wait === 'function') {
                await (tx as any).wait()
            }
            setStatus('Transaction confirmed')
            await loadValue()
        } catch (err) {
            setStatus(`Tx failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSet = async () =>
    {
        if (!newValue) {
            setStatus('Enter a value to set')
            return
        }
        let parsedValue: bigint
        try {
            parsedValue = BigInt(newValue)
        } catch (err) {
            setStatus('Invalid number: please enter a whole integer value.')
            return
        }
        await writeWithSigner((c) => c.setNumber(parsedValue))
    }

    const handleIncrement = async () =>
    {
        await writeWithSigner((c) => c.increment())
    }

    return (
        <div className="counter-card">
            <div className="counter-header">
                <h2>🧮 Counter</h2>
                <p>{status}</p>
            </div>

            <div className="counter-input-group">
                <label>Counter Address</label>
                <input
                    type="text"
                    placeholder="0x..."
                    value={counterAddress}
                    onChange={(e) => setCounterAddress(e.target.value)}
                />
                <button onClick={loadValue} disabled={isLoading}>Load Value</button>
            </div>

            <div className="counter-stats">
                <div className="stat">
                    <span>Current Value</span>
                    <strong>{current}</strong>
                </div>
            </div>

            <div className="counter-actions">
                <input
                    type="number"
                    placeholder="New value"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                />
                <button onClick={handleSet} disabled={isLoading}>Set Number</button>
                <button onClick={handleIncrement} disabled={isLoading}>Increment</button>
            </div>
        </div>
    )
}

export default CounterDashboard
