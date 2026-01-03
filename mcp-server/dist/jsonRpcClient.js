import axios from 'axios';
/**
 * JSON RPC 2.0 Client for Ethereum-compatible chains
 */
export class JsonRpcClient {
    constructor(rpcUrl) {
        this.requestId = 1;
        this.rpcUrl = rpcUrl;
    }
    async send(method, params = []) {
        const request = {
            jsonrpc: '2.0',
            method,
            params,
            id: this.requestId++
        };
        try {
            const response = await axios.post(this.rpcUrl, request, {
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.data.error) {
                throw new Error(`JSON RPC Error: ${response.data.error.message}`);
            }
            return response.data.result;
        }
        catch (error) {
            throw new Error(`Failed to call ${method}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    // Network Methods
    async getChainId() {
        return (await this.send('eth_chainId'));
    }
    async getNetworkVersion() {
        return (await this.send('net_version'));
    }
    async getGasPrice() {
        return (await this.send('eth_gasPrice'));
    }
    async getBlockNumber() {
        return (await this.send('eth_blockNumber'));
    }
    // Account Methods
    async getBalance(address, block = 'latest') {
        return (await this.send('eth_getBalance', [address, block]));
    }
    async getTransactionCount(address, block = 'latest') {
        return (await this.send('eth_getTransactionCount', [address, block]));
    }
    async getCode(address, block = 'latest') {
        return (await this.send('eth_getCode', [address, block]));
    }
    // Block Methods
    async getBlock(blockNumber = 'latest') {
        return await this.send('eth_getBlockByNumber', [blockNumber, false]);
    }
    async getBlockWithTransactions(blockNumber = 'latest') {
        return await this.send('eth_getBlockByNumber', [blockNumber, true]);
    }
    // Transaction Methods
    async sendTransaction(tx) {
        return (await this.send('eth_sendTransaction', [tx]));
    }
    async sendRawTransaction(signedTx) {
        return (await this.send('eth_sendRawTransaction', [signedTx]));
    }
    async getTransaction(txHash) {
        return await this.send('eth_getTransactionByHash', [txHash]);
    }
    async getTransactionReceipt(txHash) {
        return await this.send('eth_getTransactionReceipt', [txHash]);
    }
    // Call Methods
    async call(tx, block = 'latest') {
        return (await this.send('eth_call', [tx, block]));
    }
    async estimateGas(tx) {
        return (await this.send('eth_estimateGas', [tx]));
    }
    // Storage Methods
    async getStorageAt(address, position, block = 'latest') {
        return (await this.send('eth_getStorageAt', [address, position, block]));
    }
    // Utility Methods
    async getAccounts() {
        return (await this.send('eth_accounts'));
    }
    async getCoinbase() {
        return (await this.send('eth_coinbase'));
    }
    async isMining() {
        return (await this.send('eth_mining'));
    }
    async getHashrate() {
        return (await this.send('eth_hashrate'));
    }
    // Testing Methods (Anvil/Hardhat specific)
    async impersonateAccount(address) {
        await this.send('hardhat_impersonateAccount', [address]);
    }
    async stopImpersonatingAccount(address) {
        await this.send('hardhat_stopImpersonatingAccount', [address]);
    }
    async setBalance(address, balance) {
        await this.send('hardhat_setBalance', [address, balance]);
    }
    async setCode(address, code) {
        await this.send('hardhat_setCode', [address, code]);
    }
    async setStorageAt(address, position, value) {
        await this.send('hardhat_setStorageAt', [address, position, value]);
    }
    async mine(blocks = 1) {
        await this.send('hardhat_mine', [blocks.toString()]);
    }
    async mineUpTo(blockNumber) {
        await this.send('hardhat_mine', [blockNumber.toString()]);
    }
    async increaseTime(seconds) {
        await this.send('evm_increaseTime', [seconds]);
        await this.mine(1);
    }
    async setNextBlockTimestamp(timestamp) {
        await this.send('evm_setNextBlockTimestamp', [timestamp]);
    }
    async snapshot() {
        return (await this.send('evm_snapshot'));
    }
    async revert(snapshotId) {
        await this.send('evm_revert', [snapshotId]);
    }
}
//# sourceMappingURL=jsonRpcClient.js.map