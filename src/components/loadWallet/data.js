import { getERC20TxnsArb, getERC20TxnsBsc, getERC20TxnsEth, getNormalTxnsArb, getNormalTxnsBsc, getNormalTxnsEth } from "../../api";
import { formatAmountDecimals, formatAmountDisplay, FormatTxnLink } from "../../lib/functions/format";
import { getMoveName, getWalletName, getWalletAddress } from "../../lib/functions/wallets";
import { formatTime, getHistoricalPrice } from "../../lib/functions/time";
import { allWallets as wallets, teamWallets, memberWallets, ignoreWallets, tokenContractAddresses } from "../../lib/data/wallets";

// erc20 transactions to fetch
export const stableCoinsToFetch = { 
    stableArb: { address: getWalletAddress("usdc-e_arb"), name: "USDC.e", apiCall: getERC20TxnsArb, chain: "arb", loading: false, txns: 0 },
    stableArb2: { address: getWalletAddress("usdc_arb"), name: "USDC", apiCall: getERC20TxnsArb, chain: "arb", loading: false, txns: 0 },
    stableArb3: { address: getWalletAddress("usdc2_arb"), name: "USDC2", apiCall: getERC20TxnsArb, chain: "arb", loading: false, txns: 0 },
    stableArb4: { address: getWalletAddress("usdt_arb"), name: "USDT", apiCall: getERC20TxnsArb, chain: "arb", loading: false, txns: 0 },
    stableEth: { address: getWalletAddress("usdc_eth"), name: "USDC", apiCall: getERC20TxnsEth, chain: "eth", loading: false, txns: 0 },
    stableEth2: { address: getWalletAddress("usdt_eth"), name: "USDT", apiCall: getERC20TxnsEth, chain: "eth", loading: false, txns: 0 },
    stableBsc: { address: getWalletAddress("busd_bep20"), name: "BUSD", apiCall: getERC20TxnsBsc, chain: "bsc", loading: false, txns: 0 },
    stableBsc2: { address: getWalletAddress("bsc-usd_bep20"), name: "BSC-USD", apiCall: getERC20TxnsBsc, chain: "bsc", loading: false, txns: 0 },
    // Add other stable coins as needed
};

// normal transactions to fetch
export const chainsToFetch = {
    normalEth: { name: "Ethereum", apiCall: getNormalTxnsEth, chain: "eth", loading: false, txns: 0 },
    normalBsc: { name: "Binance Smart Chain", apiCall: getNormalTxnsBsc, chain: "bsc", loading: false, txns: 0 },
    normalArb: { name: "Arbitrum", apiCall: getNormalTxnsArb, chain: "arb", loading: false, txns: 0 },
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
    fundingMove: ({ teamWallet, moveName }) => teamWallet ? `Funding "${moveName}" via "${teamWallet.name}"` : null,
    tokenPurchase: ({ tokenPurchase }) => tokenPurchase ? `Purchase "${tokenPurchase.name}" tokens` : null,
    internalTransfer: ({ to }) => getWalletName(wallets, to) ? `Transfer to ${getWalletName(wallets, to)}` : null,
    memberRefund: ({ toMemberName, moveName }) => {
        let description = toMemberName ? `Member refund (${toMemberName})` : 'Member refund';
        if (moveName !== "Unknown") description += ` - ${moveName}`;
        return description;
    }
};

const InFlow = {
    internalTransfer: ({ from }) => getWalletName(wallets, from) ? `Transfer from ${getWalletName(wallets, from)}` : null,
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

    for (const condition of Object.values(conditions)) {
        const params = {
            to, from, moveName, fromMemberName, toMemberName, teamWallet, tokenPurchase, tokenSale
        };
        const result = condition(params);
        if (result) {
            return result;
        }
    }

    return ''; // Default description if no condition matched
};




/**
 * Generate the table data for the main table
 * @param {*} txn the raw txn data from the api call
 * @param {*} id 
 * @param {*} selectedWallets the array of wallets selected by the user in the Select Wallet dropdown list
 * @returns formatted txn data for the table
 */

const logos = {
    arb: 'https://i.imgur.com/3kJricG.png',
    eth: 'https://i.imgur.com/iPqQBBB.png',
    bsc: 'https://i.imgur.com/a5V7FFD.png',
  };

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
            />
        </div>
    );
    const dateTime = formatTime(timestamp, 'America/Denver');
    const link = <FormatTxnLink hash={hash} chain={chain} />;
    const amount = formatAmountDecimals(chain, txn.value, txnType);
    const amountDisplay = formatAmountDisplay(amount, txnType, chain);
   
    const flow = from && selectedAddresses.includes(from) ? 'Out' : 'In';
    const moveName = getMoveName(timestamp);
    const fromMemberName = getWalletName(memberWallets, from);
    const toMemberName = getWalletName(memberWallets, to);
    const walletDescription = generateWalletDescription(flow, to, from, moveName, fromMemberName, toMemberName);
    const memberName = fromMemberName || toMemberName;

    const historicalPrice = txnType === 'normal' ? getHistoricalPrice(currency, timestamp, historicalBNBPrices, historicalETHPrices) : 'n/a';

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
        historicalPrice
    }
};

export const calculateTotalTransactionsByChain = (tableData) => {
    const chains = ['arb', 'bsc', 'eth'];
    let result = {};
    chains.forEach(chain => {
        result[chain] = tableData.filter(row => row.chain.toLowerCase() === chain).length;
    });
    return result;
}

export const calculateTotalValueByChain = (tableData) => {
    const chains = ['arb', 'bsc', 'eth'];
    let result = {};
    chains.forEach(chain => {
        result[chain] = tableData.reduce((total, row) => row.chain.toLowerCase() === chain ? total + parseFloat(row.amount) : total, 0);
    });
    return result;
};
