# Crypto Wallet Manager

### API Documentation
[Arbiscan API docs](https://docs.arbiscan.io/)  |  [BSC Scan API docs](https://docs.bscscan.com/)  |  [Etherscan API docs](https://docs.etherscan.io/)

# Features
- This is a single page app with all data management currently done with React's local state.  Redux is available but unused currently.  There's no backend.
- Use the multi-select on the far left side to add or remove wallets from the current txn data set (used to populate the table on the main screen).
- `Allocation tables` are auto generated with a button click *from the current txn data set (including currently applied filters)* and can be saved as a PDF via a button click.  
*NOTE:  This means if multiple wallets are selected, the allocation table will be based off all the wallets aggregated together.*  

#### Data Filtering
- There are 5 filters for the txn data set:
    1. Type ( member / non-member) - all non-member wallets are listed to filter by
    2. Chain (arb / eth / bsc)
    3. Direction (in / out)
    4. Wallet (pick a single wallet to filter by)
    5. Date Range
- Active filters will be highlighed with a yellow glow when they are "ON"
- Note:  There is a button to clear all filters.


#### Data Fetching

- When a wallet is `added`, the api will fetch txns and append to the existing set of txns (+ sort them by date).
- When wallets are `removed`, the txns are removed from the existing set of txns. 
- Transactions are fetched for each selected wallet (see input on far left side) and currently fetch all `ERC 20 transfers` for 4 tokens:
    1. arb(usdc)
    2. eth(usdc)
    3. eth(usdt)
    4. bsc(busd)

#### Data Verification
- The `Chain cash flow table` summarizes the total amount of $ and txns that went in/out of the current txn data set (including currently applied filters), serving as a quick visual completeness check (net should match current wallet balance for each chain).

# Development: Phase 1

#### Currently Working On
- Improve allocation table

## Main Page

#### Next

- Add "filtered total" amount, and filtered # of txns (below the header) for easy verification of allocations.  it changes to "Grand Total" when filters are cleared / empty.
- "Txn" hyperlink needs to conditionally render depending on chain (currently only works for arb)

#### To Do
- need to get all of the investment move wallet addresses and their contribution windows (from Discord / JP's help), so can generate allocations for them

- add a `generate distribution` button - 3rd button on main screen - opens a dialog box where you can generate a payout.  Should have an input box for fee%
- add `uniqueMemberList` to state - could be useful to download this or store into our app the list for allocation purposes, etc
- Make a small copy icon beside each wallet address, enable to copy and paste to clipboard
- add `sort by` select box, so can sort by any column.

## Allocation Table
#### Next
- Change header to include which wallets the allocation is for
- Add another popup table that opens when you click on a member wallet, which displays all of their txns for the allocation table (to verify)
- Add another column that has which chains they contributed with and their count in brackets
- Add another column for wallets they contributied to with their counts in brackets

#### To Do
- for the vc investment moves (games for a living, etc) --> need a dropdown select of these moves, and a button that can generate an allocation for that move
- Make each wallet address clickable and opens another dialog table with a list of their transactions
 
- Make PDF size smaller
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
