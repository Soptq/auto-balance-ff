# Auto Balance

powered by `folks-finance-js-sdk`

Auto balance can do the following works:
1. auto liquidate loans where its health < 1.
2. after liquidating, automatically withdraw collateral.
3. swap the collateral to USDC using tinyman DEX.

Related functions provided by `folks-finance-js-sdk`:

```javascript
    getConversionRate,
    getLoansInfo,
    getOraclePrices,
    getPoolInfo,
    getTokenPairInfo,
    LoanInfo,
    Oracle,
    prepareLiquidateTransactions,
    prepareWithdrawTransactions,
    ReserveAddress,
    TestnetOracle, TestnetPools,
    TestnetReserveAddress,
    TestnetTokenPairs,
    TokenPair,
    Pool
```

## Get started

### Docker

```shell
docker build -t auto-balance .
docker run auto-balance
```


