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

const initialTotals = () => ({
    totalTxns: 0, 
    totalContributionsAmount: 0, 
    totalRefundsAmount: 0, 
    totalNetAmount: 0, 
    aggregatedContributionsChainMap: {}, 
    aggregatedRefundsChainMap: {}, 
    aggregatedTxns: {}
});

export const generateAllocationTableData = (tableData, selectedWallets) => {
    if (tableData.length === 0 || selectedWallets.length === 0) return [];
    const selectedAddresses = new Set(selectedWallets.map(wallet => wallet.address.toLowerCase()));

    let allocationTableData = tableData.reduce((acc, { from, to, flow, walletDescription, amount, chain, memberName }) => {
        if (!walletDescription.startsWith('Member')) return acc;

        const uniqueMemberWallet = flow === 'In' ? from : to;
        const contributionWallet = flow === 'In' ? to : from;
        const txnType = flow === 'In' ? 'contributions' : 'refunds';

        const data = acc.find(entry => entry.uniqueMemberWallet === uniqueMemberWallet) || 
        {
            ...getInitialWalletData(),
            uniqueMemberWallet,
            memberName
        };

        data[txnType]++;
        data[`${txnType}Amount`] += amount;
        data[`${txnType}ChainMap`][chain] = (data[`${txnType}ChainMap`][chain] || 0) + 1;
        data.amount += Number(amount);
        data.net = data.contributions + data.refunds;
        data.netAmount = data.contributionsAmount - data.refundsAmount;

        if (selectedAddresses.has(contributionWallet)) {
            let counterWalletName = selectedWallets.find(w => w.address === contributionWallet)?.name;
            // Strip off the part within brackets
            counterWalletName = counterWalletName.replace(/ *\([^)]*\) */g, '');
            data.walletTxns[counterWalletName] = (data.walletTxns[counterWalletName] || 0) + 1;
        }

        if (!acc.find(entry => entry.uniqueMemberWallet === uniqueMemberWallet)) {
            acc.push(data);
        }

        return acc;
    }, []);

    // Filter out entries with a net amount less than $0.50
    allocationTableData = allocationTableData.filter(entry => Math.abs(entry.netAmount) >= 0.50);

    return allocationTableData;
};

// Calculate totals for the allocation table header row

const aggregateCounts = (sourceMap, targetMap) => {
    Object.entries(sourceMap).forEach(([key, count]) => {
        targetMap[key] = (targetMap[key] || 0) + count;
    });
};

export const calculateTotals = (data) => {
    if (!data || data.length === 0) {
        return initialTotals();
    }

    return data.reduce((totals, wallet) => {
        totals.totalContributionsAmount += wallet.contributionsAmount;
        totals.totalRefundsAmount += wallet.refundsAmount;
        totals.totalNetAmount = totals.totalContributionsAmount - totals.totalRefundsAmount;
        totals.totalTxns += wallet.net;

        aggregateCounts(wallet.contributionsChainMap, totals.aggregatedContributionsChainMap);
        aggregateCounts(wallet.refundsChainMap, totals.aggregatedRefundsChainMap);
        aggregateCounts(wallet.walletTxns, totals.aggregatedTxns);

        return totals;
    }, initialTotals());
};

