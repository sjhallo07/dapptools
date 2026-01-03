import axios from 'axios'

interface JsonRpcRequest
{
    jsonrpc: '2.0'
    method: string
    params?: unknown[]
    id?: string | number
}

interface JsonRpcResponse
{
    jsonrpc: '2.0'
    result?: unknown
    error?: {
        code: number
        message: string
        data?: unknown
    }
    id?: string | number
}

/**
 * JSON RPC 2.0 Client for Ethereum-compatible chains
 */
export class JsonRpcClient
{
    private rpcUrl: string
    private requestId: number = 1

    constructor(rpcUrl: string)
    {
        this.rpcUrl = rpcUrl
    }

    private async send(method: string, params: unknown[] = []): Promise<unknown>
    {
        const request: JsonRpcRequest = {
            jsonrpc: '2.0',
            method,
            params,
            id: this.requestId++
        }

        try {
            const response = await axios.post<JsonRpcResponse>(this.rpcUrl, request, {
                headers: { 'Content-Type': 'application/json' }
            })

            if (response.data.error) {
                throw new Error(`JSON RPC Error: ${response.data.error.message}`)
            }

            return response.data.result
        } catch (error) {
            throw new Error(
                `Failed to call ${method}: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    }

    // Network Methods
    async getChainId(): Promise<string>
    {
        return (await this.send('eth_chainId')) as string
    }

    async getNetworkVersion(): Promise<string>
    {
        return (await this.send('net_version')) as string
    }

    async getGasPrice(): Promise<string>
    {
        return (await this.send('eth_gasPrice')) as string
    }

    async getBlockNumber(): Promise<string>
    {
        return (await this.send('eth_blockNumber')) as string
    }

    // Account Methods
    async getBalance(address: string, block: string = 'latest'): Promise<string>
    {
        return (await this.send('eth_getBalance', [address, block])) as string
    }

    async getTransactionCount(address: string, block: string = 'latest'): Promise<string>
    {
        return (await this.send('eth_getTransactionCount', [address, block])) as string
    }

    async getCode(address: string, block: string = 'latest'): Promise<string>
    {
        return (await this.send('eth_getCode', [address, block])) as string
    }

    // Block Methods
    async getBlock(blockNumber: string = 'latest'): Promise<unknown>
    {
        return await this.send('eth_getBlockByNumber', [blockNumber, false])
    }

    async getBlockWithTransactions(blockNumber: string = 'latest'): Promise<unknown>
    {
        return await this.send('eth_getBlockByNumber', [blockNumber, true])
    }

    // Transaction Methods
    async sendTransaction(tx: Record<string, unknown>): Promise<string>
    {
        return (await this.send('eth_sendTransaction', [tx])) as string
    }

    async sendRawTransaction(signedTx: string): Promise<string>
    {
        return (await this.send('eth_sendRawTransaction', [signedTx])) as string
    }

    async getTransaction(txHash: string): Promise<unknown>
    {
        return await this.send('eth_getTransactionByHash', [txHash])
    }

    async getTransactionReceipt(txHash: string): Promise<unknown>
    {
        return await this.send('eth_getTransactionReceipt', [txHash])
    }

    // Call Methods
    async call(
        tx: Record<string, unknown>,
        block: string = 'latest'
    ): Promise<string>
    {
        return (await this.send('eth_call', [tx, block])) as string
    }

    async estimateGas(tx: Record<string, unknown>): Promise<string>
    {
        return (await this.send('eth_estimateGas', [tx])) as string
    }

    // Storage Methods
    async getStorageAt(
        address: string,
        position: string,
        block: string = 'latest'
    ): Promise<string>
    {
        return (await this.send('eth_getStorageAt', [address, position, block])) as string
    }

    // Utility Methods
    async getAccounts(): Promise<string[]>
    {
        return (await this.send('eth_accounts')) as string[]
    }

    async getCoinbase(): Promise<string>
    {
        return (await this.send('eth_coinbase')) as string
    }

    async isMining(): Promise<boolean>
    {
        return (await this.send('eth_mining')) as boolean
    }

    async getHashrate(): Promise<string>
    {
        return (await this.send('eth_hashrate')) as string
    }

    // Testing Methods (Anvil/Hardhat specific)
    async impersonateAccount(address: string): Promise<void>
    {
        await this.send('hardhat_impersonateAccount', [address])
    }

    async stopImpersonatingAccount(address: string): Promise<void>
    {
        await this.send('hardhat_stopImpersonatingAccount', [address])
    }

    async setBalance(address: string, balance: string): Promise<void>
    {
        await this.send('hardhat_setBalance', [address, balance])
    }

    async setCode(address: string, code: string): Promise<void>
    {
        await this.send('hardhat_setCode', [address, code])
    }

    async setStorageAt(address: string, position: string, value: string): Promise<void>
    {
        await this.send('hardhat_setStorageAt', [address, position, value])
    }

    async mine(blocks: number = 1): Promise<void>
    {
        await this.send('hardhat_mine', [blocks.toString()])
    }

    async mineUpTo(blockNumber: number): Promise<void>
    {
        await this.send('hardhat_mine', [blockNumber.toString()])
    }

    async increaseTime(seconds: number): Promise<void>
    {
        await this.send('evm_increaseTime', [seconds])
        await this.mine(1)
    }

    async setNextBlockTimestamp(timestamp: number): Promise<void>
    {
        await this.send('evm_setNextBlockTimestamp', [timestamp])
    }

    async snapshot(): Promise<string>
    {
        return (await this.send('evm_snapshot')) as string
    }

    async revert(snapshotId: string): Promise<void>
    {
        await this.send('evm_revert', [snapshotId])
    }
}
