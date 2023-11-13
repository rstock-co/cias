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

export const generateAllocationTableData = (tableData, selectedWallets) => {
    if (tableData.length === 0 || selectedWallets.length === 0) return [];
    const selectedAddresses = new Set(selectedWallets.map(wallet => wallet.address.toLowerCase()));

    return tableData.reduce((acc, { from, to, flow, walletDescription, amount, chain, memberName }) => {
        if (!walletDescription.startsWith('Member')) return acc;

        const uniqueMemberWallet = flow === 'In' ? from : to;
        const contributionWallet = flow === 'In' ? to : from;
        const txnType = flow === 'In' ? 'contributions' : 'refunds';

        const data = acc.find(entry => entry.uniqueMemberWallet === uniqueMemberWallet) || {
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
            const counterWalletName = selectedWallets.find(w => w.address === contributionWallet)?.name;
            data.walletTxns[counterWalletName] = (data.walletTxns[counterWalletName] || 0) + 1;
        }

        if (!acc.find(entry => entry.uniqueMemberWallet === uniqueMemberWallet)) {
            acc.push(data);
        }

        return acc;
    }, []);
};

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

        Object.entries(wallet.contributionsChainMap).forEach(([chain, count]) => {
            aggregatedContributionsChainMap[chain] = (aggregatedContributionsChainMap[chain] || 0) + count;
        });

        Object.entries(wallet.refundsChainMap).forEach(([chain, count]) => {
            aggregatedRefundsChainMap[chain] = (aggregatedRefundsChainMap[chain] || 0) + count;
        });

        Object.entries(wallet.walletTxns).forEach(([txn, count]) => {
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
