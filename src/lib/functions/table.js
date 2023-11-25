// ALLOCATION TABLE FUNCTIONS

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

export const generateSummaryData = (tableData, selectedWallets) => {

    // Initialize summaries for each selected wallet
    const walletSummaries = selectedWallets.reduce((acc, wallet) => {
        acc[wallet.name] = {
            walletName: wallet.name,
            netAmount: 0,
            contributions: 0,
            contributionsAmount: 0,
            contributionsChainMap: {},
            refunds: 0,
            refundsAmount: 0,
            refundsChainMap: {},
            txns: 0
        };
        return acc;
    }, {});

    // Process each transaction
    tableData.forEach(transaction => {
        if (txnIsNotRelevant(transaction.walletDescription)) return;

        const {walletName} = transaction;
        const summary = walletSummaries[walletName];

        if (summary) {
            updateMemberWalletData(summary, transaction.flow, transaction.amount, transaction.chain);
        }
    });

    // Convert chain map counts to strings
    Object.values(walletSummaries).forEach(summary => {
        summary.totalContributions = Object.entries(summary.contributionsChainMap)
            .map(([chain, count]) => `${chain}(${count})`)
            .join(', ');
        summary.totalRefunds = Object.entries(summary.refundsChainMap)
            .map(([chain, count]) => `${chain}(${count})`)
            .join(', ');

        // Remove the chain map objects as they are no longer needed
        delete summary.contributionsChainMap;
        delete summary.refundsChainMap;
    });

    return Object.values(walletSummaries);
}


// BLENDED TABLE FUNCTIONS

export const processBlendedTableData = (aggregateDataForBlendedTable, tableTransferTotals, grandTotalNet) => Object.entries(aggregateDataForBlendedTable)
        .map(([memberWallet, data]) => {
            const {baseWallet} = data; 
            const baseWalletContribution = baseWallet ? baseWallet.adjustedNetAmount : 0;
            const savedWalletsContribution = Object.entries(data)
                .filter(([key]) => key.startsWith('savedWallet'))
                .reduce((acc, [walletKey, walletData]) => {
                    const transferIndex = parseInt(walletKey.replace('savedWallet', ''), 10);
                    const transferAmount = tableTransferTotals[transferIndex] || 0;
                    const memberContribution = walletData.share * transferAmount;
                    return acc + memberContribution;
                }, 0);
            const adjustedNetAmount = baseWalletContribution + savedWalletsContribution;
            const share = adjustedNetAmount / grandTotalNet;
            return { memberWallet, data, adjustedNetAmount, share, baseWallet };
        })
        .sort((a, b) => b.adjustedNetAmount - a.adjustedNetAmount)

