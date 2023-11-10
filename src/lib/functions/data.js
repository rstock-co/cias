import { FormatTxnLink, formatAmountDecimals, formatAmountDisplay } from "./format";
import { formatTime } from "./time";
import { filterByDateRange } from "./filters";
import { getWalletType, getVCMoveName } from "./wallets";

export const generateTableData = (txn, id, selectedWallets) => {
    const selectedWalletsLowercase = selectedWallets.map(address => address.toLowerCase());
    const amount = formatAmountDecimals(txn.chain, txn.value);
    const walletType = getWalletType(txn, selectedWallets);
    const timestamp = parseInt(txn.timeStamp) * 1000;

    const extractMemberName = (type) => {
        // Regular expression to match the pattern "Member (name)"
        const memberNamePattern = /Member \((.*?)\)/;
        const match = memberNamePattern.exec(type);
        return match && match[1] ? match[1] : "Unknown";
      };
    
    const memberName = extractMemberName(walletType);

    let type = walletType;

    // this can be improved later - this is for identifying moves by their contribution window (ie.  Hypercycle, Finterest, Games for a Living)

    // from: vc investment wallet to: JP's Bybit
    if (txn.from === '0xb79e768bef0ca0a34e53c3fe2ac26e600acf8cca' && txn.to === '0xf534fe3c6061d61458c3f6ca29b2d5ba7855e95d') {
        type = getVCMoveName(walletType, timestamp);
    }

    // from: member wallet to: vc investment wallet
    if (type.startsWith('Member') && txn.to.toLowerCase() === '0xb79e768bef0ca0a34e53c3fe2ac26e600acf8cca'.toLowerCase()) {
        type = `${type} - ${getVCMoveName(walletType, timestamp)}`;
        const memberPattern = /^Member(.*?)( - Member(.*?))?$/;
        const match = type.match(memberPattern);
        if (match) type = `Member${match[1]}`;
    }

    return {
        id,
        wallet: txn.wallet,
        chain: txn.chain,
        timestamp,
        dateTime: formatTime(timestamp, 'America/Denver'),
        link: <FormatTxnLink hash={txn.hash} chain={txn.chain} />,
        from: txn.from,
        to: txn.to,
        walletType: type,
        inout: txn.from && selectedWalletsLowercase.includes(txn.from.toLowerCase()) ? 'Out' : 'In',
        amount,
        amountDisplay: formatAmountDisplay(amount),
        currency: txn.tokenSymbol,
        memberName
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

    return totals;
};

const generateUniqueMemberWalletMap = (tableData, selectedWallets) => {

    if (tableData.length === 0 || selectedWallets.length === 0) return new Map();
    const selectedWalletAddresses = selectedWallets.map(wallet => wallet.address.toLowerCase());

    const uniqueMemberWalletMap = tableData.reduce((map, row) => {
        // data
        const { from, to, walletType, amount, chain, memberName } = row;
        if (!walletType.startsWith('Member')) return map;

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
            memberName,
            amount: uniqueMemberData.amount + Number(amount),
            [`${txnType}s`]: uniqueMemberData[`${txnType}s`] + 1,
            [`${txnType}sAmount`]: uniqueMemberData[`${txnType}sAmount`] + Number(amount),
            [`${txnType}sChainMap`]: updatedChainMap
        });

        return map;
    }, new Map());

    return uniqueMemberWalletMap;

};

export const generateAllocationTableData = (tableData, selectedWallets) => {

    const uniqueMemberWalletsMap = generateUniqueMemberWalletMap(tableData, selectedWallets);

    const allocationTableData = Array.from(uniqueMemberWalletsMap, ([uniqueMemberWallet, {
        amount, contributions, refunds, contributionsAmount, refundsAmount,
        contributionsChainMap, refundsChainMap, walletTxns, memberName
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
            walletTxns: walletTxnsArray,
            memberName
        }
    });

    return allocationTableData;
};


export const generateMemberSummaryTableData = (tableData, memberWallet, moves) => {
    console.log('Starting to generate member summary table data...');

    // Ensure the member wallet address is in lowercase for case-insensitive comparison
    const memberWalletLower = memberWallet.toLowerCase();

    const memberSummary = moves.map(move => {
        console.log(`Processing move: ${move.moveName}`);

        // Filter transactions for each move based on the date range
        const transactions = tableData.filter(txn => {
            const matchesMove = move.contributionOpen && move.contributionClose &&
                                filterByDateRange(move.contributionOpen, move.contributionClose, txn, false);
            return matchesMove;
        });

        console.log("Matching txns: ", transactions)

        // Filter transactions for contributions and refunds specifically for the member wallet (case-insensitive)
        const contributions = transactions.filter(txn => txn.from.toLowerCase() === memberWalletLower);
        const refunds = transactions.filter(txn => txn.to.toLowerCase() === memberWalletLower);

        const totalContributions = contributions.reduce((acc, txn) => acc + parseFloat(txn.amount), 0);
        const totalRefunds = refunds.reduce((acc, txn) => acc + parseFloat(txn.amount), 0);

        console.log(`Move: ${move.moveName}, Contributions: ${contributions.length}, Refunds: ${refunds.length}`);

        // If there are no contributions or refunds for the move, return null (to be filtered out later)
        if (contributions.length === 0 && refunds.length === 0) {
            console.log(`No transactions for move: ${move.moveName}. This move will be excluded from the summary.`);
            return null;
        }

        return {
            moveName: move.moveName,
            token: move.token,
            contributionsCount: contributions.length,
            contributionsTotal: totalContributions,
            refundsCount: refunds.length,
            refundsTotal: totalRefunds,
            transactionsCount: contributions.length + refunds.length,
            netTotal: totalContributions - totalRefunds
        };
    }).filter(moveSummary => moveSummary !== null); // Filter out moves with no transactions for the member

    console.log('Member summary:', memberSummary);
    return {
        memberSummary, // This is the array of summarized move data
        memberWallet // This is the original memberWallet address passed into the function
    };
};

export const generateChainFlowTableData = (data, chain) => {
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