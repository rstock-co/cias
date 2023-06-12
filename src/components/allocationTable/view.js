import { useState, useMemo } from "react";

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

import { generateAllocationTableData } from "../../lib/functions/wallets";
import { formatAmountDisplay } from "../../lib/functions/wallets";
import { SortAllocationSelect } from "../selectInputs/sortAllocationSelect";
import { StyledTableCell, StyledTableRow } from "./styles";

const AllocationTable = ({ tableData, dialogOpen, setDialogOpen, selectedWallet }) => {
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

    const allocationTableDataWithShare = useMemo(() => {
        return allocationTableData.map((row) => ({
            ...row,
            share: row.netAmount / totalNetAmount,
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
            sortedData.sort((a, b) => b.contributionsAmount - a.contributionsAmount);
        } else if (sortBy === "Share") {
            sortedData.sort((a, b) => b.share - a.share);
        }
        return sortedData;
    }, [allocationTableDataWithShare, sortBy]);

    return (
        <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            PaperProps={{
                style: {
                    width: '80%', // custom width, you can specify any value
                    maxWidth: 'none', // override maxWidth
                },
            }}
        >
            <DialogTitle>Member Wallet Transactions</DialogTitle>
            <DialogContent style={{ overflowX: 'auto' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Box mb={2}>
                        <div>Total Contributions Amount: {formatAmountDisplay(totalContributionsAmount)}</div>
                        <div>Total Contributions: {totalContributions}</div>
                        <div>Total Refunds Amount: {formatAmountDisplay(totalRefundsAmount)}</div>
                        <div>Total Refunds: {totalRefunds}</div>
                        <div>Total Net Amount: {formatAmountDisplay(totalNetAmount)}</div>
                        <div>Total Transactions: {totalTransactions}</div>
                    </Box>
                    <Box ml="auto">
                        <SortAllocationSelect sortBy={sortBy} handleSortByChange={handleSortByChange} />
                    </Box>
                </Box>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="member table">
                        {/* Render table header */}
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Member Wallet</StyledTableCell>
                                <StyledTableCell align="center">Contributions Amount ($)</StyledTableCell>
                                <StyledTableCell align="center"># of Contributions</StyledTableCell>
                                <StyledTableCell align="center">Refunds Amount ($)</StyledTableCell>
                                <StyledTableCell align="center"># of Refunds</StyledTableCell>
                                <StyledTableCell align="center">Net Amount ($)</StyledTableCell>
                                <StyledTableCell align="center">Net Transactions</StyledTableCell>
                                <StyledTableCell align="center">Share (%)</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        {/* Render table body */}
                        <TableBody>
                            {sortedAllocationTableData.map((row) => (
                                <StyledTableRow key={row.uniqueMemberWallet} walletType={row.walletType}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.uniqueMemberWallet}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{formatAmountDisplay(row.contributionsAmount)}</StyledTableCell>
                                    <StyledTableCell align="center">{row.contributions}</StyledTableCell>
                                    <StyledTableCell align="center">{formatAmountDisplay(row.refundsAmount)}</StyledTableCell>
                                    <StyledTableCell align="center">{row.refunds}</StyledTableCell>
                                    <StyledTableCell align="center">{formatAmountDisplay(row.netAmount)}</StyledTableCell>
                                    <StyledTableCell align="center">{row.contributions + row.refunds}</StyledTableCell>
                                    <StyledTableCell align="center">{(row.share * 100).toFixed(2)}%</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AllocationTable;
