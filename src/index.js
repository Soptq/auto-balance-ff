"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
exports.__esModule = true;
var algosdk_1 = require("algosdk");
var src_1 = require("folks-finance-js-sdk/src");
var tinyman_ts_sdk_1 = require("tinyman-ts-sdk");
var config_1 = require("./config");
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
function liquidateLoans(pool, loans, tokenPair, oracle, reserveAddress, params) {
    return __awaiter(this, void 0, void 0, function () {
        var loans_1, loans_1_1, loan, escrowAddress, healthFactor, borrowBalance, txns, signedTxns, txId, e_1, e_2_1;
        var e_2, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 9, 10, 11]);
                    loans_1 = __values(loans), loans_1_1 = loans_1.next();
                    _b.label = 1;
                case 1:
                    if (!!loans_1_1.done) return [3 /*break*/, 8];
                    loan = loans_1_1.value;
                    escrowAddress = loan.escrowAddress, healthFactor = loan.healthFactor, borrowBalance = loan.borrowBalance;
                    if (!(healthFactor < 1e14)) return [3 /*break*/, 7];
                    txns = (0, src_1.prepareLiquidateTransactions)(tokenPair, oracle, config_1.sender.addr, loan.escrowAddress, reserveAddress, (borrowBalance * BigInt(110)) / BigInt(100), // over approx (will be repaid anything extra)
                    params);
                    signedTxns = txns.map(function (txn) { return txn.signTxn(config_1.sender.sk); });
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 6, , 7]);
                    return [4 /*yield*/, config_1.algodClient.sendRawTransaction(signedTxns)["do"]()];
                case 3:
                    txId = (_b.sent()).txId;
                    return [4 /*yield*/, (0, algosdk_1.waitForConfirmation)(config_1.algodClient, txId, 1000)];
                case 4:
                    _b.sent();
                    console.log("Successfully liquidated: " + escrowAddress);
                    return [4 /*yield*/, withdraw(pool, loan.collateralBalance, params)];
                case 5: return [2 /*return*/, _b.sent()];
                case 6:
                    e_1 = _b.sent();
                    console.log("Failed to liquidate: " + escrowAddress);
                    return [2 /*return*/, false];
                case 7:
                    loans_1_1 = loans_1.next();
                    return [3 /*break*/, 1];
                case 8: return [3 /*break*/, 11];
                case 9:
                    e_2_1 = _b.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 11];
                case 10:
                    try {
                        if (loans_1_1 && !loans_1_1.done && (_a = loans_1["return"])) _a.call(loans_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    });
}
function withdraw(pool, amount, params) {
    return __awaiter(this, void 0, void 0, function () {
        var txns, signedTxns, txId, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    txns = (0, src_1.prepareWithdrawTransactions)(pool, config_1.sender.addr, amount, params);
                    signedTxns = txns.map(function (txn) { return txn.signTxn(config_1.sender.sk); });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, config_1.algodClient.sendRawTransaction(signedTxns)["do"]()];
                case 2:
                    txId = (_a.sent()).txId;
                    return [4 /*yield*/, (0, algosdk_1.waitForConfirmation)(config_1.algodClient, txId, 1000)];
                case 3:
                    _a.sent();
                    console.log("Successfully withdraw: " + amount + " ALGO");
                    return [2 /*return*/, true];
                case 4:
                    e_3 = _a.sent();
                    console.log("Failed to with: " + amount + " ALGO");
                    return [2 /*return*/, false];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var oracle, tokenPair, reserveAddress, pool, reservedALGO, tinymanClient, algoAsset, usdcAsset, swapPool, collateralPool, borrowPool, oraclePrices, conversionRate, collateralPoolInfo, tokenPairInfo, params, loansInfo, loans, nextToken, liquidated, accountInfo, swapAmount, swapQuote, txns, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    oracle = src_1.TestnetOracle;
                    tokenPair = src_1.TestnetTokenPairs["ALGO-USDC"];
                    reserveAddress = src_1.TestnetReserveAddress;
                    pool = src_1.TestnetPools["ALGO"];
                    reservedALGO = 10000;
                    tinymanClient = new tinyman_ts_sdk_1.TinymanTestnetClient(config_1.algodClient, config_1.sender.addr);
                    return [4 /*yield*/, new tinyman_ts_sdk_1.Asset(0).fetch(config_1.algodClient)];
                case 1:
                    algoAsset = _a.sent();
                    return [4 /*yield*/, new tinyman_ts_sdk_1.Asset(31566704).fetch(config_1.algodClient)];
                case 2:
                    usdcAsset = _a.sent();
                    return [4 /*yield*/, tinymanClient.fetch_pool(algoAsset, usdcAsset, true)];
                case 3:
                    swapPool = _a.sent();
                    collateralPool = tokenPair.collateralPool, borrowPool = tokenPair.borrowPool;
                    return [4 /*yield*/, (0, src_1.getOraclePrices)(config_1.indexerClient, oracle, [collateralPool.assetId, borrowPool.assetId])];
                case 4:
                    oraclePrices = _a.sent();
                    conversionRate = (0, src_1.getConversionRate)(oraclePrices[collateralPool.assetId].price, oraclePrices[borrowPool.assetId].price);
                    return [4 /*yield*/, (0, src_1.getPoolInfo)(config_1.indexerClient, tokenPair.collateralPool)];
                case 5:
                    collateralPoolInfo = _a.sent();
                    return [4 /*yield*/, (0, src_1.getTokenPairInfo)(config_1.indexerClient, tokenPair)];
                case 6:
                    tokenPairInfo = _a.sent();
                    return [4 /*yield*/, config_1.algodClient.getTransactionParams()["do"]()];
                case 7:
                    params = _a.sent();
                    return [4 /*yield*/, (0, src_1.getLoansInfo)(config_1.indexerClient, tokenPair, tokenPairInfo, collateralPoolInfo, conversionRate)];
                case 8:
                    loansInfo = _a.sent();
                    loans = loansInfo.loans;
                    nextToken = loansInfo.nextToken;
                    // liquidate if possible
                    return [4 /*yield*/, liquidateLoans(pool, loans, tokenPair, oracle, reserveAddress, params)];
                case 9:
                    // liquidate if possible
                    _a.sent();
                    _a.label = 10;
                case 10:
                    if (!(nextToken !== undefined)) return [3 /*break*/, 21];
                    // sleep for 0.1 seconds to prevent hitting request limit
                    return [4 /*yield*/, sleep(100)];
                case 11:
                    // sleep for 0.1 seconds to prevent hitting request limit
                    _a.sent();
                    return [4 /*yield*/, (0, src_1.getLoansInfo)(config_1.indexerClient, tokenPair, tokenPairInfo, collateralPoolInfo, conversionRate, nextToken)];
                case 12:
                    // next loop of escrows
                    loansInfo = _a.sent();
                    loans = loansInfo.loans;
                    nextToken = loansInfo.nextToken;
                    return [4 /*yield*/, liquidateLoans(pool, loans, tokenPair, oracle, reserveAddress, params)];
                case 13:
                    liquidated = _a.sent();
                    if (!liquidated) return [3 /*break*/, 20];
                    return [4 /*yield*/, config_1.algodClient.accountInformation(config_1.sender.addr)["do"]()];
                case 14:
                    accountInfo = _a.sent();
                    if (accountInfo.amount < reservedALGO) {
                        console.log("Ignore this round of swap");
                        return [3 /*break*/, 10];
                    }
                    swapAmount = accountInfo.amount - reservedALGO;
                    return [4 /*yield*/, swapPool.fetch_fixed_input_swap_quote(algoAsset.AssetAmount(swapAmount), 0.01)];
                case 15:
                    swapQuote = _a.sent();
                    return [4 /*yield*/, swapPool.prepare_swap_transactions(swapQuote.amount_in_with_slippage(), swapQuote.amount_out_with_slippage(), 'fixed-input', config_1.sender.addr)];
                case 16:
                    txns = _a.sent();
                    txns.sign_with_private_key(config_1.sender.addr, config_1.sender.sk);
                    _a.label = 17;
                case 17:
                    _a.trys.push([17, 19, , 20]);
                    return [4 /*yield*/, txns.submit(config_1.algodClient, true)];
                case 18:
                    _a.sent();
                    console.log("Successfully swap: " + swapAmount + " ALGO");
                    return [3 /*break*/, 20];
                case 19:
                    e_4 = _a.sent();
                    console.log("Failed to swap: " + swapAmount + " ALGO");
                    return [3 /*break*/, 20];
                case 20: return [3 /*break*/, 10];
                case 21: return [2 /*return*/];
            }
        });
    });
}
main()["catch"](console.error);
