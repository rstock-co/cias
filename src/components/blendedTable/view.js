import { Paper, Dialog, DialogTitle, DialogContent, TableContainer, Table, TableCell, TableHead, 
    TableRow, TableBody, DialogActions, Button, Box, Typography, 
    FormControl, InputLabel, OutlinedInput, InputAdornment, Switch } from "@mui/material";
import { formatAmountDisplay, shortenAddress, formatChainMap, formatChainData, formatAggregatedData } from "../../lib/functions/format";
import { TransferWalletSummary, WalletSummary } from "../../elements/templates/tables";
import { CustomColorSwitch } from "../../elements/toggles/coloredToggle";
import { SortAllocationSelect } from "../../elements/dropdowns/sortAllocationSelect";
import { StyledTableCell, WideStyledTableCell, StyledTableRow, totalRowStyle, totalRowStyleWithBorder, StyledTab, StyledTabs } from "./styles";
import { printAllocationTable } from "../../lib/functions/actions";
import SavedTable from '../savedTable';
import "@fontsource/inter-tight";

const BlendedAllocationTable = ({ 
    dialogOpen, 
    setDialogOpen,
    tabIndex,
    handleTabChange,
    selectedWallets, 
    savedTables,
    setSavedTables,
    filteredBlendedTableIds,
    dialogTitle,
    transferTxnsToBlend,

    totalShare,
    totalTxns, 
    totalContributionsAmount, 
    totalRefundsAmount, 
    totalNetAmount, 
    aggregatedContributionsChainMap, 
    aggregatedRefundsChainMap, 
    aggregatedTxns, 
    sortedAllocationTableData,
    adjustedNetTotal,
    isAggregated,
    generatedDateHTML,

    showHeaderRow,
    showMemberName,
    sortBy,
    handleToggleMemberName,
    handleToggleHeaderRow,
    handleAdjustedNetTotalChange,
    handleSortByChange,
    tableTransferTotals,

    savedTableDisplayData,
    dynamicDialogTitle,
    tabTitle

} = {}) => {
    
    console.log("filteredBlendedTableIds:", filteredBlendedTableIds);
    console.log("savedTables:", savedTables);
    console.log("tabIndex:", tabIndex);
    console.log("table transfer totals: ",tableTransferTotals)

    return (
        <>
        <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            PaperProps={{
                style: {
                    width: '90%',
                    maxWidth: 'none', // need this to override maxWidth
                    boxShadow: '0 0 10px 3px #199eb0',
                },
            }}
            >
            <DialogTitle sx={{fontFamily: 'Inter Tight, sans-serif', fontWeight: 'medium', fontSize: '25px' }}>
                {dynamicDialogTitle}
            </DialogTitle>

            <DialogContent style={{ overflowX: 'auto' }}>
            <StyledTabs value={tabIndex} onChange={handleTabChange}>
                {savedTableDisplayData.map(({ tableId, tableTitle }, index) => (
                    <StyledTab
                        key={tableId}
                        label={<div>Transfer Wallet # {index + 1}<br />{tableTitle}</div>}
                        disableRipple
                    />                 
                ))}
                <StyledTab label={tabTitle} disableRipple />
            </StyledTabs>
            
            {savedTables.length > 0 && (
                tabIndex < filteredBlendedTableIds.length
                ? (
                    <SavedTable 
                        data={savedTables.find(table => table.id === filteredBlendedTableIds[tabIndex])}
                        setSavedTables={setSavedTables}
                        selectedWallets={selectedWallets}
                    />
                )
                : ( <>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', fontFamily: 'Inter Tight, sans-serif' }}>
                        <Box mb={2} mt={2} ml={2}>
                            <WalletSummary
                                walletTitle={dialogTitle}
                                walletType="Blended"
                                totalNetAmount={totalNetAmount} 
                                aggregatedContributionsChainMap={aggregatedContributionsChainMap}
                                totalContributionsAmount={totalContributionsAmount}
                                totalRefundsAmount={totalRefundsAmount}
                                aggregatedRefundsChainMap={aggregatedRefundsChainMap}
                                aggregatedTxns={aggregatedTxns}
                            />
                        </Box>

                    <Box mb={2} mt={2} ml={7} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', fontFamily: 'Inter Tight, sans-serif' }}>
                    {savedTableDisplayData.map(({ tableId, tableTitle, transferTotal }, index) => {
                        // Only render TransferWalletSummary for tables other than the last one
                        if (index <= savedTableDisplayData.length - 1) {
                            return (
                                <TransferWalletSummary
                                    key={tableId}
                                    transferTxnsToBlend={transferTxnsToBlend}
                                    transferTotal={transferTotal}
                                    walletTitle={tableTitle}
                                    walletNumber={index + 1}
                                />
                            );
                        }

                        // Skip rendering for the last table
                        return null;
                    })}
                    </Box>
                        
                    {/* Header inputs and toggles */}
                    <Box sx={{ ml: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end', mb: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 2 }}>
                            <Typography component="div" sx={{fontFamily: 'Inter Tight'}}>
                                Show Totals Row
                            </Typography>
                            <CustomColorSwitch
                                checked={showHeaderRow}
                                onChange={handleToggleHeaderRow}
                                inputProps={{ 'aria-label': 'Toggle Header Row' }}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 2 }}>
                            <Typography component="div" sx={{fontFamily: 'Inter Tight'}}>
                                Show Member Name
                            </Typography>
                            <CustomColorSwitch
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
                                <InputLabel 
                                    htmlFor="outlined-adornment-amount" 
                                    style={{
                                        fontWeight: 'bold', 
                                        color: '#097c8f', 
                                    }}
                                >
                                    Adjusted Net Total
                                </InputLabel>

                                <OutlinedInput
                                    id="outlined-adornment-amount"
                                    variant="outlined"
                                    size="small"
                                    type="number"
                                    value={adjustedNetTotal}
                                    onChange={handleAdjustedNetTotalChange}
                                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                    label="Adjust Total Net Am"
                                    placeholder="Enter adjusted net"
                                    sx={{ margin: "none", maxWidth: 200, fontFamily: 'Inter Tight, sans-serif' }}
                                    InputLabelProps={{
                                        style: {
                                            fontWeight: 'bold', 
                                            color: '#097c8f', 
                                        },
                                    }}
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
                                    <StyledTableCell align="center">Grand Total Net ($)</StyledTableCell>
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
                                        <StyledTableCell align="center" style={{ fontWeight: "bold", backgroundColor: '#b5b5b5' }}>
                                            {(totalShare * 100).toFixed(2)}%
                                        </StyledTableCell>
                                        <StyledTableCell align="center" style={{ fontWeight: "bold", backgroundColor: '#b5b5b5'}}>
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
                    </>)
                    )}
            </DialogContent>
                    
            <DialogActions>
                <Button onClick={printAllocationTable}>Download PDF</Button>
                <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogActions>

        </Dialog>

    </>
    );
};
export default BlendedAllocationTable;
