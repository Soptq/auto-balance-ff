import { SuggestedParams, waitForConfirmation} from "algosdk";
import {
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
} from "folks-finance-js-sdk/src/index";
import { Asset, TinymanTestnetClient } from "tinyman-ts-sdk"
import { algodClient, indexerClient, sender } from "./config";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function liquidateLoans(
    pool: Pool,
    loans: LoanInfo[],
    tokenPair: TokenPair,
    oracle: Oracle,
    reserveAddress: ReserveAddress,
    params: SuggestedParams,
) {
    for (const loan of loans) {
        const { escrowAddress, healthFactor, borrowBalance } = loan;

        // check health factor is below 1
        if (healthFactor < 1e14) {
            // prepare liquidation transactions
            const txns = prepareLiquidateTransactions(
                tokenPair,
                oracle,
                sender.addr,
                loan.escrowAddress,
                reserveAddress,
                (borrowBalance * BigInt(110)) / BigInt(100), // over approx (will be repaid anything extra)
                params,
            );

            // sign transactions
            const signedTxns = txns.map(txn => txn.signTxn(sender.sk));

            // submit transactions
            try {
                const { txId } = await algodClient.sendRawTransaction(signedTxns).do();
                await waitForConfirmation(algodClient, txId, 1000);
                console.log("Successfully liquidated: " + escrowAddress);
                return await withdraw(pool, loan.collateralBalance, params);
            } catch (e) {
                console.log("Failed to liquidate: " + escrowAddress);
                return false
            }
        }
    }
}

async function withdraw(pool: Pool, amount: bigint, params: SuggestedParams,) {
    const txns = prepareWithdrawTransactions(pool, sender.addr, amount, params);
    const signedTxns = txns.map(txn => txn.signTxn(sender.sk));
    try {
        const txId = (await algodClient.sendRawTransaction(signedTxns).do()).txId;
        await waitForConfirmation(algodClient, txId, 1000);
        console.log("Successfully withdraw: " + amount + " ALGO");
        return true
    } catch (e) {
        console.log("Failed to with: " + amount + " ALGO");
        return false
    }
}

async function main() {
    const oracle = TestnetOracle;
    const tokenPair = TestnetTokenPairs["ALGO-USDC"];
    const reserveAddress = TestnetReserveAddress;
    const pool = TestnetPools["ALGO"];
    const reservedALGO = 10_000;

    const tinymanClient = new TinymanTestnetClient(algodClient, sender.addr);
    const algoAsset = await new Asset(0).fetch(algodClient);       //ALGO
    const usdcAsset = await new Asset(10458941).fetch(algodClient); //USDC
    const swapPool = await tinymanClient.fetch_pool(algoAsset, usdcAsset, true);

    const { collateralPool, borrowPool } = tokenPair;

    // get conversion rate
    const oraclePrices = await getOraclePrices(indexerClient, oracle, [collateralPool.assetId, borrowPool.assetId]);
    const conversionRate = getConversionRate(oraclePrices[collateralPool.assetId].price, oraclePrices[borrowPool.assetId].price);

    // get collateral pool and token pair info
    const collateralPoolInfo = await getPoolInfo(indexerClient, tokenPair.collateralPool);
    const tokenPairInfo = await getTokenPairInfo(indexerClient, tokenPair);

    // retrieve params
    const params = await algodClient.getTransactionParams().do();

    // loop through escrows
    let loansInfo = await getLoansInfo(indexerClient, tokenPair, tokenPairInfo, collateralPoolInfo, conversionRate);
    let loans = loansInfo.loans;
    let nextToken = loansInfo.nextToken;

    // liquidate if possible
    await liquidateLoans(pool, loans, tokenPair, oracle, reserveAddress, params);

    while (nextToken !== undefined) {
        // sleep for 0.1 seconds to prevent hitting request limit
        await sleep(100);

        // next loop of escrows
        loansInfo = await getLoansInfo(indexerClient, tokenPair, tokenPairInfo, collateralPoolInfo, conversionRate, nextToken);
        loans = loansInfo.loans;
        nextToken = loansInfo.nextToken;

        // liquidate if possible
        const liquidated = await liquidateLoans(pool, loans, tokenPair, oracle, reserveAddress, params);
        if (liquidated) {
            const accountInfo = await algodClient.accountInformation(sender.addr).do();
            if (accountInfo.amount < reservedALGO) {
                console.log("Ignore this round of swap")
                continue
            }

            //Get a Fixed Input Swap Quote
            const swapAmount = accountInfo.amount - reservedALGO;
            const swapQuote =
                await swapPool.fetch_fixed_input_swap_quote(
                    algoAsset.AssetAmount(swapAmount)
                    ,0.01
                );

            const txns = await swapPool.prepare_swap_transactions(
                swapQuote.amount_in_with_slippage(),
                swapQuote.amount_out_with_slippage(),
                'fixed-input',
                sender.addr
            );

            txns.sign_with_private_key(sender.addr, sender.sk);
            try {
                await txns.submit(algodClient,true);
                console.log("Successfully swap: " + swapAmount + " ALGO");
            } catch (e) {
                console.log("Failed to swap: " + swapAmount + " ALGO");
            }
        }
    }
}

main().catch(console.error);
