import { Contract } from 'ethers';
import { JsonRpcClient } from './jsonRpcClient.js';
/**
 * Smart Contract Interaction Handler
 */
export class SmartContractManager {
    constructor(rpcUrl) {
        this.client = new JsonRpcClient(rpcUrl);
    }
    /**
     * Call a read-only function on a smart contract
     */
    async callContractFunction(contractAddress, abi, functionName, params = []) {
        const iface = new Contract(contractAddress, abi);
        const encodedData = iface.interface.encodeFunctionData(functionName, params);
        const result = await this.client.call({
            to: contractAddress,
            data: encodedData
        });
        // Decode the result
        const functionAbi = abi.find(item => item.includes(functionName));
        if (!functionAbi) {
            throw new Error(`Function ${functionName} not found in ABI`);
        }
        return result;
    }
    /**
     * Get token balance using ERC20 ABI
     */
    async getTokenBalance(tokenAddress, account) {
        const erc20Abi = [
            'function balanceOf(address owner) public view returns (uint256)'
        ];
        try {
            const balance = await this.callContractFunction(tokenAddress, erc20Abi, 'balanceOf', [account]);
            return balance;
        }
        catch (error) {
            throw new Error(`Failed to get balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Get token info (name, symbol, decimals)
     */
    async getTokenInfo(tokenAddress) {
        const erc20Abi = [
            'function name() public view returns (string)',
            'function symbol() public view returns (string)',
            'function decimals() public view returns (uint8)',
            'function totalSupply() public view returns (uint256)'
        ];
        try {
            const contract = new Contract(tokenAddress, erc20Abi);
            const iface = contract.interface;
            const nameData = iface.encodeFunctionData('name', []);
            const symbolData = iface.encodeFunctionData('symbol', []);
            const decimalsData = iface.encodeFunctionData('decimals', []);
            const totalSupplyData = iface.encodeFunctionData('totalSupply', []);
            const [nameResult, symbolResult, decimalsResult, totalSupplyResult] = await Promise.all([
                this.client.call({ to: tokenAddress, data: nameData }),
                this.client.call({ to: tokenAddress, data: symbolData }),
                this.client.call({ to: tokenAddress, data: decimalsData }),
                this.client.call({ to: tokenAddress, data: totalSupplyData })
            ]);
            return {
                name: iface.decodeFunctionResult('name', nameResult)[0],
                symbol: iface.decodeFunctionResult('symbol', symbolResult)[0],
                decimals: iface.decodeFunctionResult('decimals', decimalsResult)[0],
                totalSupply: iface.decodeFunctionResult('totalSupply', totalSupplyResult)[0]
            };
        }
        catch (error) {
            throw new Error(`Failed to get token info: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Encode contract function call
     */
    encodeFunction(abi, functionName, params) {
        const iface = new Contract('0x0000000000000000000000000000000000000000', abi);
        return iface.interface.encodeFunctionData(functionName, params);
    }
    /**
     * Decode contract function result
     */
    decodeFunction(abi, functionName, data) {
        const iface = new Contract('0x0000000000000000000000000000000000000000', abi);
        return iface.interface.decodeFunctionResult(functionName, data);
    }
    /**
     * Get raw contract data
     */
    async getContractCode(contractAddress) {
        return await this.client.getCode(contractAddress);
    }
    /**
     * Get raw storage value
     */
    async getStorageValue(contractAddress, position, block = 'latest') {
        return await this.client.getStorageAt(contractAddress, position, block);
    }
}
//# sourceMappingURL=smartContractManager.js.map