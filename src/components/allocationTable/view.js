import { useState, useEffect, useMemo } from "react";
import { generateAllocationTableData, calculateTotals, convertTitle } from "../../lib/functions/wallets";
import { formatAmountDisplay, shortenAddress } from "../../lib/functions/wallets";
import { SortAllocationSelect } from "../selectInputs/sortAllocationSelect";
import { StyledTableCell, StyledTableRow, totalRowStyle, totalRowStyleWithBorder } from "./styles";
import { printDocument } from "../../lib/functions/pdf";
// import ToggleButton from '@mui/material/ToggleButton';
// import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Switch from '@mui/material/Switch';
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

const AllocationTable = ({ tableData, dialogOpen, setDialogOpen, selectedWallets, isLoading, move }) => {
    const [sortBy, setSortBy] = useState("Amount");
    const [allocationTableData, setAllocationTableData] = useState([]);
    const [totals, setTotals] = useState({});
    const [showMemberName, setShowMemberName] = useState(false);
    const [showHeaderRow, setShowHeaderRow] = useState(true);

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

    const formatChainArray = (chainMap) => {
        if (chainMap) {
            return chainMap.join(", ");
        }
        return "";
    };

    const handleToggleMemberName = (event) => {
        setShowMemberName(event.target.checked);
    };

    const handleToggleHeaderRow = (event) => {
        setShowHeaderRow(event.target.checked);
    };
  
    const mappedAllocationTableData = useMemo(() => {
        if (!allocationTableData) return [];
        if (allocationTableData.length === 0) return [];
        return allocationTableData.map(row => ({
            ...row,
            share: row.netAmount / totalNetAmount,
        }));
    }, [allocationTableData, totalNetAmount]);

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

    const handleSortByChange = (value) => {
        setSortBy(value);
    };

    const dialogTitle = move
    ? `Allocation Table for: '${move}' Investment`
    : selectedWallets.length > 1
        ? `Aggregated Allocation Table for: ${selectedWallets.map((wallet, index) => `${convertTitle(wallet.name)}`).join(', ')} (${selectedWallets.length} wallets)`
        : `Allocation Table for: '${convertTitle(selectedWallets[0].name)}' Wallet`;

    return (
        <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            PaperProps={{
                style: {
                    width: '80%', // custom width, you can specify any value
                    maxWidth: 'none', // override maxWidth
                    boxShadow: '0 0 10px 3px #199eb0',
                },
            }}
        >
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent style={{ overflowX: 'auto' }}>
                {/* maxHeight: '800px'  */}
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <Box mb={2}>
                        <div>Total Contributions Amount: {totalContributionsAmount && formatAmountDisplay(totalContributionsAmount)}</div>
                        <div>Total Contributions: {formatChainMap(aggregatedContributionsChainMap)}</div>
                        <div>Total Refunds Amount: {totalRefundsAmount && formatAmountDisplay(totalRefundsAmount)}</div>
                        <div>Total Refunds: {formatChainMap(aggregatedRefundsChainMap)}</div>
                        <div>Total Net Amount: {totalNetAmount && formatAmountDisplay(totalNetAmount)}</div>
                        <div>Total Transactions: {formatChainMap(aggregatedTxns)}</div>
                    </Box>
                    <Box sx={{ ml: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end', mb: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 2 }}>
                            <Typography component="div">
                                Show Header Row (Totals)
                            </Typography>
                            <Switch
                                checked={showHeaderRow}
                                onChange={handleToggleHeaderRow}
                                color="primary"
                                inputProps={{ 'aria-label': 'Toggle Header Row' }}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 2 }}>
                            <Typography component="div">
                                Show Member Name
                            </Typography>
                            <Switch
                                checked={showMemberName}
                                onChange={handleToggleMemberName}
                                color="primary"
                                inputProps={{ 'aria-label': 'Toggle Member Name' }}
                            />
                        </Box>
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
                                {showMemberName && (<StyledTableCell>Member Name</StyledTableCell>)}
                                <StyledTableCell align="center">Share (%)</StyledTableCell>
                                <StyledTableCell align="center">Total Net ($)</StyledTableCell>
                                <StyledTableCell align="center" style={selectedWallets.length > 1 ? {} : { borderRight: "1px solid grey" }}>
                                    Total # Txns
                                </StyledTableCell>
                                {selectedWallets.length > 1 && (
                                    <StyledTableCell align="center" style={{ borderRight: "1px solid grey" }}>
                                        # of Txns
                                        <div style={{ whiteSpace: "pre-wrap", fontSize: "15px", fontWeight: 'normal', fontStyle: "italic" }}>(per Wallet)</div>
                                    </StyledTableCell>
                                )}
                                <StyledTableCell align="center">Contributions ($)</StyledTableCell>
                                <StyledTableCell align="center" style={{ borderRight: "1px solid grey" }}>
                                    # of Contributions
                                    <div style={{ whiteSpace: "pre-wrap", fontSize: "15px", fontWeight: 'normal', fontStyle: "italic" }}>(per Chain)</div>
                                </StyledTableCell>
                                <StyledTableCell align="center">Refunds ($)</StyledTableCell>
                                <StyledTableCell align="center" style={{ borderRight: "1px solid grey" }}>
                                    # of Refunds
                                    <div style={{ whiteSpace: "pre-wrap", fontSize: "15px", fontWeight: 'normal', fontStyle: "italic" }}>(per Chain)</div>
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        {/* Render table body */}
                        <TableBody>
                            {showHeaderRow && (
                                <TableRow>
                                    <StyledTableCell component="th" scope="row" style={totalRowStyle}>
                                        Total
                                    </StyledTableCell>
                                    {showMemberName && <StyledTableCell style={totalRowStyle}></StyledTableCell>}
                                    <StyledTableCell align="center" style={{ fontWeight: "bold", backgroundColor: '#999999' }}>
                                        {(totalShare * 100).toFixed(2)}%
                                    </StyledTableCell>
                                    <StyledTableCell align="center" style={totalRowStyle}>{totalTxns && formatAmountDisplay(totalNetAmount)}</StyledTableCell>
                                    <StyledTableCell align="center" style={selectedWallets.length > 1 ? totalRowStyle : { ...totalRowStyle, borderRight: "1px solid #b8b8b8" }}>
                                        {totalTxns}
                                    </StyledTableCell>
                                    {selectedWallets.length > 1 && (
                                        <StyledTableCell align="center" style={totalRowStyleWithBorder}>{formatChainMap(aggregatedTxns)}</StyledTableCell>
                                    )}

                                    <StyledTableCell align="center" style={totalRowStyle}>{totalContributionsAmount && formatAmountDisplay(totalContributionsAmount)}</StyledTableCell>
                                    <StyledTableCell align="center" style={totalRowStyleWithBorder}>{formatChainMap(aggregatedContributionsChainMap)}</StyledTableCell>
                                    <StyledTableCell align="center" style={totalRowStyle}>{totalRefundsAmount && formatAmountDisplay(totalRefundsAmount)}</StyledTableCell>
                                    <StyledTableCell align="center" style={totalRowStyle}>{formatChainMap(aggregatedRefundsChainMap)}</StyledTableCell>
                                </TableRow>
                            )}
                            {sortedAllocationTableData.map((row) => (
                                <StyledTableRow key={row.uniqueMemberWallet} walletType={row.walletType}>
                                    <StyledTableCell component="th" scope="row">
                                        {shortenAddress(row.uniqueMemberWallet)}
                                    </StyledTableCell>
                                    {showMemberName && (
                                        <StyledTableCell component="th" scope="row">
                                            {row.memberName} 
                                        </StyledTableCell>
                                    )}
                                    <StyledTableCell align="center">{(row.share * 100).toFixed(2)}%</StyledTableCell>
                                    <StyledTableCell align="center">{formatAmountDisplay(row.netAmount)}</StyledTableCell>
                                    <StyledTableCell align="center" style={{ borderRight: selectedWallets.length > 1 ? "none" : "1px solid #b8b8b8" }}>{row.net}</StyledTableCell>
                                    {selectedWallets.length > 1 && (
                                        <StyledTableCell align="center" style={{ borderRight: "1px solid #b8b8b8" }}>{formatChainArray(row.walletTxns)}</StyledTableCell>
                                    )}
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
