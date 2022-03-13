#!/bin/sh

# compile folks-finance-js-sdk
cd ./node_modules/folks-finance-js-sdk && tsc
cd ../../
# compile tinyman-ts-sdk
cd ./node_modules/tinyman-ts-sdk && tsc
cd ../../
sed -i "s|'./src/asc.json'|'./node_modules/tinyman-ts-sdk/src/asc.json'|g" ./node_modules/tinyman-ts-sdk/dist/contracts.js
sed -i "s|0xFFFFFFFFFFFFFFFFn|BigInt(0xFFFFFFFFFFFFFFFF);|g" node_modules/tinyman-ts-sdk/src/Transactions/Bootstrap.ts

# compile auto-balance
tsc

# modification
sed -i "s|\"folks-finance-js-sdk/src/index\"|\"folks-finance-js-sdk/dist/index\"|g" ./dist/index.js
sed -i "s|\"tinyman-ts-sdk/src/index\"|\"tinyman-ts-sdk/dist/index\"|g" ./dist/index.js