const getInitialWalletData = () => ({
    txns: 0,
    netAmount: 0,
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

const dataIsNotAvailable = (tableData, selectedWallets) => (tableData.length === 0 || selectedWallets.length === 0);
const txnIsNotRelevant = walletDescription => !walletDescription.startsWith('Member');

const updateMemberWalletData = (data, flow, amount, chain) => {

    const txnType = flow === 'In' ? 'contributions' : 'refunds';
    data[txnType]++;
    data[`${txnType}Amount`] += amount;
    data[`${txnType}ChainMap`][chain] = (data[`${txnType}ChainMap`][chain] || 0) + 1;
    data.netAmount += (flow === 'In' ? amount : -amount);
    data.txns ++;
};

const updateInvestmentWalletData = (data, investmentWallet, selectedAddresses, selectedWallets, amount, flow) => {
    if (selectedAddresses.has(investmentWallet)) {
        let investmentWalletName = selectedWallets.find(w => w.address === investmentWallet)?.name;
        investmentWalletName = investmentWalletName.replace(/ *\([^)]*\) */g, '');
        data.walletTxns[investmentWalletName] = data.walletTxns[investmentWalletName] || { count: 0, totalAmount: 0 };
        data.walletTxns[investmentWalletName].count++;
        data.walletTxns[investmentWalletName].totalAmount += (flow === 'In' ? amount : -amount);
    }
};

export const generateAllocationTableData = (tableData, selectedWallets) => {
    if (dataIsNotAvailable(tableData, selectedWallets)) return [];

    const selectedAddresses = new Set(selectedWallets.map(wallet => wallet.address.toLowerCase()));

    const allocationTableData = tableData.reduce((allocationData, { from, to, flow, walletDescription, amount, chain, memberName }) => {
        if (txnIsNotRelevant(walletDescription)) {
            return allocationData;
        }

        const [memberWallet, investmentWallet] = flow === 'In' ? [from, to] : [to, from];

        const memberData = allocationData.find(entry => entry.memberWallet === memberWallet) || {...getInitialWalletData(), memberWallet, memberName};

        updateMemberWalletData(memberData, flow, amount, chain);
        updateInvestmentWalletData(memberData, investmentWallet, selectedAddresses, selectedWallets, amount, flow);

        if (!allocationData.some(entry => entry.memberWallet === memberWallet)) {
            allocationData.push(memberData);
        }

        return allocationData;
    }, [])

    return allocationTableData;
};

// Calculate totals for the allocation table header row

const aggregateCounts = (sourceData, targetData) => {
    for (const key in sourceData) {
        if (typeof sourceData[key] === 'object') {
            if (typeof targetData[key] !== 'object') {
                targetData[key] = {};
            }
            aggregateCounts(sourceData[key], targetData[key]);
        } else if (typeof sourceData[key] === 'number') {
            targetData[key] = (targetData[key] || 0) + sourceData[key];
        }
    }
};

export const calculateTotals = (data) => {
    if (!data || data.length === 0) {
        return initialTotals();
    }

    return data.reduce((totals, wallet) => {
        totals.totalContributionsAmount += wallet.contributionsAmount;
        totals.totalRefundsAmount += wallet.refundsAmount;
        totals.totalNetAmount = totals.totalContributionsAmount - totals.totalRefundsAmount;
        totals.totalTxns += wallet.txns;

        aggregateCounts(wallet.contributionsChainMap, totals.aggregatedContributionsChainMap);
        aggregateCounts(wallet.refundsChainMap, totals.aggregatedRefundsChainMap);
        aggregateCounts(wallet.walletTxns, totals.aggregatedTxns);

        return totals;
    }, initialTotals());
};