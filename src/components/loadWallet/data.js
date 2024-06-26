import { FormatTxnLink, formatAmountDecimals, formatAmountDisplay } from "../../lib/functions/format";
import { formatTime, getHistoricalPrice } from "../../lib/functions/time";
import { getERC20TxnsArb, getERC20TxnsBase, getERC20TxnsBsc, getERC20TxnsEth, getNormalTxnsArb, getNormalTxnsBase, getNormalTxnsBsc, getNormalTxnsEth } from "../../api";
import { getMoveName, getWalletAddress, getWalletName } from "../../lib/functions/wallets";
import { INDEX_FUND_WALLET, ignoreWallets, memberWallets, teamWallets, tokenContractAddresses, allWallets as wallets } from "../../lib/data/wallets";
import { curry } from "../../lib/functions/fp";
import { logos } from "../../lib"

// erc20 transactions to fetch
export const stableCoinsToFetch = { 
    stableArb: { address: getWalletAddress("usdc-e_arb"), name: "USDC.e", apiCall: getERC20TxnsArb, chain: "arb", loading: false, txns: 0 },
    stableArb2: { address: getWalletAddress("usdc_arb"), name: "USDC", apiCall: getERC20TxnsArb, chain: "arb", loading: false, txns: 0 },
    stableArb3: { address: getWalletAddress("usdc2_arb"), name: "USDC2", apiCall: getERC20TxnsArb, chain: "arb", loading: false, txns: 0 },
    stableArb4: { address: getWalletAddress("usdt_arb"), name: "USDT", apiCall: getERC20TxnsArb, chain: "arb", loading: false, txns: 0 },
    stableEth: { address: getWalletAddress("usdc_eth"), name: "USDC", apiCall: getERC20TxnsEth, chain: "eth", loading: false, txns: 0 },
    stableEth2: { address: getWalletAddress("usdt_eth"), name: "USDT", apiCall: getERC20TxnsEth, chain: "eth", loading: false, txns: 0 },
    stableEth3: { address: getWalletAddress("busd_eth"), name: "BUSD", apiCall: getERC20TxnsEth, chain: "eth", loading: false, txns: 0 },  

    stableBase: { address: getWalletAddress("usdc-base"), name: "USDC", apiCall: getERC20TxnsBase, chain: "base", loading: false, txns: 0 },
    stableBsc: { address: getWalletAddress("busd_bep20"), name: "BUSD", apiCall: getERC20TxnsBsc, chain: "bsc", loading: false, txns: 0 },
    stableBsc2: { address: getWalletAddress("bsc-usd_bep20"), name: "BSC-USD", apiCall: getERC20TxnsBsc, chain: "bsc", loading: false, txns: 0 },
    stableBsc3: { address: getWalletAddress("bsc-usdc_bep20"), name: "BSC-USDC", apiCall: getERC20TxnsBsc, chain: "bsc", loading: false, txns: 0 },
    // Add other stable coins as needed
};

// normal transactions to fetch
export const chainsToFetch = {
    normalEth: { name: "Ethereum", apiCall: getNormalTxnsEth, chain: "eth", loading: false, txns: 0 },
    normalBsc: { name: "Binance Smart Chain", apiCall: getNormalTxnsBsc, chain: "bsc", loading: false, txns: 0 },
    normalArb: { name: "Arbitrum", apiCall: getNormalTxnsArb, chain: "arb", loading: false, txns: 0 },
    normalBase: { name: "Base", apiCall: getNormalTxnsBase, chain: "base", loading: false, txns: 0 },
    // Add other chains as needed
};

// TABLE COLUMNS
export const propertyMap = {
    id: { header: '#', align: 'center' },
    chainLogo: { header: 'Chain', align: 'center' },
    walletName: { header: 'Wallet', align: 'center' }, 
    flow: { header: 'Flow', align: 'center' },
    dateTime: { header: 'Date/Time', align: 'left' },
    link: { header: 'Txn', align: 'center' },
    from: { header: 'From', align: 'left' },
    to: { header: 'To', align: 'left' },
    walletDescription: { header: 'Description', align: 'left' },
    amountDisplay: { header: 'Amount ($)', align: 'center' },
    currency: { header: 'Currency ($)', align: 'center' },
};

// TABLE DATA HELPER FUNCTIONS

const OutFlow = {
    fundingMove: ({ teamWallet, moveName }) => teamWallet ? `Funding "${moveName}" via "${teamWallet.name}"` : null,  // this needs updating, i think team wallets are not moves any more (need to target move walelts
    tokenPurchase: ({ tokenPurchase }) => tokenPurchase ? `Purchase "${tokenPurchase.name}" tokens` : null,
    internalTransfer: ({ to }) => getWalletName(wallets, to) ? `Transfer to ${getWalletName(wallets, to)}` : null,
    memberRefund: ({ toMemberName, moveName }) => {
        let description = toMemberName ? `Member refund (${toMemberName})` : 'Member refund';
        if (moveName !== "Unknown") description += ` - ${moveName}`;
        return description;
    }
};

const InFlow = {
    internalTransfer: ({ from }) => {
        if (from === INDEX_FUND_WALLET.toLowerCase()) return null;  // don't treat index fund wallet contributions as internal transfers, treat them as member contributions
        return getWalletName(wallets, from) ? `Transfer from ${getWalletName(wallets, from)}` : null;
    },
    tokenSale: ({ tokenSale }) => tokenSale ? `Purchase "${tokenSale.name}" tokens` : null,
    memberContribution: ({ fromMemberName, moveName }) => {
        let description = fromMemberName ? `Member contribution (${fromMemberName})` : 'Member contribution';
        if (moveName !== "Unknown") description += ` - ${moveName}`;
        return description;
    }
};

const generateWalletDescription = (flow, to, from, moveName, fromMemberName, toMemberName) => {
    const conditions = flow === 'Out' ? OutFlow : InFlow;
    const teamWallet = teamWallets.find(wallet => wallet.address === to);
    const tokenPurchase = tokenContractAddresses.find(wallet => wallet.address === to);
    const tokenSale = tokenContractAddresses.find(wallet => wallet.address === from);

    const params = {
        to, from, moveName, fromMemberName, toMemberName, teamWallet, tokenPurchase, tokenSale
    };

    const result = Object.values(conditions).find(condition => condition(params));
    return result ? result(params) : ''; // Default description if no condition matched
};

/**
 * Generate the table data for the main table
 * @param {*} txn the raw txn data from the api call
 * @param {*} id 
 * @param {*} selectedWallets the array of wallets selected by the user in the Select Wallet dropdown list
 * @returns formatted txn data for the table
 */

export const generateTableData = (txn, id, selectedAddresses, historicalBNBPrices, historicalETHPrices) => {
    const from = txn.from.toLowerCase();
    const to = txn.to.toLowerCase();
    if (ignoreWallets.some(wallet => wallet.address === from.toLowerCase() || wallet.address === to.toLowerCase())) {
        return null;
    }
    const {walletName} = txn;
    const timestamp = parseInt(txn.timeStamp) * 1000;
    const {hash} = txn;
    const {chain} = txn;
    const txnType = txn.fetchType;
    const currency = txnType === 'erc20' ? txn.tokenSymbol : (chain === 'bsc' ? 'BNB' : 'ETH');
    const chainLogo = (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <img 
                src={logos[chain]} 
                alt={`${chain} logo`} 
                style={{ width: '30px', height: '30px', margin: 'auto' }} 
                className={`spinner-${chain.toLowerCase()}`} 
            />
        </div>
    );
    const dateTime = formatTime(timestamp, 'America/Denver');
    const link = <FormatTxnLink hash={hash} chain={chain} />;
    const amount = formatAmountDecimals(chain, txn.value, txnType, txn.tokenSymbol);
    const amountDisplay = formatAmountDisplay(amount, txnType);
   
    const flow = from && selectedAddresses.includes(from) ? 'Out' : 'In';
    const moveName = getMoveName(timestamp);
    const fromMemberName = getWalletName(memberWallets, from);
    const toMemberName = getWalletName(memberWallets, to);
    const walletDescription = generateWalletDescription(flow, to, from, moveName, fromMemberName, toMemberName);
    const memberName = fromMemberName || toMemberName;

    const historicalPrice = txnType === 'normal' ? getHistoricalPrice(currency, timestamp, historicalBNBPrices, historicalETHPrices) : 'n/a';
    const convertedAmount = txnType === 'normal' ? parseFloat(amount) * parseFloat(historicalPrice) : 'n/a';

    return {

        // displayed in table
        id,
        chainLogo,
        walletName,
        flow,
        dateTime,
        link,
        from,
        to,
        walletDescription,
        amountDisplay,
        currency,

        // not displayed in table
        chain,
        txnType,
        hash,
        timestamp,
        amount,
        memberName,
        moveName,
        historicalPrice,
        convertedAmount
    }
};

const allChains = ['arb', 'base', 'bsc', 'eth'];

const createChainReducerForTableRow = (tableData, tableDataMapper) =>
    (acc, chain) => ({ 
        ...acc, 
        [chain]: tableDataMapper(tableData, chain)
    })

const createChainsReducer = curry((chains, tableDataMapper, tableData) => 
    chains.reduce(createChainReducerForTableRow(tableData, tableDataMapper), {}))

export const calculateTotalTransactionsByChain = 
    createChainsReducer(allChains, (data, chain) => data.filter(row => row.chain.toLowerCase() === chain).length);

export const calculateTotalValueByChain = 
    createChainsReducer(allChains, (data, chain) => data.reduce((total, row) => row.chain.toLowerCase() === chain ? total + parseFloat(row.amount) : total, 0))

