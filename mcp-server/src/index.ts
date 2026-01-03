import { JsonRpcClient } from './jsonRpcClient.js'
import { SmartContractManager } from './smartContractManager.js'
import { DappAnalyzer } from './dappAnalyzer.js'

/**
 * MCP Server for JSON RPC 2.0 Integration
 * Provides tools for interacting with smart contracts and blockchain
 */
export class MCPServer
{
    private jsonRpc: JsonRpcClient
    private contractManager: SmartContractManager
    private dappAnalyzer: DappAnalyzer

    constructor(rpcUrl: string = 'http://127.0.0.1:8545', projectRoot?: string)
    {
        this.jsonRpc = new JsonRpcClient(rpcUrl)
        this.contractManager = new SmartContractManager(rpcUrl)
        this.dappAnalyzer = new DappAnalyzer(rpcUrl, projectRoot)
    }

    /**
     * Get network information
     */
    async getNetworkInfo(): Promise<{
        chainId: string
        blockNumber: string
        gasPrice: string
    }>
    {
        const [chainId, blockNumber, gasPrice] = await Promise.all([
            this.jsonRpc.getChainId(),
            this.jsonRpc.getBlockNumber(),
            this.jsonRpc.getGasPrice()
        ])

        return { chainId, blockNumber, gasPrice }
    }

    /**
     * Get account information
     */
    async getAccountInfo(address: string): Promise<{
        balance: string
        nonce: string
        code: string
    }>
    {
        const [balance, nonce, code] = await Promise.all([
            this.jsonRpc.getBalance(address),
            this.jsonRpc.getTransactionCount(address),
            this.jsonRpc.getCode(address)
        ])

        return { balance, nonce, code }
    }

    /**
     * Get transaction details
     */
    async getTransactionDetails(txHash: string): Promise<unknown>
    {
        const [transaction, receipt] = await Promise.all([
            this.jsonRpc.getTransaction(txHash),
            this.jsonRpc.getTransactionReceipt(txHash)
        ])

        return { transaction, receipt }
    }

    /**
     * Get token balance
     */
    async getTokenBalance(tokenAddress: string, account: string): Promise<string>
    {
        return await this.contractManager.getTokenBalance(tokenAddress, account)
    }

    /**
     * Get token metadata
     */
    async getTokenMetadata(tokenAddress: string): Promise<{
        name: string
        symbol: string
        decimals: number
        totalSupply: string
    }>
    {
        return await this.contractManager.getTokenInfo(tokenAddress)
    }

    /**
     * Estimate gas for a transaction
     */
    async estimateGas(tx: Record<string, unknown>): Promise<string>
    {
        return await this.jsonRpc.estimateGas(tx)
    }

    /**
     * Call a contract function (read-only)
     */
    async callFunction(
        contractAddress: string,
        abi: string[],
        functionName: string,
        params: unknown[] = []
    ): Promise<unknown>
    {
        return await this.contractManager.callContractFunction(
            contractAddress,
            abi,
            functionName,
            params
        )
    }

    /**
     * Encode function call data
     */
    encodeCall(abi: string[], functionName: string, params: unknown[]): string
    {
        return this.contractManager.encodeFunction(abi, functionName, params)
    }

    /**
     * Decode function result
     */
    decodeResult(abi: string[], functionName: string, data: string): unknown[]
    {
        return this.contractManager.decodeFunction(abi, functionName, data)
    }

    /**
     * Get block information
     */
    async getBlockInfo(blockNumber: string = 'latest'): Promise<unknown>
    {
        return await this.jsonRpc.getBlock(blockNumber)
    }

    /**
     * Get all available accounts
     */
    async getAccounts(): Promise<string[]>
    {
        return await this.jsonRpc.getAccounts()
    }

    /**
     * Testing utilities
     */
    async impersonate(address: string): Promise<void>
    {
        await this.jsonRpc.impersonateAccount(address)
    }

    async setBalance(address: string, balance: string): Promise<void>
    {
        await this.jsonRpc.setBalance(address, balance)
    }

    async mineBlocks(count: number = 1): Promise<void>
    {
        await this.jsonRpc.mine(count)
    }

    async increaseTime(seconds: number): Promise<void>
    {
        await this.jsonRpc.increaseTime(seconds)
    }

    async createSnapshot(): Promise<string>
    {
        return await this.jsonRpc.snapshot()
    }

    async revertSnapshot(snapshotId: string): Promise<void>
    {
        await this.jsonRpc.revert(snapshotId)
    }

    /**
     * Dapp Modernization & Analysis
     */
    async analyzeDapp()
    {
        return await this.dappAnalyzer.analyzeDapp()
    }

    printDappReport(analysis: any): void
    {
        this.dappAnalyzer.printReport(analysis)
    }

    async generateUpgradeScript(analysis: any): Promise<string>
    {
        return await this.dappAnalyzer.generateUpgradeScript(analysis)
    }
}

// Export instances
export const createMCPServer = (rpcUrl?: string): MCPServer =>
{
    return new MCPServer(rpcUrl)
}

export { JsonRpcClient } from './jsonRpcClient.js'
export { SmartContractManager } from './smartContractManager.js'
export { DappAnalyzer } from './dappAnalyzer.js'
