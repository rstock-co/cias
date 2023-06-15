# Crypto Wallet Manager

# Links
[Arbiscan API docs](https://docs.arbiscan.io/)  |  [BSC Scan API docs](https://docs.bscscan.com/)  |  [Etherscan API docs](https://docs.etherscan.io/)

# Features
- This is a single page app with all data management currently done with React's local state.  Redux is available but unused currently.  There's no backend.
- You can select as many wallets as you wish for generating allocation tables, via the multi-select box on the far left hand side.  
    - When a wallet is `added`, the api will fetch txns and append to the existing set of txns.
    - When wallets are `removed`, the txns are removed from the existing set of txns. 
- Downloaded transactions for each wallet currently consist of `ERC 20 transfers` for 4 tokens:
    1. arb(usdc)
    2. eth(usdc)
    3. eth(usdt)
    4. bsc(busd)
- There are 4 filters for the transaction set:
    1. Type ( member / non-member) - all non-member wallets are listed to filter by
    2. Chain (arb / eth / bsc)
    3. Direction (in / out)
    4. Wallet (pick a single wallet to filter by)
- `Allocation table` is auto generated and can be saved as a PDF via a button click
- `Chain cash flow table` summarizes the total amount of $ and txns that went in/out of the currently selected wallets, serving as a completeness check

# Development: Phase 1

## Main Page

#### Next
- sort transactions by date inside generating table data function so when a wallet is added, its txns are blended in by date.
- add wallet column - so know which wallet a txn is from when multiple wallets are selected
- add `sort by` select box, so can sort by any column.  

#### To Do
- need to get all of the investment move wallet addresses and their contribution windows (from Discord / JP's help), so can generate allocations for them
- "Txn" hyperlink needs to conditionally render depending on chain (currently only works for arb)
- add a `generate distribution` button - 3rd button on main screen - opens a dialog box where you can generate a payout.  Should have an input box for fee%
make the main wallet select a multi-select with chips, and the select box gets wider depending on how many chips (chip width x #chips) + 250px.   The title should display all wallets in a vertical stack.  The api will be a Promise.all that will not return until all data from all wallets has been aggregated from all chains.
- add `uniqueMemberList` to state - could be useful to download this or store into our app the list for allocation purposes, etc
- Make a small copy icon beside each wallet address, enable to copy and paste to clipboard

## Allocation Table
#### Next
- Fix: it's broken right now since adding multiple wallets

#### To Do
- for the vc investment moves (games for a living, etc) --> need a dropdown select of these moves, and a button that can generate an allocation for that move
- Make each wallet address clickable and opens another dialog table with a list of their transactions
- Add another column that has which chains they contributed with and their count in brackets 
- Make PDF size smaller ask ChatGPT how
- Make another text block above the table, maybe in middle, that displays all active filters

## Chain Cash Flow Table
- add current balances and subtract that from net balance, so net should always be zero.
- conditionally render a row red if net isn't equal to 0. Don't make this active if filters are applied that would result in non-zero result.

# Development: Phase 2
- `member portfolio summary` --> only for investment wallet:  track contributions by time window and create dialog pop up when you click a wallet address that summarizes all contributions to different investments with a total


---------

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
# cwm
Crypto wallet manager
