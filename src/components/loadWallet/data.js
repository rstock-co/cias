import { getWalletAddress } from "../../lib/functions/wallets";
import { getERC20TxnsArb } from "../../api/arb";
import { getERC20TxnsBsc } from "../../api/bsc";
import { getERC20TxnsEth } from "../../api/eth";
import { formatAmountDecimals, formatAmountDisplay, FormatTxnLink } from "../../lib/functions/format";
import { formatTime } from "../../lib/functions/time";
import { getMoveName, getWalletName } from "../../lib/functions/wallets";
import { allWallets as wallets, teamWallets, memberWallets, ignoreWallets } from "../../lib/data/wallets";

// STABLE COINS TO FETCH
export const stableCoinsToFetch = { 
    stableArb: { address: getWalletAddress("usdc-e_arb"), name: "USDC.e", apiCall: getERC20TxnsArb, chain: "arb", loading: false, txns: 0 },
    stableArb2: { address: getWalletAddress("usdc_arb"), name: "USDC", apiCall: getERC20TxnsArb, chain: "arb", loading: false, txns: 0 },
    stableArb3: { address: getWalletAddress("usdc2_arb"), name: "USDC2", apiCall: getERC20TxnsArb, chain: "arb", loading: false, txns: 0 },
    stableArb4: { address: getWalletAddress("usdt_arb"), name: "USDT", apiCall: getERC20TxnsArb, chain: "arb", loading: false, txns: 0 },
    stableEth: { address: getWalletAddress("usdc_eth"), name: "USDC", apiCall: getERC20TxnsEth, chain: "eth", loading: false, txns: 0 },
    stableEth2: { address: getWalletAddress("usdt_eth"), name: "USDT", apiCall: getERC20TxnsEth, chain: "eth", loading: false, txns: 0 },
    stableBsc: { address: getWalletAddress("busd_bep20"), name: "BUSD", apiCall: getERC20TxnsBsc, chain: "bsc", loading: false, txns: 0 },
    stableBsc2: { address: getWalletAddress("bsc-usd_bep20"), name: "BSC-USD", apiCall: getERC20TxnsBsc, chain: "bsc", loading: false, txns: 0 },
};

// TABLE COLUMNS
export const propertyMap = {
    id: { header: '#', align: 'center' },
    chain: { header: 'Chain', align: 'center' },
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

const generateWalletDescription = (flow, to, from, moveName, fromMemberName, toMemberName) => {
    let walletDescription = '';
    
    if (flow === 'Out') {
        
        const teamWallet = teamWallets.find(wallet => wallet.address === to);
    
        // funding a move
        if (teamWallet) {
            walletDescription = `Funding "${moveName}" via "${teamWallet.name}"`;
        }
        // internal transfer
        else if (getWalletName(wallets, to)) {
            walletDescription = `Transfer to ${getWalletName(wallets, to)}`;
        }
        // member refund
        else { 
            walletDescription = toMemberName ? `Member refund (${toMemberName})` : 'Member refund';
            if (moveName !== "Unknown") walletDescription += ` - ${moveName}`;
        }
    
    } else if (flow === 'In') {
    
        // internal transfer
        if (getWalletName(wallets, from)) {
            walletDescription = `Transfer from ${getWalletName(wallets, from)}`;
        }
        // member contribution
        else {  
            walletDescription = fromMemberName ? `Member contribution (${fromMemberName})` : 'Member contribution';
            if (moveName !== "Unknown") walletDescription += ` - ${moveName}`;
        }
    }

    return walletDescription;
};


/**
 * Generate the table data for the main table
 * @param {*} txn the raw txn data from the api call
 * @param {*} id 
 * @param {*} selectedWallets the array of wallets selected by the user in the Select Wallet dropdown list
 * @returns formatted txn data for the table
 */

export const generateTableData = (txn, id, selectedAddresses) => {
    const walletName = txn.walletName;
    const timestamp = parseInt(txn.timeStamp) * 1000;
    const hash = txn.hash;
    const chain = txn.chain;
    const dateTime = formatTime(timestamp, 'America/Denver');
    const link = <FormatTxnLink hash={hash} chain={chain} />;
    const amount = formatAmountDecimals(chain, txn.value);
    const amountDisplay = formatAmountDisplay(amount);
    const currency = txn.tokenSymbol;
    
    const from = txn.from.toLowerCase();
    const to = txn.to.toLowerCase();

    if (ignoreWallets.some(wallet => wallet.address === from.toLowerCase() || wallet.address === to.toLowerCase())) {
        return null;
    }
    
    const flow = from && selectedAddresses.includes(from) ? 'Out' : 'In';
    const moveName = getMoveName(timestamp);
    const fromMemberName = getWalletName(memberWallets, from);
    const toMemberName = getWalletName(memberWallets, to);

    const walletDescription = generateWalletDescription(flow, to, from, moveName, fromMemberName, toMemberName);
    const memberName = fromMemberName || toMemberName;

    return {

        // displayed in table
        id,
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
        hash,
        timestamp,
        amount,
        memberName,
        moveName,
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
        result[chain] = tableData.reduce((total, row) => {
            return row.chain.toLowerCase() === chain ? total + parseFloat(row.amount) : total;
        }, 0);
    });
    return result;
};