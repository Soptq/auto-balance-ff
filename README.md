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

Currently, the installation of this project requires manual editing to the compiled files of both folks finance ts sdk and tinyman dex sdk due to differences of their environments, which can be quite bothering for quick setup. To alleviate this problem, we provide Dockerfile so that you can setup this project with just one line of command.

If you don't want to install docker, and you are using linux based OS, then you can also quickly setup the project by running the following commands sequentially:

```shell
apk update && apk upgrade && apk add --no-cache bash git openssh # Install dependencies
yarn && yarn add https://github.com/Folks-Finance/folks-finance-js-sdk && yarn add @types/node # Install nodejs dependencies
yarn auto-prepare # automatically do the editing
```

On the other hand, if you are using other OS like MacOS or Windows, you might need to manually do the editing due to different CLI interfaces. Please refer to `./prepare.sh` or directly ask me by creating issues.

### Install and Run with Docker

```shell
docker build -t auto-balance .
docker run auto-balance
```

And that's all!
