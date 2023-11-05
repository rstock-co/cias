# Crypto Wallet Manager

### Running the app locally

1. Navigate to the project directory on your local machine

2. Run `npm start`

3. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.


### API Documentation
[Arbiscan API docs](https://docs.arbiscan.io/)  |  [BSCscan API docs](https://docs.bscscan.com/)  |  [Etherscan API docs](https://docs.etherscan.io/)

# Overview
- All data management is currently done with React's local state.  
- There's no Redux or backend, 
- Data is fetched from APIs everytime you run the app (or reload your browser).

### Usage
1. Use the multi-select on the far left-hand side to add or remove **wallets** from the current data set.
2. Use the rest of the select boxes to **filter** the data set by date range, chain, type, move, etc.  There is a 'Clear All Filters' button to reset.
3. Use the `Generate Allocations` button to generate an allocation table FROM THE DATASET on the main page.  This means any filters currently applied will be carried over to the Allocation Table.  If multiple wallets are selected, the allocation table will blend them together.
4. Save the Allocation Table as a PDF by clicking the button on the bottom right-hand side.

#### Data Filtering
- There are 5 filters for the txn data set:
    1. Type [member, non-member] - note for non-member wallets you can select a specific wallet to filter by
    2. Chain (arb, eth, bsc)
    3. Direction (in, out)
    4. Wallet (pick a wallet from the data set to filter by)
    5. Date Range (filter to see only data between start and end date)
- Active filters will be highlighed with a yellow glow when they are "ON"
- Note:  There is a button to clear all filters.

#### Data Fetching
- When a wallet is `added`, the api will fetch txns and append to the existing set of txns (+ sort them by date).
- When wallets are `removed`, the txns are removed from the existing set of txns. 
- The API fetches and aggregates all `ERC 20 transfers` for 4 tokens accross 3 chains:
    1. arb(usdc)
    2. eth(usdc)
    3. eth(usdt)
    4. bsc(busd)

#### Data Verification
- The `Chain cash flow table` summarizes the total amount of $ and txns that went in/out of the current txn data set (including currently applied filters), serving as a quick visual completeness check (net should match current wallet balance for each chain).

---------
# Development Roadmap

- need to get all of the investment move wallet addresses and their contribution windows (from Discord / JP's help), so can generate allocations for them
- make a start up page where you can select your wallet and either normal transactions or token (BEP-20) transacations - need to modify API to add support for BEP-20.
- add support for tracking move wallets and vc wallets
- add a `generate distribution` button - on the Generate Allocation dialog screen - opens dialog box where you can generate a payout.  Should have an input box for fee%
- add a copy button beside the wallet addresses so can click to copy and paste into the "filter by wallet"
- Make PDF size smaller somehow
- Save as CSV - would be nice if I need to do additional data work/verify things in Google Sheets
- `member portfolio summary` --> when the current data is filtered only by a member's wallet, button is rendered in UI to 'Generate Member Portfolio'
which displays all moves and amounts and allocations for that member in a new dialog box


---------

# Create React App

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
