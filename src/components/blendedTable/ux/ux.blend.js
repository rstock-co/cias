import { useState, useEffect } from 'react';
import { sumObjectValues } from '../../../lib/functions/wallets';
import { processBlendedTableData } from '../../../lib/functions/table';

const BlendUX = ({
    savedTables, 
    savedTableDisplayData, 
    sortedAllocationTableData, 
    tableTransferTotals,
    adjustedNetTotal,
    totalNetAmount,
} = {}) => {

    const [aggregateData, setAggregateData] = useState({});

    useEffect(() => {
        const computeAggregateData = () => {
            const newAggregateData = {};
            const totals = {
                baseWallet: { totalNet: 0, totalAdjustedNet: 0, totalShare: 0 },
                totalNet: 0,
                totalAdjustedNet: 0
            };
    
            // Create a map for efficient lookup in sortedAllocationTableData
            const sortedDataMap = sortedAllocationTableData.reduce((acc, item) => {
                acc[item.memberWallet] = item;
                return acc;
            }, {});
    
            // Aggregate data from sortedAllocationTableData (for baseWallet)
            sortedAllocationTableData.forEach(item => {
                if (!newAggregateData[item.memberWallet]) {
                    newAggregateData[item.memberWallet] = { baseWallet: null, totalAdjustedNetAmount: 0, totalNetAmount: 0 };
                }
                const baseWallet = {
                    share: item.share,
                    adjustedNetAmount: item.adjustedNetAmount,
                    netAmount: item.netAmount,
                    txns: item.txns,
                    contributionsAmount: item.contributionsAmount,
                    contributionsChainMap: item.contributionsChainMap,
                    refundsAmount: item.refundsAmount,
                    refundsChainMap: item.refundsChainMap
                };
                newAggregateData[item.memberWallet].baseWallet = baseWallet;
    
                // Update totals for baseWallet
                totals.baseWallet.totalNet += item.netAmount;
                totals.baseWallet.totalAdjustedNet += item.adjustedNetAmount;
                totals.baseWallet.totalShare += item.share;
            });
    
            // Aggregate data from each SavedTable
            savedTables.forEach((table, tableIndex) => {
                const tableDisplay = savedTableDisplayData.find(t => t.tableId === table.id);
    
                table.tableData.forEach(item => {
                    if (!newAggregateData[item.memberWallet]) {
                        newAggregateData[item.memberWallet] = { baseWallet: null, totalAdjustedNetAmount: 0, totalNetAmount: 0 };
                    }
                    const savedWallet = {
                        walletName: tableDisplay ? tableDisplay.tableTitle : 'Unknown',
                        share: item.share,
                        adjustedNetAmount: item.adjustedNetAmount,
                        netAmount: item.netAmount
                    };
                    newAggregateData[item.memberWallet][`savedWallet${tableIndex + 1}`] = savedWallet;

                    // Initialize totals for each savedWallet if not already initialized
                    const savedWalletKey = `savedWallet${tableIndex + 1}`;
                    if (!totals[savedWalletKey]) {
                        totals[savedWalletKey] = { totalNet: 0, totalAdjustedNet: 0, totalShare: 0 };
                    }

                    // Update totals for savedWallets
                    totals[savedWalletKey].totalNet += item.netAmount;
                    totals[savedWalletKey].totalAdjustedNet += item.adjustedNetAmount;
                    totals[savedWalletKey].totalShare += item.share;

                    // Update overall totals
                    totals.totalNet += item.netAmount;
                    totals.totalAdjustedNet += item.adjustedNetAmount;
                });
            });
    
            // Merge additional data from sortedDataMap into aggregateData
            Object.keys(newAggregateData).forEach(wallet => {
                if (sortedDataMap[wallet]) {
                    newAggregateData[wallet].baseWallet = { ...newAggregateData[wallet].baseWallet, ...sortedDataMap[wallet] };
                }
            });
    
            newAggregateData.totals = totals;
            return newAggregateData;
        };
    
        setAggregateData(computeAggregateData());
    }, [savedTables, savedTableDisplayData, sortedAllocationTableData]);
    
    const totalTransferAmount = sumObjectValues(tableTransferTotals)
    const grandTotalNet = adjustedNetTotal !== "" ? Number(adjustedNetTotal) + totalTransferAmount : totalNetAmount + totalTransferAmount;
    const blendedTableData = processBlendedTableData(aggregateData, tableTransferTotals, grandTotalNet);
    
    return {
        aggregateDataForBlendedTable: aggregateData,
        totalTransferAmount,
        grandTotalNet,
        blendedTableData
    }

}

export default BlendUX;