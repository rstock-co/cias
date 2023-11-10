import { useState, useEffect, useMemo } from 'react';
import { generateAllocationTableData, calculateTotals } from '../../../lib/functions/data';

const BaseUX = ({ 
    tableData, 
    adjustedNetTotal,
    selectedWallets, 
    isLoading, 
    sortBy,
} = {}) => {    

    const [allocationTableData, setAllocationTableData] = useState([]);
    const [totals, setTotals] = useState({});

    useEffect(() => {
        if (!isLoading && tableData.length < 900 && selectedWallets.length > 0) {
            setAllocationTableData(generateAllocationTableData(tableData, selectedWallets))
        }
    }, [isLoading, tableData, selectedWallets])

    useEffect(() => {
        if (allocationTableData.length > 0) {
            setTotals(calculateTotals(allocationTableData))
        }
    }, [allocationTableData])

    const { totalTxns, totalContributionsAmount, totalRefundsAmount, totalNetAmount, aggregatedContributionsChainMap, aggregatedRefundsChainMap, aggregatedTxns } = Object.keys(totals).length !== 0 ? totals : {};

    const mappedAllocationTableData = useMemo(() => {
        if (!allocationTableData) return [];
        if (allocationTableData.length === 0) return [];
        return allocationTableData.map(row => ({
            ...row,
            share: row.netAmount / totalNetAmount,
            adjustedNetAmount: (adjustedNetTotal && totalNetAmount) ? (row.netAmount / totalNetAmount) * adjustedNetTotal : row.netAmount
        }));
    }, [allocationTableData, totalNetAmount, adjustedNetTotal]);

    const totalShare = mappedAllocationTableData.reduce((acc, row) => acc + row['share'], 0);

    const sortedAllocationTableData = useMemo(() => {
        if (!mappedAllocationTableData) return [];
        if (mappedAllocationTableData.length === 0) return [];
        let sortedData = [...mappedAllocationTableData];
        if (sortBy === "# of contributions") {
            sortedData.sort((a, b) => b.contributions - a.contributions);
        } else if (sortBy === "Amount") {
            sortedData.sort((a, b) => b.share - a.share);
        }
        return sortedData;
    }, [mappedAllocationTableData, sortBy]);

    return {
        totalTxns,
        totalContributionsAmount,
        totalRefundsAmount,
        totalNetAmount,
        aggregatedContributionsChainMap,
        aggregatedRefundsChainMap,
        aggregatedTxns,

        totalShare,
        sortedAllocationTableData,
    }
}

export default BaseUX;