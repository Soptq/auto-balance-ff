"use strict";
exports.__esModule = true;
exports.indexerClient = exports.algodClient = exports.sender = void 0;
var algosdk_1 = require("algosdk");
// TODO: Replace
// export const sender = mnemonicToSecretKey("");
exports.sender = (0, algosdk_1.generateAccount)();
exports.algodClient = new algosdk_1.Algodv2("", "https://testnet-api.algonode.cloud/", 443);
exports.indexerClient = new algosdk_1.Indexer("", "https://testnet-idx.algonode.cloud/", 443);
