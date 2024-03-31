import { adjustments } from "../data/adjustments";
import { mergeAdjustments } from "./adjustments";
import { substitutions } from "../data/substitutions";

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
    normalContributionTxns: [],
    normalRefundTxns: []        
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

const updateMemberData = (data, flow, chain, amount) => {
    const type = flow === 'In' ? 'contributions' : 'refunds';
    data[type]++;
    data[`${type}ChainMap`][chain] = (data[`${type}ChainMap`][chain] || 0) + 1;
    data[`${type}Amount`] += amount;
    data.netAmount += (type === 'contributions' ? amount : -amount);
    data.txns++;
};

const updateMemberNormalData = (memberData, currency, historicalPrice, timestamp, amount, usdAmount, type) => {
    const conversionDate = new Date(timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const transaction = {
        currency,
        historicalPrice,
        conversionDate,
        amount,
        usdAmount,
        type
    };

    const key = type === 'contribution' ? 'normalContributionTxns' : 'normalRefundTxns';
    memberData[key].push(transaction);
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

const applySubstitutions = (allocationData) => {
    const substitutedData = [];
    const mergedData = {};

    allocationData.forEach(memberData => {
        const oldWallet = memberData.memberWallet.toLowerCase();
        const newWallet = substitutions[oldWallet]?.toLowerCase();

        // If there's a substitution
        if (newWallet) {
            // Find if new wallet already exists in allocationData or mergedData
            let newWalletData = allocationData.find(md => md.memberWallet.toLowerCase() === newWallet) || mergedData[newWallet];

            // Prepare newWalletData if it doesn't exist
            if (!newWalletData) {
                newWalletData = {...getInitialWalletData(), memberWallet: newWallet};
                mergedData[newWallet] = newWalletData;
            }

            // Merge data from old wallet to new wallet
            ['contributions', 'refunds'].forEach(key => {
                newWalletData[key] += memberData[key];
                newWalletData[`${key}Amount`] += memberData[`${key}Amount`];
                Object.entries(memberData[`${key}ChainMap`]).forEach(([chain, count]) => {
                    newWalletData[`${key}ChainMap`][chain] = (newWalletData[`${key}ChainMap`][chain] || 0) + count;
                });
            });
            newWalletData.txns += memberData.txns;
            newWalletData.netAmount += memberData.netAmount;
            newWalletData.adjustment += (memberData.adjustment || 0);
            Object.entries(memberData.walletTxns).forEach(([name, {count, totalAmount}]) => {
                if (!newWalletData.walletTxns[name]) newWalletData.walletTxns[name] = { count: 0, totalAmount: 0 };
                newWalletData.walletTxns[name].count += count;
                newWalletData.walletTxns[name].totalAmount += totalAmount;
            });
            // Add substitution info
            newWalletData.substitution = oldWallet;

            // Skip adding the old wallet data to substitutedData
            return;
        }
        
        // Add memberData to substitutedData if no substitution needed
        substitutedData.push(memberData);
    });

    // Merge any newly created wallet data from substitutions into the final array
    substitutedData.push(...Object.values(mergedData));

    return substitutedData;
};

export const generateAllocationTableData = (tableData, selectedWallets) => {

    if (dataIsNotAvailable(tableData, selectedWallets)) return [];

    // === Step 1: Generate allocation table data

    const selectedAddresses = new Set(selectedWallets.map(wallet => wallet.address.toLowerCase()));

    let allocationTableData = tableData.reduce((allocationData, { from, to, flow, walletDescription, amount, chain, memberName, txnType, currency, historicalPrice, convertedAmount, timestamp }) => {
        if (txnIsNotRelevant(walletDescription)) return allocationData;

        const [memberWallet, investmentWallet] = flow === 'In' ? [from, to] : [to, from];
        const memberData = allocationData.find(entry => entry.memberWallet === memberWallet) || {...getInitialWalletData(), memberWallet, memberName, adjustment: 0};

        let usdAmount = txnType === 'normal' ? convertedAmount : amount;

        if (txnType === 'normal') updateMemberNormalData(memberData, currency, historicalPrice, timestamp, amount, usdAmount, flow === 'In' ? 'contribution' : 'refund');
        
        updateMemberData(memberData, flow, chain, usdAmount);
        updateInvestmentWalletData(memberData, investmentWallet, selectedAddresses, selectedWallets, usdAmount, flow);
        
        if (!allocationData.some(entry => entry.memberWallet === memberWallet)) allocationData.push(memberData);

        return allocationData;
    }, []);

    console.log("allocationTableData Step 1: ", allocationTableData);

    
    // === Step 2: Apply adjustments to the allocation table data

    const allAdjustments = mergeAdjustments(adjustments);
    console.log("allAdjustments: ", allAdjustments);

    Object.entries(allAdjustments).forEach(([walletAddress, memberAdjustments]) => {

        if (selectedAddresses.has(walletAddress.toLowerCase())) {

            Object.entries(memberAdjustments).forEach(([memberWalletAddress, adjustmentAmount]) => {
                let memberData = allocationTableData.find(member => member.memberWallet.toLowerCase() === memberWalletAddress.toLowerCase());
                
                // If the member doesn't exist in allocationTableData, create a new entry
                if (!memberData) {
                    memberData = { 
                        ...getInitialWalletData(), 
                        memberWallet: memberWalletAddress, 
                        adjustment: adjustmentAmount
                    };
                    allocationTableData.push(memberData);
                } else {
                    memberData.adjustment += adjustmentAmount;
                }
            });
        }
    });

    // === Step 3: Recalculate net Amount for each member including adjustments
    allocationTableData.forEach(memberData => {
        memberData.netAmount = (memberData.contributionsAmount || 0) + memberData.adjustment - (memberData.refundsAmount || 0);
    });

    // === Step 4: Apply wallet address substitutions
    const finalAllocationData = applySubstitutions(allocationTableData);

    console.log("finalAllocationData Step 4: ", finalAllocationData);

    return finalAllocationData;
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

export const generateSummaryData = (tableData, selectedWallets, fetchType) => {
    // Initialize summaries for each selected wallet
    const walletSummaries = selectedWallets.reduce((acc, wallet) => {
        acc[wallet.name] = {
            walletName: wallet.name,
            fetchType,
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

        const { walletName, flow, chain, amount, currency, historicalPrice, txnType } = transaction;
        const summary = walletSummaries[walletName];

        if (!summary) return;

        // Calculate USD amount for "normal" transactions using historicalPrice
        const isNormalTransaction = txnType === "normal" && currency !== "USD";
        const usdAmount = isNormalTransaction && historicalPrice ? amount * historicalPrice : amount;

        // Update the summary for the corresponding wallet
        const type = flow === 'In' ? 'contributions' : 'refunds';
        summary[type]++;
        summary[`${type}ChainMap`][chain] = (summary[`${type}ChainMap`][chain] || 0) + 1;
        summary[`${type}Amount`] += usdAmount;
        summary.netAmount += (flow === 'In' ? usdAmount : -usdAmount);
        summary.txns++;
    });

    // Convert chain map counts to strings
    Object.values(walletSummaries).forEach(summary => {
        summary.totalContributions = Object.entries(summary.contributionsChainMap)
            .map(([chain, count]) => `${chain}(${count})`).join(', ');
        summary.totalRefunds = Object.entries(summary.refundsChainMap)
            .map(([chain, count]) => `${chain}(${count})`).join(', ');
    });

    return Object.values(walletSummaries);
};




// BLENDED TABLE FUNCTIONS

export const processBlendedTableData = (aggregateDataForBlendedTable, tableTransferTotals, grandTotalNet) => 
    Object.entries(aggregateDataForBlendedTable)
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

