import { getWalletAddress } from "../../lib/functions/wallets";
import { getERC20TxnsArb } from "../../api/arb";
import { getERC20TxnsBsc } from "../../api/bsc";
import { getERC20TxnsEth } from "../../api/eth";
import { formatAmountDecimals, formatAmountDisplay, FormatTxnLink } from "../../lib/functions/format";
import { formatTime } from "../../lib/functions/time";
import { getMoveName, getWalletName } from "../../lib/functions/wallets";
import { allWallets as wallets, intermediaryWallets, memberWallets } from "../../lib/data/wallets";

// STABLE COINS TO FETCH
export const stableCoinsToFetch = { 
    stableArb: { address: getWalletAddress("stable_usdc_arb"), name: "USDC(Arb)", apiCall: getERC20TxnsArb, chain: "arb", loading: false, txns: 0 },
    stableEth: { address: getWalletAddress("stable_usdc_eth"), name: "USDC(Eth)", apiCall: getERC20TxnsEth, chain: "eth", loading: false, txns: 0 },
    stableEth2: { address: getWalletAddress("stable_usdt_eth"), name: "USDT(Eth)", apiCall: getERC20TxnsEth, chain: "eth", loading: false, txns: 0 },
    stableBsc: { address: getWalletAddress("stable_busd_bep20"), name: "BUSD(Bep20)", apiCall: getERC20TxnsBsc, chain: "bsc", loading: false, txns: 0 },
    stableBsc2: { address: getWalletAddress("stable_bsc-usd_bep20"), name: "BSC-USD(Bep20)", apiCall: getERC20TxnsBsc, chain: "bsc", loading: false, txns: 0 },
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

const generateWalletDescription = (flow, to, moveName, fromMemberName, toMemberName) => {
    let walletDescription = '';
    
    if (flow === 'Out') {
        
        const intermediaryWallet = intermediaryWallets.find(wallet => wallet.address.toLowerCase() === to);
    
        // funding a move
        if (intermediaryWallet) {
            walletDescription = `Funding "${moveName}" via "${intermediaryWallet.name}"`;
    
        // member refund
        } else if (toMemberName) { 
            walletDescription = toMemberName ? `Member refund (${toMemberName})` : 'Member refund';
            if (moveName !== "Unknown") walletDescription += ` - ${moveName}`;
    
        // internal transfer
        } else {  
            walletDescription = `Transfer to ${getWalletName(wallets, to)}`;
        }
    
    } else if (flow === 'In') {
    
        // member contribution
        if (fromMemberName) {  
            walletDescription = fromMemberName ? `Member contribution (${fromMemberName})` : 'Member contribution';
            if (moveName !== "Unknown") walletDescription += ` - ${moveName}`;
    
        // internal transfer
        } else {  
            walletDescription = `Transfer from ${getWalletName(wallets, to)}`;
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

export const generateTableData = (txn, id, selectedWallets) => {
    const selectedAddresses = selectedWallets.map(address => address.toLowerCase());
    const walletName = txn.walletName;
    const timestamp = parseInt(txn.timeStamp) * 1000;
    const dateTime = formatTime(timestamp, 'America/Denver');
    const link = <FormatTxnLink hash={txn.hash} chain={txn.chain} />;
    const amount = formatAmountDecimals(txn.chain, txn.value);
    const amountDisplay = formatAmountDisplay(amount);
    const currency = txn.tokenSymbol;
    const chain = txn.chain;
    const from = txn.from.toLowerCase();
    const to = txn.to.toLowerCase();
    
    const flow = from && selectedAddresses.includes(from) ? 'Out' : 'In';
    const moveName = getMoveName(timestamp);
    const fromMemberName = getWalletName(memberWallets, from);
    const toMemberName = getWalletName(memberWallets, to);

    const walletDescription = generateWalletDescription(flow, to, moveName, fromMemberName, toMemberName);
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
}