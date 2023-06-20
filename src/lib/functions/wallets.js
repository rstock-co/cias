import { convertTime } from "./datetime";
import { getNameByAddress } from "../../components/lookup/wallets";
import { checkMoveType } from "./datetime";

export const filterTxns = (txns, { type, filterWallet, chain, dateRange, direction }) => {
    // If initial render, return all txns (check if all filter conditions are not set)
    if (type === '' && filterWallet === '' && chain === '' && (dateRange.startDate === '' || dateRange.endDate === '') && type === '' && direction === '') {
        return txns.filter(txn => txn.amount !== 0).sort((a, b) => b.timestamp - a.timestamp);
    }

    return txns.filter(txn => {
        let matchesFilterWallet = true;
        let matchesChain = true;
        let matchesDateRange = true;
        let matchesDirection = true;
        let matchesType = true;

        // (0) filter out transactions where the amount is zero
        if (txn.amount === 0) return false;

        // (1) filter by filterWallet
        if (filterWallet !== '') {
            matchesFilterWallet = txn.from === filterWallet || txn.to === filterWallet;
        }

        // (2) filter by chain
        if (chain) {
            matchesChain = txn.chain === chain;
        }

        // (3) filter by date range
        if (dateRange && dateRange.startDate && dateRange.endDate) {
            const mstOffsetMillis = 7 * 60 * 60 * 1000;  // Offset in milliseconds for 7 hours

            // Create new Date objects in UTC, subtract offset to convert to MST, then get time in milliseconds
            const startDate = new Date(new Date(dateRange.startDate).getTime() + mstOffsetMillis).getTime();
            const endDate = new Date(new Date(dateRange.endDate).getTime() + mstOffsetMillis).getTime();

            matchesDateRange = txn.timestamp >= startDate && txn.timestamp <= endDate;
        }

        // (4) filter by direction
        if (direction) {
            matchesDirection = txn.inout.toLowerCase() === direction.toLowerCase();
        }

        // (5) filter by type
        if (type) {
            matchesType = txn.walletType === type;
        }

        return matchesFilterWallet && matchesChain && matchesDateRange && matchesDirection && matchesType;
    }).sort((a, b) => b.timestamp - a.timestamp); // sort by timestamp
};


export const getUniqueWallets = txns => {
    return Array.from(
        new Set(txns.flatMap(txn => [txn.to, txn.from]))
    ).filter(wallet => wallet);
};

export const getUniqueTypes = (tableData) => {
    const types = tableData.map(row => row.walletType);
    return [...new Set(types)].filter(type => type);
};

export const convertTitle = (snakeCaseString) => {
    const words = snakeCaseString.split('_');
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    const capitalCasedString = capitalizedWords.join(' ');

    return capitalCasedString;
};

export const formatAmount = (chain, value) => chain === 'bsc' ? value / 1e18 : value / 1e6;

export const formatAmountDisplay = (value) => {
    return value.toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

// need to make this function mulit-chain
const formatTxnLink = (hash) => (
    <a href={`https://arbiscan.io/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="txnLink">
        Txn
    </a>
);

export const getWalletType = (txn, selectedWalletAddresses) => {
    const fromAddress = txn.from.toLowerCase();
    const toAddress = txn.to.toLowerCase();

    const selectedWalletsLowercase = selectedWalletAddresses.map(address => address.toLowerCase());

    if (selectedWalletsLowercase.includes(fromAddress)) {
        return getNameByAddress(txn.to);
    } else if (selectedWalletsLowercase.includes(toAddress)) {
        return getNameByAddress(txn.from);
    }

    return 'Unknown';
};

export const calculateFlow = (data, chain) => {
    const chainData = data.filter(item => item.chain === chain);
    const inTxns = chainData.filter(item => item.inout === "In");
    const outTxns = chainData.filter(item => item.inout === "Out");

    const inflow = inTxns.reduce((acc, cur) => acc + Number(cur.amount), 0);
    const outflow = outTxns.reduce((acc, cur) => acc + Number(cur.amount), 0);
    const netFlow = inflow - outflow;

    const txnsIn = inTxns.length;
    const txnsOut = outTxns.length;

    return {
        chain,
        inflow,
        outflow,
        netFlow,
        txnsIn,
        txnsOut,
        totalTxns: txnsIn + txnsOut
    };
};

export const generateTableData = (txn, id, selectedWallets) => {
    const selectedWalletsLowercase = selectedWallets.map(address => address.toLowerCase());
    const amount = formatAmount(txn.chain, txn.value);
    const walletType = getWalletType(txn, selectedWallets);
    const timestamp = parseInt(txn.timeStamp) * 1000;

    let type = walletType;

    // this can be improved later - this is for identifying moves by their contribution window (ie.  Hypercycle, Finterest, Games FAL)
    // from: investment wallet to: JP's Bybit
    if (txn.from === '0xb79E768bEF0Ca0a34E53c3FE2ac26E600ACf8ccA' && txn.to === '0xf534fe3c6061d61458c3f6ca29b2d5ba7855e95d') {
        type = checkMoveType(walletType, timestamp);
    }

    return {
        id,
        wallet: txn.wallet,
        chain: txn.chain,
        timestamp,
        dateTime: convertTime(timestamp, 'America/Denver'),
        txn: formatTxnLink(txn.hash),
        from: txn.from,
        to: txn.to,
        walletType: type,
        inout: txn.from && selectedWalletsLowercase.includes(txn.from.toLowerCase()) ? 'Out' : 'In',
        amount,
        amountDisplay: formatAmountDisplay(amount),
        currency: txn.tokenSymbol,
    }
};

const getInitialWalletData = () => ({
    amount: 0,
    contributions: 0,
    contributionsAmount: 0,
    contributionsChainMap: {},
    refunds: 0,
    refundsAmount: 0,
    refundsChainMap: {},
    walletTxns: {},
});

export const calculateTotals = (data) => {
    let totalTxns = 0;
    let totalContributionsAmount = 0;
    let totalRefundsAmount = 0;
    let aggregatedContributionsChainMap = {};
    let aggregatedRefundsChainMap = {};
    let aggregatedTxns = {};

    if (!data || data.length === 0) {
        return {
            totalTxns,
            totalContributionsAmount,
            totalRefundsAmount,
            totalNetAmount: 0,
            aggregatedContributionsChainMap,
            aggregatedRefundsChainMap,
            aggregatedTxns,
        };
    }

    data.forEach((wallet) => {
        totalContributionsAmount += wallet.contributionsAmount;
        totalRefundsAmount += wallet.refundsAmount;
        totalTxns += wallet.net;

        wallet.contributionsChainMap.forEach((entry) => {
            let [chain, count] = entry.split('(');
            count = parseInt(count.slice(0, -1)); // remove the closing parenthesis and convert to int
            aggregatedContributionsChainMap[chain] = (aggregatedContributionsChainMap[chain] || 0) + count;
        });

        wallet.refundsChainMap.forEach((entry) => {
            let [chain, count] = entry.split('(');
            count = parseInt(count.slice(0, -1)); // remove the closing parenthesis and convert to int
            aggregatedRefundsChainMap[chain] = (aggregatedRefundsChainMap[chain] || 0) + count;
        });

        wallet.walletTxns.forEach((entry) => {
            let [txn, count] = entry.split('(');
            count = parseInt(count.slice(0, -1)); // remove the closing parenthesis and convert to int
            aggregatedTxns[txn] = (aggregatedTxns[txn] || 0) + count;
        });
    });

    const totals = {
        totalTxns,
        totalContributionsAmount,
        totalRefundsAmount,
        totalNetAmount: totalContributionsAmount - totalRefundsAmount,
        aggregatedContributionsChainMap,
        aggregatedRefundsChainMap,
        aggregatedTxns,
    };

    console.log("TOTALS: ", totals);
    return totals;
};

const generateUniqueMemberWalletMap = (tableData, selectedWallets) => {

    if (tableData.length === 0 || selectedWallets.length === 0) return new Map();
    const selectedWalletAddresses = selectedWallets.map(wallet => wallet.address.toLowerCase());

    const uniqueMemberWalletMap = tableData.reduce((map, row) => {
        // data
        const { from, to, walletType, amount, chain } = row;
        if (walletType !== 'Member') return map;

        const fromWallet = from?.toLowerCase();
        const toWallet = to?.toLowerCase();

        // determine txnType
        const txnType = fromWallet && toWallet && selectedWalletAddresses.includes(toWallet) ? 'contribution' : 'refund';

        // get the unique member's wallet address
        const uniqueMemberWallet = txnType === 'contribution' ? fromWallet : toWallet;

        // get the unique member's data - or - create it if it doesn't exist yet
        const uniqueMemberData = txnType === 'contribution'
            ? map.get(fromWallet) || getInitialWalletData()
            : map.get(toWallet) || getInitialWalletData();

        // update the chain txn counts
        const chainMapProperty = txnType === 'contribution' ? 'contributionsChainMap' : 'refundsChainMap';
        const updatedChainMap = { ...uniqueMemberData[chainMapProperty], [chain]: (uniqueMemberData[chainMapProperty][chain] || 0) + 1 };

        // update wallet counts
        const counterWallet = txnType === 'contribution'
            ? selectedWallets.find(w => w.address.toLowerCase() === toWallet)
            : selectedWallets.find(w => w.address.toLowerCase() === fromWallet);

        if (counterWallet) uniqueMemberData.walletTxns[counterWallet.name] = (uniqueMemberData.walletTxns[counterWallet.name] || 0) + 1;

        map.set(uniqueMemberWallet, {
            ...uniqueMemberData,
            amount: uniqueMemberData.amount + Number(amount),
            [`${txnType}s`]: uniqueMemberData[`${txnType}s`] + 1,
            [`${txnType}sAmount`]: uniqueMemberData[`${txnType}sAmount`] + Number(amount),
            [`${txnType}sChainMap`]: updatedChainMap
        });
        console.log("MEMBER MAP: ", map)
        return map;
    }, new Map());

    return uniqueMemberWalletMap;

};

export const generateAllocationTableData = (tableData, selectedWallets) => {

    const uniqueMemberWalletsMap = generateUniqueMemberWalletMap(tableData, selectedWallets);

    const allocationTableData = Array.from(uniqueMemberWalletsMap, ([uniqueMemberWallet, {
        amount, contributions, refunds, contributionsAmount, refundsAmount,
        contributionsChainMap, refundsChainMap, walletTxns
    }]) => {
        const contributionsChainArray = Object.entries(contributionsChainMap)
            .map(([chain, count]) => `${chain}(${count})`);
        const refundsChainArray = Object.entries(refundsChainMap)
            .map(([chain, count]) => `${chain}(${count})`);
        const walletTxnsArray = Object.entries(walletTxns)
            .map(([wallet, count]) => `${wallet}(${count})`);
        return {
            uniqueMemberWallet,
            amount,
            net: contributions + refunds,
            netAmount: contributionsAmount - refundsAmount,
            contributions,
            refunds,
            contributionsAmount,
            refundsAmount,
            contributionsChainMap: contributionsChainArray,
            refundsChainMap: refundsChainArray,
            walletTxns: walletTxnsArray
        }
    });

    console.log("ALLO DATA: ", allocationTableData)

    return allocationTableData;
};

export const shortenAddress = (address, startLength = 4, endLength = 6) => {
    // Ensure the input is a string
    if (typeof address !== 'string') {
        console.log("Input should be a string");
        return;
    }

    // Ensure the address starts with '0x'
    if (!address.startsWith('0x')) {
        console.log("Address should start with '0x'");
        return;
    }

    // Ensure the address is the correct length
    if (address.length !== 42) {
        console.log("Address should be 42 characters long");
        return;
    }

    // Get the start and end of the address
    const start = address.substring(0, startLength + 2); // add 2 to account for '0x'
    const end = address.substring(address.length - endLength);

    return start + '...' + end;
}