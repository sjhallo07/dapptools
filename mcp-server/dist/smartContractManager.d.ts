/**
 * Smart Contract Interaction Handler
 */
export declare class SmartContractManager {
    private client;
    constructor(rpcUrl: string);
    /**
     * Call a read-only function on a smart contract
     */
    callContractFunction(contractAddress: string, abi: string[], functionName: string, params?: unknown[]): Promise<unknown>;
    /**
     * Get token balance using ERC20 ABI
     */
    getTokenBalance(tokenAddress: string, account: string): Promise<string>;
    /**
     * Get token info (name, symbol, decimals)
     */
    getTokenInfo(tokenAddress: string): Promise<{
        name: string;
        symbol: string;
        decimals: number;
        totalSupply: string;
    }>;
    /**
     * Encode contract function call
     */
    encodeFunction(abi: string[], functionName: string, params: unknown[]): string;
    /**
     * Decode contract function result
     */
    decodeFunction(abi: string[], functionName: string, data: string): unknown[];
    /**
     * Get raw contract data
     */
    getContractCode(contractAddress: string): Promise<string>;
    /**
     * Get raw storage value
     */
    getStorageValue(contractAddress: string, position: string, block?: string): Promise<string>;
}
//# sourceMappingURL=smartContractManager.d.ts.map