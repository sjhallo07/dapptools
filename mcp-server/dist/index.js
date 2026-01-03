import { JsonRpcClient } from './jsonRpcClient';
import { SmartContractManager } from './smartContractManager';
/**
 * MCP Server for JSON RPC 2.0 Integration
 * Provides tools for interacting with smart contracts and blockchain
 */
export class MCPServer {
    constructor(rpcUrl = 'http://127.0.0.1:8545') {
        this.jsonRpc = new JsonRpcClient(rpcUrl);
        this.contractManager = new SmartContractManager(rpcUrl);
    }
    /**
     * Get network information
     */
    async getNetworkInfo() {
        const [chainId, blockNumber, gasPrice] = await Promise.all([
            this.jsonRpc.getChainId(),
            this.jsonRpc.getBlockNumber(),
            this.jsonRpc.getGasPrice()
        ]);
        return { chainId, blockNumber, gasPrice };
    }
    /**
     * Get account information
     */
    async getAccountInfo(address) {
        const [balance, nonce, code] = await Promise.all([
            this.jsonRpc.getBalance(address),
            this.jsonRpc.getTransactionCount(address),
            this.jsonRpc.getCode(address)
        ]);
        return { balance, nonce, code };
    }
    /**
     * Get transaction details
     */
    async getTransactionDetails(txHash) {
        const [transaction, receipt] = await Promise.all([
            this.jsonRpc.getTransaction(txHash),
            this.jsonRpc.getTransactionReceipt(txHash)
        ]);
        return { transaction, receipt };
    }
    /**
     * Get token balance
     */
    async getTokenBalance(tokenAddress, account) {
        return await this.contractManager.getTokenBalance(tokenAddress, account);
    }
    /**
     * Get token metadata
     */
    async getTokenMetadata(tokenAddress) {
        return await this.contractManager.getTokenInfo(tokenAddress);
    }
    /**
     * Estimate gas for a transaction
     */
    async estimateGas(tx) {
        return await this.jsonRpc.estimateGas(tx);
    }
    /**
     * Call a contract function (read-only)
     */
    async callFunction(contractAddress, abi, functionName, params = []) {
        return await this.contractManager.callContractFunction(contractAddress, abi, functionName, params);
    }
    /**
     * Encode function call data
     */
    encodeCall(abi, functionName, params) {
        return this.contractManager.encodeFunction(abi, functionName, params);
    }
    /**
     * Decode function result
     */
    decodeResult(abi, functionName, data) {
        return this.contractManager.decodeFunction(abi, functionName, data);
    }
    /**
     * Get block information
     */
    async getBlockInfo(blockNumber = 'latest') {
        return await this.jsonRpc.getBlock(blockNumber);
    }
    /**
     * Get all available accounts
     */
    async getAccounts() {
        return await this.jsonRpc.getAccounts();
    }
    /**
     * Testing utilities
     */
    async impersonate(address) {
        await this.jsonRpc.impersonateAccount(address);
    }
    async setBalance(address, balance) {
        await this.jsonRpc.setBalance(address, balance);
    }
    async mineBlocks(count = 1) {
        await this.jsonRpc.mine(count);
    }
    async increaseTime(seconds) {
        await this.jsonRpc.increaseTime(seconds);
    }
    async createSnapshot() {
        return await this.jsonRpc.snapshot();
    }
    async revertSnapshot(snapshotId) {
        await this.jsonRpc.revert(snapshotId);
    }
}
// Export instances
export const createMCPServer = (rpcUrl) => {
    return new MCPServer(rpcUrl);
};
export { JsonRpcClient } from './jsonRpcClient';
export { SmartContractManager } from './smartContractManager';
//# sourceMappingURL=index.js.map