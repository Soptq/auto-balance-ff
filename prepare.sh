#!/bin/sh

# compile folks-finance-js-sdk
sed -i '' "s|\"src/index.ts\"|\"src/**/*.ts\"|g" ./node_modules/folks-finance-js-sdk/tsconfig.json
cd ./node_modules/folks-finance-js-sdk && tsc
cd ../../
# compile tinyman-ts-sdk
sed -i '' "s|0xFFFFFFFFFFFFFFFFn|BigInt(0xFFFFFFFFFFFFFFFF)|g" node_modules/tinyman-ts-sdk/src/Transactions/Bootstrap.ts
sed -i '' "s|es2021|es6|g" node_modules/tinyman-ts-sdk/tsconfig.json
sed -i '' "s|esnext|commonjs|g" node_modules/tinyman-ts-sdk/tsconfig.json
sed -i '' "s|\"type\": \"module\",||g" node_modules/tinyman-ts-sdk/package.json
cp -f node_modules/tinyman-ts-sdk/src/global.d.ts ./src/
rm -rf ./node_modules/tinyman-ts-sdk/src/Examples
cd ./node_modules/tinyman-ts-sdk && tsc
cd ../../
sed -i '' "s|'./src/asc.json'|'./node_modules/tinyman-ts-sdk/src/asc.json'|g" ./node_modules/tinyman-ts-sdk/dist/contracts.js

# compile auto-balance
tsc

# modification
sed -i '' "s|\"folks-finance-js-sdk/src/index\"|\"folks-finance-js-sdk/dist/index\"|g" ./dist/index.js
sed -i '' "s|\"tinyman-ts-sdk\"|\"tinyman-ts-sdk/dist/index\"|g" ./dist/index.js