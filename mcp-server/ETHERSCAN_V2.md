# Etherscan API v2 Quick Notes

Source: https://api.etherscan.io/v2/api (requires `chainid`) and https://api.etherscan.io/v2/chainlist.

## Basics
- Every call requires `chainid` (see `https://api.etherscan.io/v2/chainlist`) and `apikey`.
- Common pattern: `https://api.etherscan.io/v2/api?chainid=<id>&module=<module>&action=<action>&...&apikey=<key>`.
- Supported chains include Ethereum (1), Sepolia (11155111), Holesky (17000), Base (8453/84532), Arbitrum (42161/421614), Polygon (137/80002), Optimism (10/11155420), BNB (56/97), and many more (69 entries as of latest list).

## Example endpoints
- **Supply**: `module=stats&action=ethsupply` → total ETH supply. Variant: `ethsupply2`.
- **Price**: `module=stats&action=ethdailyprice&startdate=YYYY-MM-DD&enddate=YYYY-MM-DD&sort=desc|asc`.
- **Network metrics**: `module=stats&action=dailynetutilization`, `dailyuncleblkcount`, `nodecount`.
- **Tx status**: `module=transaction&action=getstatus` or `gettxreceiptstatus` with `txhash`.
- **JSON-RPC proxy**: `module=proxy&action=eth_getBlockByNumber` with `tag` (hex block), `boolean` (tx objects), and `eth_getTransactionReceipt` with `txhash`.

## Sample curl (Ethereum mainnet)
```
curl "https://api.etherscan.io/v2/api?chainid=1&module=stats&action=ethsupply&apikey=YOUR_KEY"
```

## Integration tips for MCP / tooling
- Validate `chainid` is present; fall back to `chainlist` if missing.
- Handle `status:0`/`message:NOTOK` for auth/parameter errors.
- For frontend/docs, note that `apikey` is required even for public data on v2.
- Cache `chainlist` to offer network selection (name, explorer URL, apiurl, status).
