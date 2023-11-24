import { useState, useEffect, useMemo } from 'react';
import { generateAllocationTableData, calculateTotals, generateSummaryData } from '../../../lib/functions/table';

const BaseUX = ({ 
    tableData, 
    adjustedNetTotal,
    selectedWallets, 
    sortBy,
} = {}) => {    

    const [allocationTableData, setAllocationTableData] = useState([]);
    const [totals, setTotals] = useState({});
    const [summaryData, setSummaryData] = useState({});
    const [sortedAllocationTableData, setSortedAllocationTableData] = useState([]);

    useEffect(() => {
        const allocationData = generateAllocationTableData(tableData, selectedWallets);
        const summaryData = generateSummaryData(tableData, selectedWallets);
        const totals = calculateTotals(allocationData);
        setAllocationTableData(allocationData);
        setSummaryData(summaryData);
        setTotals(totals);
    }, [tableData, selectedWallets]);

    useEffect(() => {
        if (allocationTableData.length === 0) return;

        const mappedData = allocationTableData.map(row => {
            const share = row.netAmount / (totals.totalNetAmount || 1);
            const adjustedNetAmountValue = (adjustedNetTotal && totals.totalNetAmount) ? share * adjustedNetTotal : row.netAmount;
            return { ...row, share, adjustedNetAmount: adjustedNetAmountValue };
        });

        let sortedData = [...mappedData];
        if (sortBy === "# of contributions") {
            sortedData.sort((a, b) => b.contributions - a.contributions);
        } else if (sortBy === "Amount") {
            sortedData.sort((a, b) => b.share - a.share);
        }

        setSortedAllocationTableData(sortedData);
    }, [allocationTableData, totals, adjustedNetTotal, sortBy]);

    const totalShare = useMemo(() => sortedAllocationTableData.reduce((acc, row) => acc + row.share, 0), [sortedAllocationTableData]);

    return {
        ...totals,
        totalShare,
        summaryData,
        sortedAllocationTableData,
    };
}

export default BaseUX;