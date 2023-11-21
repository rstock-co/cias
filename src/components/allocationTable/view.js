import { Paper, Dialog, DialogTitle, DialogContent, TableContainer, Table, TableCell, TableHead, 
         TableRow, TableBody, DialogActions, Button, Box, Typography, Snackbar, Chip,
         FormControl, InputLabel, OutlinedInput, InputAdornment, Switch } from "@mui/material";
import { formatAmountDisplay, shortenAddress, formatChainMap, formatChainData, formatAggregatedData } from "../../lib/functions/format";
import { SummaryLine } from "../../elements/templates/tables";
import { SortAllocationSelect } from "../../elements/dropdowns/sortAllocationSelect";
import { StyledTableCell, WideStyledTableCell, StyledTableRow, totalRowStyle, totalRowStyleWithBorder, chipStyles } from "./styles";
import { printAllocationTable } from "../../lib/functions/actions";
import "@fontsource/inter-tight";

const AllocationTable = ({ 
    // original props
    dialogOpen, setDialogOpen, selectedWallets, move, saveTableData, deleteTableData, savedTableId,
    saveTableSnackbarMessage, saveTableSnackbarOpen, handleCloseSaveTableSnackbar,
    
    // ux.header
    showMemberName, showHeaderRow, adjustedNetTotal, sortBy, handleToggleMemberName, handleToggleHeaderRow, 
    handleAdjustedNetTotalChange, handleSortByChange, dialogTitle, generatedDateHTML, generatedDateString, isAggregated,

    // ux.base
    totalTxns, totalContributionsAmount, totalRefundsAmount, totalNetAmount, aggregatedContributionsChainMap, 
    aggregatedRefundsChainMap, aggregatedTxns, totalShare, sortedAllocationTableData,

} = {}) => {

    console.log("Aggregated Txns: ", aggregatedTxns)
    console.log("sortedAllocationTableData: ", sortedAllocationTableData)
    return (
    <>
        <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            PaperProps={{
                style: {
                    width: isAggregated ? '90%' : '70%',
                    maxWidth: 'none', // need this to override maxWidth
                    boxShadow: '0 0 10px 3px #199eb0',
                },
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', padding: 0 }}>  
                <DialogTitle sx={{ marginRight: 1 }}>
                    {dialogTitle}
                </DialogTitle>
                {savedTableId && (
                    <Chip
                        label={`Saved as Table # ${savedTableId}`}
                        sx={chipStyles}
                    />
                )}
            </Box>

            <DialogContent style={{ overflowX: 'auto' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', fontFamily: 'Inter Tight, sans-serif' }}>
                    <Box mb={2} mt={3} ml={2}>
                    <SummaryLine label="Total Contributions:" value={formatChainMap(aggregatedContributionsChainMap)} />
                    <SummaryLine label="Total Refunds Amount:" value={totalRefundsAmount && formatAmountDisplay(totalRefundsAmount)} />
                    <SummaryLine label="Total Refunds:" value={formatChainMap(aggregatedRefundsChainMap)} />
                    <SummaryLine label="Total Net Amount:" value={totalNetAmount && formatAggregatedData(aggregatedTxns).totalAmounts} />
                    <SummaryLine label="Total Transactions:" value={formatAggregatedData(aggregatedTxns).txns} />
                </Box>

                    {/* Header inputs and toggles */}
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
                    <Table sx={{ border: 'none', tableLayout: 'auto' }} aria-label="member table">
                        <TableHead>

                            {/* Table title and generation date */}
                            <TableRow>
                                <TableCell colSpan={isAggregated ? 8 : showMemberName ? 7 : 6 } style={{ borderBottom: 'none' }}>
                                    <Typography variant="h6" sx={{ fontFamily: 'Inter', fontWeight: 'bold', fontSize: '27px', border: 'none' }}>
                                        {dialogTitle}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right" colSpan={isAggregated ? 3 : 2} style={{ borderBottom: 'none' }}>
                                <Typography variant="subtitle1" sx={{ fontFamily: 'Inter Tight', fontWeight: 'bold', fontSize: '16px', textAlign: 'right' }}>
                                    Generated On:
                                </Typography>
                                <Typography variant="subtitle1" sx={{ fontFamily: 'Inter Tight', fontWeight: 'regular', fontSize: '18px', textAlign: 'right' }}>
                                    {generatedDateHTML}
                                </Typography>
                                </TableCell>
                            </TableRow>

                            {/* Table header row */}
                            <TableRow>
                                <StyledTableCell>Member Wallet</StyledTableCell>
                                    {showMemberName && <StyledTableCell>Member Name</StyledTableCell>}
                                <StyledTableCell align="center">Share (%)</StyledTableCell>
                                <StyledTableCell align="center">Total Net ($)</StyledTableCell>
                                {isAggregated && (
                                    <WideStyledTableCell align="center" style={{ borderRight: "1px solid grey" }}>
                                        Total Net ($)
                                        <div style={{ whiteSpace: "pre-wrap", fontSize: "15px", fontWeight: 'normal', fontStyle: "italic" }}>(per Wallet)</div>
                                    </WideStyledTableCell>
                                )}
                                <StyledTableCell align="center" style={isAggregated ? {} : { borderRight: "1px solid grey" }}>
                                    Total # Txns
                                </StyledTableCell>
                                {isAggregated && (
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

                        <TableBody>

                            {/* Table totals row (with grey background) */}
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
                                    {isAggregated && (
                                        <WideStyledTableCell align="center" style={totalRowStyleWithBorder}>{formatAggregatedData(aggregatedTxns).totalAmounts}</WideStyledTableCell>
                                    )}
                                    <StyledTableCell align="center" style={isAggregated ? totalRowStyle : { ...totalRowStyle, borderRight: "1px solid #b8b8b8" }}>
                                        {totalTxns}
                                    </StyledTableCell>
                                    {isAggregated && (
                                        <WideStyledTableCell align="center" style={totalRowStyleWithBorder}>{formatAggregatedData(aggregatedTxns).txns}</WideStyledTableCell>
                                    )}

                                    <StyledTableCell align="center" style={totalRowStyle}>{totalContributionsAmount && formatAmountDisplay(totalContributionsAmount)}</StyledTableCell>
                                    <StyledTableCell align="center" style={totalRowStyleWithBorder}>{formatChainMap(aggregatedContributionsChainMap)}</StyledTableCell>
                                    <StyledTableCell align="center" style={totalRowStyle}>{formatAmountDisplay(totalRefundsAmount)}</StyledTableCell>
                                    <StyledTableCell align="center" style={totalRowStyle}>{formatChainMap(aggregatedRefundsChainMap)}</StyledTableCell>
                                </TableRow>
                            )}

                            {/* Table data */}
                            {sortedAllocationTableData && sortedAllocationTableData.map((row) => (
                                <StyledTableRow key={row.memberWallet} walletdescription={row.walletDescription}>
                                    <StyledTableCell component="th" scope="row">
                                        {shortenAddress(row.memberWallet)}
                                    </StyledTableCell>
                                    {showMemberName && (
                                        <StyledTableCell component="th" scope="row">
                                            {row.memberName} 
                                        </StyledTableCell>
                                    )}
                                    <StyledTableCell align="center">{(row.share * 100).toFixed(2)}%</StyledTableCell>
                                    <StyledTableCell align="center">{formatAmountDisplay(row.adjustedNetAmount)}</StyledTableCell>
                                    {isAggregated && (
                                        <WideStyledTableCell align="center" style={{ borderRight: "1px solid #b8b8b8" }}>{formatAggregatedData(row.walletTxns).totalAmounts}</WideStyledTableCell>
                                    )}
                                    <StyledTableCell align="center" style={{ borderRight: isAggregated ? "none" : "1px solid #b8b8b8" }}>{row.txns}</StyledTableCell>
                                    {isAggregated && (
                                        <WideStyledTableCell align="center" style={{ borderRight: "1px solid #b8b8b8" }}>{formatAggregatedData(row.walletTxns).txns}</WideStyledTableCell>
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

            {/* Buttons located below table */}
            <DialogActions>
            {savedTableId && <Button onClick={() => deleteTableData(savedTableId)}>Delete Table</Button>}
                {!savedTableId && 
                    <Button 
                        onClick={
                            () => saveTableData({
                                selectedWallets,
                                move,
                                tableTitle: dialogTitle,
                                isAggregated,
                                generatedOnDate: generatedDateString,
                                tableData: sortedAllocationTableData,
                                totals: {totalTxns, totalContributionsAmount, totalRefundsAmount, totalNetAmount, aggregatedContributionsChainMap, 
                                    aggregatedRefundsChainMap, aggregatedTxns, totalShare},
                                numContributors: sortedAllocationTableData.length, 
                                state: {
                                    adjustedNetTotal: adjustedNetTotal !== "" ? Number(adjustedNetTotal) : totalNetAmount, 
                                    showMemberName: false,
                                    showHeaderRow: false,
                                    sortBy: "Amount",
                                    transferTotal: 0,
                                }
                            })
                        }
                    >
                        Save Table
                    </Button>}
                <Button onClick={printAllocationTable}>Download PDF</Button>
                <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogActions>

        </Dialog>

        {/* Information that renders when the 'Save Table' or 'Delete Table' button is clicked */}
        <Snackbar
            open={saveTableSnackbarOpen}
            autoHideDuration={3000}
            onClose={handleCloseSaveTableSnackbar}
            message={saveTableSnackbarMessage}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            sx={{ '& .MuiSnackbarContent-root': { backgroundColor: '#105c69', fontFamily: 'Inter Tight, sans-serif', fontSize: '20px', boxShadow: '0 0 10px 3px #4ed3e6' } }}
        />
    </>
);
                    };

export default AllocationTable;
