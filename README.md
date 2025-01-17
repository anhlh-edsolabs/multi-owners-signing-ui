# Multi-Owners Contract Signing Tool

~~This project is a web-based application for managing and signing multi-owner contracts using blockchain technology. It leverages various libraries and frameworks to provide a seamless user experience for interacting with smart contracts.~~

Nah, it's just me trying to learn web dev using ReactJS. The milestones achieved in this project are:

- Component design & refinement.
- State & Store management. By saying `Store` I mean the App's local memory, not just some grocery store you're thinking of.
- Writing and using Hooks.
- Form management.
- Getting data from an API.
- Connect wallet and sign structured data.
- Query smart contract data & execute transactions.
- Deploy to a domain.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [License](#license)

## Features

- Connect and disconnect crypto wallets
- View ERC20 token balances
- Interact with a soft staking contract
- Generate and sign typed data for multi-owner contract functions
- Combine multiple signatures for contract execution

## Project Structure

```plain-text
multi-owners-signing-ui/
├── public/
│   ├── key.png
│   └── vite.svg
├── src
│   ├── assets
│   ├── common
│   │   ├── abis
│   │   │   └── SoftStaking_ABI.json
│   │   ├── config.ts
│   │   ├── constants.ts
│   │   ├── data
│   │   │   └── soft-staking-data.ts
│   │   ├── libs
│   │   │   ├── soft-staking-EIP712.ts
│   │   │   └── utils.ts
│   │   └── types
│   │       ├── abi.ts
│   │       ├── claim-data.ts
│   │       ├── form-data.ts
│   │       ├── index.ts
│   │       ├── props.ts
│   │       └── typed-data.ts
│   ├── components
│   │   ├── cards
│   │   │   ├── CardCombineSignatures.tsx
│   │   │   ├── CardERC20Token.tsx
│   │   │   ├── CardSoftStakingContract.tsx
│   │   │   └── CardWallet.tsx
│   │   └── controls
│   │       ├── ClaimDataFromAPI.tsx
│   │       ├── CombinedSignature.tsx
│   │       ├── ContractInfo.tsx
│   │       ├── GenerateTypedDataButton.tsx
│   │       ├── ReadContract.tsx
│   │       ├── SignTypedDataButton.tsx
│   │       ├── SoftStakingFunctionInput.tsx
│   │       ├── SoftStakingFunctionSelection.tsx
│   │       ├── TokenBalance.tsx
│   │       ├── TypedDataView.tsx
│   │       ├── TypedDataViewItem.tsx
│   │       └── WriteContract.tsx
│   ├── hooks
│   │   ├── stores
│   │   │   ├── useChainConnectionStore.ts
│   │   │   ├── useClaimDataStore.ts
│   │   │   ├── useExecutionStore.ts
│   │   │   ├── useFunctionSelectionStore.ts
│   │   │   ├── useSignatureStore.ts
│   │   │   └── useTypedDataStore.ts
│   │   ├── useConnectedChain.ts
│   │   ├── useFunctionCallForm.ts
│   │   └── useTokenBalance.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env
├── .env.sample
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.json
└── yarn.lock
```

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/your-username/multi-owners-signing-ui.git
    cd multi-owners-signing-ui
    ```

2. Install dependencies:

    ```sh
    yarn
    ```

3. Create a [.env](.env) file based on the [.env.sample](.env.sample) file and fill in the required environment variables.

## Usage

To start the development server, run:

  ```sh
  yarn dev
  ```

This will start the Vite development server and open the application in your default web browser.

## Environment Variables

The following environment variables are required:

`VITE_WALLET_CONNECT_PROJECT_ID`: Your WalletConnect project ID

`VITE_WUSD_TOKEN_ADDRESS`: The address of the WUSD token

`VITE_SOFTSTAKING_ADDRESS`: The address of the soft staking contract

`VITE_SOFTSTAKING_DATA_ENDPOINT`: The API endpoint for querying Soft Staking data from the indexer

> DEV: <https://backend-dev.swapflow.io/v1/monthly-reward>

> STG: <https://backend-stg.swapflow.io/v1/monthly-reward>

## Scripts

**Start the development server:**

```bash
yarn dev
```

**Build the project for production:**

```bash
yarn build
```

**Run ESLint to check for code quality issues:**

```bash
yarn lint
```

**Preview the production build:**

```bash
yarn preview
```

## License

This project is licensed under the MIT License.
