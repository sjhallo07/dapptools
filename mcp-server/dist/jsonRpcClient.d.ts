/**
 * JSON RPC 2.0 Client for Ethereum-compatible chains
 */
export declare class JsonRpcClient {
    private rpcUrl;
    private requestId;
    constructor(rpcUrl: string);
    private send;
    getChainId(): Promise<string>;
    getNetworkVersion(): Promise<string>;
    getGasPrice(): Promise<string>;
    getBlockNumber(): Promise<string>;
    getBalance(address: string, block?: string): Promise<string>;
    getTransactionCount(address: string, block?: string): Promise<string>;
    getCode(address: string, block?: string): Promise<string>;
    getBlock(blockNumber?: string): Promise<unknown>;
    getBlockWithTransactions(blockNumber?: string): Promise<unknown>;
    sendTransaction(tx: Record<string, unknown>): Promise<string>;
    sendRawTransaction(signedTx: string): Promise<string>;
    getTransaction(txHash: string): Promise<unknown>;
    getTransactionReceipt(txHash: string): Promise<unknown>;
    call(tx: Record<string, unknown>, block?: string): Promise<string>;
    estimateGas(tx: Record<string, unknown>): Promise<string>;
    getStorageAt(address: string, position: string, block?: string): Promise<string>;
    getAccounts(): Promise<string[]>;
    getCoinbase(): Promise<string>;
    isMining(): Promise<boolean>;
    getHashrate(): Promise<string>;
    impersonateAccount(address: string): Promise<void>;
    stopImpersonatingAccount(address: string): Promise<void>;
    setBalance(address: string, balance: string): Promise<void>;
    setCode(address: string, code: string): Promise<void>;
    setStorageAt(address: string, position: string, value: string): Promise<void>;
    mine(blocks?: number): Promise<void>;
    mineUpTo(blockNumber: number): Promise<void>;
    increaseTime(seconds: number): Promise<void>;
    setNextBlockTimestamp(timestamp: number): Promise<void>;
    snapshot(): Promise<string>;
    revert(snapshotId: string): Promise<void>;
}
//# sourceMappingURL=jsonRpcClient.d.ts.map