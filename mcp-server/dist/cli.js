#!/usr/bin/env node
import { createMCPServer } from './index.js';
import * as readline from 'readline';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
async function main() {
    const rpcUrl = process.env.RPC_URL || 'http://127.0.0.1:8545';
    const server = createMCPServer(rpcUrl);
    console.log('🚀 MCP Server CLI');
    console.log(`Connected to: ${rpcUrl}`);
    console.log('Type "help" for available commands\n');
    const commands = {
        help: async () => {
            console.log(`
Available commands:
  network          - Get network info (chainId, blockNumber, gasPrice)
  account <addr>   - Get account info (balance, nonce, code)
  balance <addr>   - Get account balance
  tx <hash>        - Get transaction details
  token <addr>     - Get token metadata
  block [num]      - Get block information
  accounts         - List all accounts
  help             - Show this help message
  exit             - Exit the CLI
      `);
        },
        network: async () => {
            try {
                const info = await server.getNetworkInfo();
                console.log('Network Info:');
                console.log(`  Chain ID: ${info.chainId}`);
                console.log(`  Block Number: ${info.blockNumber}`);
                console.log(`  Gas Price: ${info.gasPrice} wei`);
            }
            catch (err) {
                console.error('Error:', err instanceof Error ? err.message : 'Unknown error');
            }
        },
        account: async (args) => {
            if (!args[0]) {
                console.error('Usage: account <address>');
                return;
            }
            try {
                const info = await server.getAccountInfo(args[0]);
                console.log('Account Info:');
                console.log(`  Balance: ${info.balance} wei`);
                console.log(`  Nonce: ${info.nonce}`);
                console.log(`  Code: ${info.code === '0x' ? 'EOA' : 'Contract'}`);
            }
            catch (err) {
                console.error('Error:', err instanceof Error ? err.message : 'Unknown error');
            }
        },
        balance: async (args) => {
            if (!args[0]) {
                console.error('Usage: balance <address>');
                return;
            }
            try {
                const info = await server.getAccountInfo(args[0]);
                console.log(`Balance: ${info.balance} wei`);
            }
            catch (err) {
                console.error('Error:', err instanceof Error ? err.message : 'Unknown error');
            }
        },
        tx: async (args) => {
            if (!args[0]) {
                console.error('Usage: tx <txHash>');
                return;
            }
            try {
                const details = await server.getTransactionDetails(args[0]);
                console.log('Transaction Details:');
                console.log(JSON.stringify(details, null, 2));
            }
            catch (err) {
                console.error('Error:', err instanceof Error ? err.message : 'Unknown error');
            }
        },
        token: async (args) => {
            if (!args[0]) {
                console.error('Usage: token <contractAddress>');
                return;
            }
            try {
                const metadata = await server.getTokenMetadata(args[0]);
                console.log('Token Metadata:');
                console.log(`  Name: ${metadata.name}`);
                console.log(`  Symbol: ${metadata.symbol}`);
                console.log(`  Decimals: ${metadata.decimals}`);
                console.log(`  Total Supply: ${metadata.totalSupply}`);
            }
            catch (err) {
                console.error('Error:', err instanceof Error ? err.message : 'Unknown error');
            }
        },
        block: async (args) => {
            try {
                const blockNum = args[0] || 'latest';
                const block = await server.getBlockInfo(blockNum);
                console.log(`Block ${blockNum}:`);
                console.log(JSON.stringify(block, null, 2));
            }
            catch (err) {
                console.error('Error:', err instanceof Error ? err.message : 'Unknown error');
            }
        },
        accounts: async () => {
            try {
                const accounts = await server.getAccounts();
                console.log('Available Accounts:');
                accounts.forEach((acc, i) => console.log(`  ${i}: ${acc}`));
            }
            catch (err) {
                console.error('Error:', err instanceof Error ? err.message : 'Unknown error');
            }
        },
        exit: async () => {
            console.log('Goodbye!');
            process.exit(0);
        }
    };
    const prompt = () => {
        rl.question('mcp> ', async (input) => {
            const [cmd, ...args] = input.trim().split(/\s+/);
            if (!cmd) {
                prompt();
                return;
            }
            if (cmd in commands) {
                await commands[cmd](args);
            }
            else {
                console.error(`Unknown command: ${cmd}. Type "help" for available commands.`);
            }
            prompt();
        });
    };
    prompt();
}
main().catch(console.error);
//# sourceMappingURL=cli.js.map