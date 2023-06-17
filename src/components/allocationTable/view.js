import { useState, useMemo } from "react";
import { generateAllocationTableData } from "../../lib/functions/wallets";
import { formatAmountDisplay } from "../../lib/functions/wallets";
import { SortAllocationSelect } from "../selectInputs/sortAllocationSelect";
import { StyledTableCell, StyledTableRow, totalRowStyle, totalRowStyleWithBorder } from "./styles";
import { printDocument } from "../../lib/functions/pdf";
import "@fontsource/inter-tight";

import {
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    TableContainer,
    Table,
    TableCell,
    TableHead,
    TableRow,
    TableBody,
    DialogActions,
    Button,
    Box,
    Typography
} from "@mui/material";

const AllocationTable = ({ tableData, dialogOpen, setDialogOpen, selectedWallets }) => {
    const [sortBy, setSortBy] = useState("Amount");

    const convertTitle = (snakeCaseString) => {
        const words = snakeCaseString.split('_');
        const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
        const capitalCasedString = capitalizedWords.join(' ');

        return capitalCasedString;
    };

    const dialogTitle =
        selectedWallets.length > 1
            ? `Aggregated Allocation Table for: ${selectedWallets.map((wallet, index) => `${convertTitle(wallet.name)}`).join(', ')} (${selectedWallets.length} wallets)`
            : `Allocation Table for: '${convertTitle(selectedWallets[0].name)}' Wallet`;


    const { allocationTableData, totalContributionsChainMap, totalRefundsChainMap } = useMemo(() => {
        return generateAllocationTableData(tableData, selectedWallets);
    }, [selectedWallets, tableData]);

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

    const formatChainData = (chainData) => {
        if (Array.isArray(chainData)) {
            return chainData.join(", ");
        }
        return "";
    };

    const formatChainMap = (chainMap) => {
        if (chainMap) {
            return Object.entries(chainMap)
                .map(([chain, count]) => `${chain}(${count})`)
                .join(", ");
        }
        return "";
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
            sortedData.sort((a, b) => b.share - a.share);
        }
        return sortedData;
    }, [allocationTableDataWithShare, sortBy]);

    const totalShare = calculateTotal(allocationTableDataWithShare, "share");



    return (
        <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            PaperProps={{
                style: {
                    width: '75%', // custom width, you can specify any value
                    maxWidth: 'none', // override maxWidth
                    boxShadow: '0 0 10px 3px #199eb0',
                },
            }}
        >
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent style={{ overflowX: 'auto' }}>
                {/* maxHeight: '800px'  */}
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
                <TableContainer component={Paper} id="myTable" sx={{ border: 'none' }}>
                    {/* sx={{ maxHeight: '600px' }} */}
                    <Table sx={{ minWidth: 650, border: 'none' }} aria-label="member table">
                        {/* Render table header */}
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={8}>
                                    <Typography variant="h6" sx={{ fontFamily: 'Inter', fontWeight: 'bold', fontSize: '27px', border: 'none' }}>
                                        {dialogTitle}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <StyledTableCell>Member Wallet</StyledTableCell>
                                <StyledTableCell align="center">Share (%)</StyledTableCell>
                                <StyledTableCell align="center">Total Net ($)</StyledTableCell>
                                <StyledTableCell align="center" style={{ borderRight: "1px solid grey" }}>Total Txns</StyledTableCell>
                                <StyledTableCell align="center">Contributions ($)</StyledTableCell>
                                <StyledTableCell align="center" style={{ borderRight: "1px solid grey" }}># of Contributions</StyledTableCell>
                                <StyledTableCell align="center">Refunds ($)</StyledTableCell>
                                <StyledTableCell align="center"># of Refunds</StyledTableCell>
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
                                <StyledTableCell align="center" style={totalRowStyle}>{formatAmountDisplay(totalNetAmount)}</StyledTableCell>
                                <StyledTableCell align="center" style={totalRowStyleWithBorder}>
                                    {totalTransactions}
                                </StyledTableCell>
                                <StyledTableCell align="center" style={totalRowStyle}>{formatAmountDisplay(totalContributionsAmount)}</StyledTableCell>
                                <StyledTableCell align="center" style={totalRowStyleWithBorder}>{formatChainMap(totalContributionsChainMap)}</StyledTableCell>
                                <StyledTableCell align="center" style={totalRowStyle}>{formatAmountDisplay(totalRefundsAmount)}</StyledTableCell>
                                <StyledTableCell align="center" style={totalRowStyle}>{formatChainMap(totalRefundsChainMap)}</StyledTableCell>
                            </TableRow>
                            {sortedAllocationTableData.map((row) => (
                                <StyledTableRow key={row.uniqueMemberWallet} walletType={row.walletType}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.uniqueMemberWallet}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{(row.share * 100).toFixed(2)}%</StyledTableCell>
                                    <StyledTableCell align="center">{formatAmountDisplay(row.netAmount)}</StyledTableCell>
                                    <StyledTableCell align="center" style={{ borderRight: "1px solid #b8b8b8" }}>{row.net}</StyledTableCell>
                                    <StyledTableCell align="center">{formatAmountDisplay(row.contributionsAmount)}</StyledTableCell>
                                    <StyledTableCell align="center" style={{ borderRight: "1px solid #b8b8b8" }} >{formatChainData(row.contributionsChainMap)}</StyledTableCell>
                                    <StyledTableCell align="center">{formatAmountDisplay(row.refundsAmount)}</StyledTableCell>
                                    <StyledTableCell align="center">{formatChainData(row.refundsChainMap)}</StyledTableCell>

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
