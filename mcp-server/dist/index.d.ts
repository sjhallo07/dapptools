/**
 * MCP Server for JSON RPC 2.0 Integration
 * Provides tools for interacting with smart contracts and blockchain
 */
export declare class MCPServer {
    private jsonRpc;
    private contractManager;
    constructor(rpcUrl?: string);
    /**
     * Get network information
     */
    getNetworkInfo(): Promise<{
        chainId: string;
        blockNumber: string;
        gasPrice: string;
    }>;
    /**
     * Get account information
     */
    getAccountInfo(address: string): Promise<{
        balance: string;
        nonce: string;
        code: string;
    }>;
    /**
     * Get transaction details
     */
    getTransactionDetails(txHash: string): Promise<unknown>;
    /**
     * Get token balance
     */
    getTokenBalance(tokenAddress: string, account: string): Promise<string>;
    /**
     * Get token metadata
     */
    getTokenMetadata(tokenAddress: string): Promise<{
        name: string;
        symbol: string;
        decimals: number;
        totalSupply: string;
    }>;
    /**
     * Estimate gas for a transaction
     */
    estimateGas(tx: Record<string, unknown>): Promise<string>;
    /**
     * Call a contract function (read-only)
     */
    callFunction(contractAddress: string, abi: string[], functionName: string, params?: unknown[]): Promise<unknown>;
    /**
     * Encode function call data
     */
    encodeCall(abi: string[], functionName: string, params: unknown[]): string;
    /**
     * Decode function result
     */
    decodeResult(abi: string[], functionName: string, data: string): unknown[];
    /**
     * Get block information
     */
    getBlockInfo(blockNumber?: string): Promise<unknown>;
    /**
     * Get all available accounts
     */
    getAccounts(): Promise<string[]>;
    /**
     * Testing utilities
     */
    impersonate(address: string): Promise<void>;
    setBalance(address: string, balance: string): Promise<void>;
    mineBlocks(count?: number): Promise<void>;
    increaseTime(seconds: number): Promise<void>;
    createSnapshot(): Promise<string>;
    revertSnapshot(snapshotId: string): Promise<void>;
}
export declare const createMCPServer: (rpcUrl?: string) => MCPServer;
export { JsonRpcClient } from './jsonRpcClient';
export { SmartContractManager } from './smartContractManager';
//# sourceMappingURL=index.d.ts.map