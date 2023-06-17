import { useState, useMemo } from "react";
import { generateAllocationTableData } from "../../lib/functions/wallets";
import { formatAmountDisplay } from "../../lib/functions/wallets";
import { SortAllocationSelect } from "../selectInputs/sortAllocationSelect";
import { StyledTableCell, StyledTableRow, totalRowStyle } from "./styles";
import { printDocument } from "../../lib/functions/pdf";

import {
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableBody,
    DialogActions,
    Button,
    Box
} from "@mui/material";

const AllocationTable = ({ tableData, dialogOpen, setDialogOpen, selectedWallets }) => {
    const [sortBy, setSortBy] = useState("Amount");

    let walletNames;
    if (selectedWallets.length > 1) {
        walletNames = selectedWallets.map((wallet, index) => `(${index + 1}) ${wallet.name}`).join(', ');
    } else {
        walletNames = selectedWallets[0].name;
    }

    const dialogTitle = `Allocations for: ${walletNames}${selectedWallets.length > 1 ? ' (aggregated)' : ''}`;



    const allocationTableData = useMemo(() => {
        return generateAllocationTableData(tableData, selectedWallets);
    }, [selectedWallets, tableData]);

    // const mergeChainMaps = (chainMap1 = [], chainMap2 = []) => {
    //     chainMap1 = Array.isArray(chainMap1) ? chainMap1 : [];
    //     chainMap2 = Array.isArray(chainMap2) ? chainMap2 : [];

    //     const merged = [...chainMap1, ...chainMap2];
    //     const result = {};
    //     merged.forEach(item => {
    //         const [chain, countStr] = item.split('(');
    //         const count = Number(countStr.replace(')', ''));
    //         result[chain] = (result[chain] || 0) + count;
    //     });
    //     return Object.entries(result).map(([chain, count]) => `${chain}(${count})`);
    // };

    const mergeChainMaps = (chainMap1 = [], chainMap2 = []) => {
        chainMap1 = Array.isArray(chainMap1) ? chainMap1 : [];
        chainMap2 = Array.isArray(chainMap2) ? chainMap2 : [];

        const merged = [...chainMap1, ...chainMap2];
        const result = {};
        merged.forEach(item => {
            const [chain, countStr] = item.split('(');
            const count = Number(countStr.replace(')', ''));
            result[chain] = (result[chain] || 0) + count;
        });
        return Object.entries(result).map(([chain, count]) => `${chain}(${count})`);
    };



    const calculateTotal = (array, propertyName) => {
        if (propertyName === "contributionsChainMap" || propertyName === "refundsChainMap") {
            return array.reduce((acc, row) => mergeChainMaps(acc, row[propertyName]), []);
        } else {
            return array.reduce((acc, row) => acc + row[propertyName], 0);
        }
    };

    const totalContributionsAmount = calculateTotal(allocationTableData, 'contributionsAmount');
    const totalContributions = calculateTotal(allocationTableData, 'contributions');
    const totalRefundsAmount = calculateTotal(allocationTableData, 'refundsAmount');
    const totalRefunds = calculateTotal(allocationTableData, 'refunds');
    const totalNetAmount = totalContributionsAmount - totalRefundsAmount;
    const totalTransactions = mergeChainMaps(totalContributions, totalRefunds);

    console.log("TOTAL TRANSACTIONS: ", totalTransactions)

    const allocationTableDataWithShare = useMemo(() => {
        return allocationTableData.map((row) => ({
            ...row,
            share: row.netAmount / totalNetAmount,
            totalTransactions: mergeChainMaps(row.contributionsChainMap, row.refundsChainMap),
        }));
    }, [allocationTableData, totalNetAmount]);


    const handleSortByChange = (value) => {
        setSortBy(value);
    };

    const sortedAllocationTableData = useMemo(() => {
        let sortedData = [...allocationTableDataWithShare];
        if (sortBy === "# of contributions") {
            sortedData.sort((a, b) => b.contributions - a.contributions);
        } else if (sortBy === "Amount") {
            sortedData.sort((a, b) => b.share - a.share);
        }
        return sortedData;
    }, [allocationTableDataWithShare, sortBy]);

    const totalShare = calculateTotal(allocationTableDataWithShare, "share");

    const formatChainData = (chainData) => {
        if (Array.isArray(chainData)) {
            return chainData.join(", ");
        }
        return "";
    };

    return (
        <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            PaperProps={{
                style: {
                    width: '75%', // custom width, you can specify any value
                    maxWidth: 'none', // override maxWidth
                },
            }}
        >
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent style={{ overflowX: 'auto' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Box mb={2}>
                        <div>Total Contributions Amount: {formatAmountDisplay(totalContributionsAmount)}</div>
                        <div>Total Contributions: {totalContributions}</div>
                        <div>Total Refunds Amount: {formatAmountDisplay(totalRefundsAmount)}</div>
                        <div>Total Refunds: {totalRefunds}</div>
                        <div>Total Net Amount: {formatAmountDisplay(totalNetAmount)}</div>
                        <div>Total Transactions: {formatChainData(totalTransactions)}</div>
                    </Box>
                    <Box ml="auto">
                        <SortAllocationSelect sortBy={sortBy} handleSortByChange={handleSortByChange} />
                    </Box>
                </Box>
                <TableContainer component={Paper} id="myTable">
                    <Table sx={{ minWidth: 650 }} aria-label="member table">
                        {/* Render table header */}
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Member Wallet</StyledTableCell>
                                <StyledTableCell align="center">Share (%)</StyledTableCell>
                                <StyledTableCell align="center">Contributions ($)</StyledTableCell>
                                <StyledTableCell align="center"># </StyledTableCell>
                                <StyledTableCell align="center">Refunds ($)</StyledTableCell>
                                <StyledTableCell align="center"># </StyledTableCell>
                                <StyledTableCell align="center">Net ($)</StyledTableCell>
                                <StyledTableCell align="center"># </StyledTableCell>

                            </TableRow>
                        </TableHead>
                        {/* Render table body */}
                        <TableBody>
                            <TableRow>
                                <StyledTableCell component="th" scope="row" style={totalRowStyle}>
                                    Total
                                </StyledTableCell>
                                <StyledTableCell align="center" style={{ fontWeight: "bold", backgroundColor: '#999999', color: totalShare !== 1 ? "red" : "inherit" }}>
                                    {(totalShare * 100).toFixed(2)}%
                                </StyledTableCell>
                                <StyledTableCell align="center" style={totalRowStyle}>{formatAmountDisplay(totalContributionsAmount)}</StyledTableCell>
                                <StyledTableCell align="center" style={totalRowStyle}>{formatChainData(totalContributions)}</StyledTableCell>
                                <StyledTableCell align="center" style={totalRowStyle}>{formatAmountDisplay(totalRefundsAmount)}</StyledTableCell>
                                <StyledTableCell align="center" style={totalRowStyle}>{formatChainData(totalRefunds)}</StyledTableCell>
                                <StyledTableCell align="center" style={totalRowStyle}>{formatAmountDisplay(totalNetAmount)}</StyledTableCell>
                                <StyledTableCell align="center" style={totalRowStyle}>
                                    {formatChainData(totalTransactions) || ""}
                                </StyledTableCell>
                            </TableRow>
                            {sortedAllocationTableData.map((row) => (
                                <StyledTableRow key={row.uniqueMemberWallet} walletType={row.walletType}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.uniqueMemberWallet}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{(row.share * 100).toFixed(2)}%</StyledTableCell>
                                    <StyledTableCell align="center">{formatAmountDisplay(row.contributionsAmount)}</StyledTableCell>
                                    <StyledTableCell align="center">{formatChainData(row.contributionsChainMap)}</StyledTableCell>
                                    <StyledTableCell align="center">{formatAmountDisplay(row.refundsAmount)}</StyledTableCell>
                                    <StyledTableCell align="center">{formatChainData(row.refundsChainMap)}</StyledTableCell>
                                    <StyledTableCell align="center">{formatAmountDisplay(row.netAmount)}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        {totalTransactions && formatChainData(row.totalTransactions)}
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>

                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button onClick={printDocument}>Save as PDF</Button>
                <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AllocationTable;
