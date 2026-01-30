# Monet Compose

Compose app for Monet Protocol

## Wallet Addresses

These are the Compose smart wallets that execute transactions. You'll need to grant them appropriate permissions on your contracts.

- **updateOracle**: `0x6f87C5d928a7c02BaaB4578CBC10422908a808eE`
- **processReport**: `0xEdCD6e767082E380e3B8D1eCEefcd16a8d97FD16`

## Calling the Tasks

Both tasks are HTTP endpoints. Use your goldsky API key in the Authorization header.

### updateOracle

Calls `updateOracle(address collateral)` on ParallelizerUSDp contracts.

```bash
curl -X POST https://api.goldsky.com/api/admin/compose/v1/monet-protocol/tasks/updateOracle \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <API_KEY>" \
  -d '{"collateral": "0x9D39A5DE30e57443BfF2A8307A4256c8797A3497", "chain": "ethereum"}'
```

Supported chains: `ethereum`, `base`, `sonic`, `hyperevm`, `avalanche`

### processReport

Calls `process_report(address strategy)` on Yearn V3 vaults.

```bash
curl -X POST https://api.goldsky.com/api/admin/compose/v1/monet-protocol/tasks/processReport \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <API_KEY>" \
  -d '{"vault": "ygamiUSDC", "strategy": "0x...", "chain": "avalanche"}'
```

Available vaults:
- Avalanche: `ygamiUSDC`, `ymevUSDC`
- Sonic: `ygami_scUSD`

## Making Updates

1. Edit the code
2. Deploy: `goldsky compose deploy`

Contract addresses are in `src/lib/config.ts` if you need to add more chains or vaults.
