import { useState, useMemo } from "react";
import { generateAllocationTableData } from "../../lib/functions/wallets";

const BaseUX = ({ tableData, selectedWallet }) => {
    const [sortBy, setSortBy] = useState("# of contributions");

    const allocationTableData = useMemo(() => {
        if (selectedWallet && selectedWallet.address) {
            return generateAllocationTableData(tableData, selectedWallet);
        }
        return [];
    }, [selectedWallet, tableData]);

    const totalContributionsAmount = allocationTableData.reduce((acc, row) => acc + row.contributionsAmount, 0);
    const totalContributions = allocationTableData.reduce((acc, row) => acc + row.contributions, 0);
    const totalRefundsAmount = allocationTableData.reduce((acc, row) => acc + row.refundsAmount, 0);
    const totalRefunds = allocationTableData.reduce((acc, row) => acc + row.refunds, 0);
    const totalNetAmount = totalContributionsAmount - totalRefundsAmount;
    const totalTransactions = totalContributions + totalRefunds;

    const handleSortByChange = (value) => {
        setSortBy(value);
    };

    const sortedAllocationTableData = useMemo(() => {
        let sortedData = [...allocationTableData];
        if (sortBy === "# of contributions") {
            sortedData.sort((a, b) => b.contributions - a.contributions);
        } else if (sortBy === "Amount") {
            sortedData.sort((a, b) => b.contributionsAmount - a.contributionsAmount);
        }
        return sortedData;
    }, [allocationTableData, sortBy]);

    return {
        totalContributionsAmount,
        totalContributions,
        totalRefundsAmount,
        totalRefunds,
        totalNetAmount,
        totalTransactions,
        sortedAllocationTableData,
        sortBy,
        handleSortByChange
    }
};

export default BaseUX;