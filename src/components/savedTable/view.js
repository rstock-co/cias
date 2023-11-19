import React, { useState } from "react";
import { Paper, TableContainer, Table, TableCell, TableHead, TableRow, TableBody, Box, Typography, 
        FormControl, InputLabel, OutlinedInput, InputAdornment, Switch } from "@mui/material";
import { formatAmountDisplay, shortenAddress, formatChainMap, formatChainData, formatChainArray } from "../../lib/functions/format";
import { StyledTableCell, WideStyledTableCell, StyledTableRow, totalRowStyle, totalRowStyleWithBorder, RightAlignedTableCell } from "./styles";
import { SortAllocationSelect } from "../selectInputs/sortAllocationSelect";
import "@fontsource/inter-tight";

const SavedTable = ({ 
    // separate props
    selectedWallets, 
    
    // props from ux.base (data object)
    tableData, tableTitle, generatedOnDate,
    totalTxns, totalContributionsAmount, totalRefundsAmount, totalNetAmount, aggregatedContributionsChainMap, 
    aggregatedRefundsChainMap, aggregatedTxns, totalShare, 

} = {}) => {

    const [showMemberName, setShowMemberName] = useState(false);
    const [showHeaderRow, setShowHeaderRow] = useState(true);
    const [adjustedNetTotal, setAdjustedNetTotal] = useState("");
    const [sortBy, setSortBy] = useState("Amount");

    const handleToggleMemberName = (event) => {
        setShowMemberName(event.target.checked);
    };
    
    const handleToggleHeaderRow = (event) => {
        setShowHeaderRow(event.target.checked);
    };
    
    const handleAdjustedNetTotalChange = (event) => {
        setAdjustedNetTotal(event.target.value);
    };

    const handleSortByChange = (value) => {
        setSortBy(value);
    };

    return (
    <>
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
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 2 }}>
                        <SortAllocationSelect sortBy={sortBy} handleSortByChange={handleSortByChange} />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 2 }}>
                        <FormControl fullWidth sx={{ m: 1 }}>
                            <InputLabel htmlFor="outlined-adornment-amount">Adjusted Net Total</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                variant="outlined"
                                size="small"
                                type="number"
                                value={adjustedNetTotal}
                                onChange={handleAdjustedNetTotalChange}
                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                label="Adjust Total Net Investment"
                                placeholder="Enter adjusted net investment"
                                sx={{ margin: "none", maxWidth: 200, fontFamily: 'Inter Tight, sans-serif' }}
                            />
                        </FormControl>
                    </Box>
                </Box>
            </Box>

        <TableContainer component={Paper} id="allocationTable" sx={{ border: 'none' }}>
            {/* sx={{ maxHeight: '600px' }} */}
            <Table sx={{ border: 'none', tableLayout: 'auto' }} aria-label="member table">
                <TableHead>
                    <TableRow>
                        {/* adjust colSpan as needed */}
                        <TableCell colSpan={showMemberName ? 6 : 5} style={{ borderBottom: 'none' }}>
                            <Typography variant="h6" sx={{ fontFamily: 'Inter', fontWeight: 'bold', fontSize: '27px', border: 'none' }}>
                                {tableTitle}
                            </Typography>
                        </TableCell>
                        <TableCell align="right" colSpan={selectedWallets.length > 1 ? 4 : 3} style={{ borderBottom: 'none' }}>
                        <Typography variant="subtitle1" sx={{ fontFamily: 'Inter Tight', fontWeight: 'bold', fontSize: '16px', textAlign: 'right' }}>
                            Generated On:
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontFamily: 'Inter Tight', fontWeight: 'regular', fontSize: '18px', textAlign: 'right' }}>
                            {generatedOnDate}
                        </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <StyledTableCell>Member Wallet</StyledTableCell>
                            {showMemberName && <StyledTableCell>Member Name</StyledTableCell>}
                        <StyledTableCell align="center">Share (%)</StyledTableCell>
                        <StyledTableCell align="center">Total Net ($)</StyledTableCell>
                        <StyledTableCell align="center" style={selectedWallets.length > 1 ? {} : { borderRight: "1px solid grey" }}>
                            Total # Txns
                        </StyledTableCell>
                        {selectedWallets.length > 1 && (
                            <WideStyledTableCell align="center" style={{ borderRight: "1px solid grey" }}>
                                # of Txns
                                <div style={{ whiteSpace: "pre-wrap", fontSize: "15px", fontWeight: 'normal', fontStyle: "italic" }}>(per Wallet)</div>
                            </WideStyledTableCell>
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
                            <StyledTableCell align="center" style={{ fontWeight: "bold", backgroundColor: '#999999'}}>
                                {totalTxns ? formatAmountDisplay(adjustedNetTotal !== "" ? Number(adjustedNetTotal) : totalNetAmount) : null}
                            </StyledTableCell>
                            <StyledTableCell align="center" style={selectedWallets.length > 1 ? totalRowStyle : { ...totalRowStyle, borderRight: "1px solid #b8b8b8" }}>
                                {totalTxns}
                            </StyledTableCell>
                            {selectedWallets.length > 1 && (
                                <WideStyledTableCell align="center" style={totalRowStyleWithBorder}>{formatChainMap(aggregatedTxns)}</WideStyledTableCell>
                            )}

                            <StyledTableCell align="center" style={totalRowStyle}>{totalContributionsAmount && formatAmountDisplay(totalContributionsAmount)}</StyledTableCell>
                            <StyledTableCell align="center" style={totalRowStyleWithBorder}>{formatChainMap(aggregatedContributionsChainMap)}</StyledTableCell>
                            <StyledTableCell align="center" style={totalRowStyle}>{formatAmountDisplay(totalRefundsAmount)}</StyledTableCell>
                            <StyledTableCell align="center" style={totalRowStyle}>{formatChainMap(aggregatedRefundsChainMap)}</StyledTableCell>
                        </TableRow>
                    )}
                    {tableData && tableData.map((row) => (
                        <StyledTableRow key={row.uniqueMemberWallet} walletDescription={row.walletDescription}>
                            <StyledTableCell component="th" scope="row">
                                {shortenAddress(row.uniqueMemberWallet)}
                            </StyledTableCell>
                            {showMemberName && (
                                <StyledTableCell component="th" scope="row">
                                    {row.memberName} 
                                </StyledTableCell>
                            )}
                            <StyledTableCell align="center">{(row.share * 100).toFixed(2)}%</StyledTableCell>
                            <StyledTableCell align="center">{formatAmountDisplay(row.adjustedNetAmount)}</StyledTableCell>
                            <StyledTableCell align="center" style={{ borderRight: selectedWallets.length > 1 ? "none" : "1px solid #b8b8b8" }}>{row.net}</StyledTableCell>
                            {selectedWallets.length > 1 && (
                                <WideStyledTableCell align="center" style={{ borderRight: "1px solid #b8b8b8" }}>{formatChainArray(row.walletTxns)}</WideStyledTableCell>
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
    </>
)};

export default SavedTable;
