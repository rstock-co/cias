import { Paper, Dialog, DialogTitle, DialogContent, TableContainer, Table, TableHead, 
    TableRow, TableBody, DialogActions, Button, Box, Typography, 
    FormControl, InputLabel, OutlinedInput, InputAdornment } from "@mui/material";
import { formatAmountDisplay, shortenAddress, formatChainMap, formatChainData } from "../../lib/functions/format";
import { getWalletName } from "../../lib/functions/wallets";
import { memberWallets } from "../../lib/data/wallets";
import { TransferWalletSummary, WalletSummary, TransfersTableCell, BaseWalletTableCell } from "../../elements/templates/tables";
import { printTableToPDF } from "../../lib/functions/actions";
import { CustomColorSwitch } from "../../elements/toggles/coloredToggle";
import { SortAllocationSelect } from "../../elements/dropdowns/sortAllocationSelect";
import { StyledTableCell, StyledTableRow, totalRowStyle, totalRowStyleWithBorder, StyledTab, StyledTabs } from "./styles";

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
    adjustedNetTotal,
    isAggregated,
    generatedDateString,

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
    tabTitle,

    // ux.blend
    aggregateDataForBlendedTable,
    totalTransferAmount,
    grandTotalNet,
    blendedTableData

} = {}) => {
    
    console.log("savedTables:", savedTables);
    console.log("table transfer totals: ",tableTransferTotals)
    console.log("savedTableDisplayData:", savedTableDisplayData);
    console.log("transferTxnsToBlend:", transferTxnsToBlend)
    console.log("aggregate data for blended table:", aggregateDataForBlendedTable)

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
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    {/* Title on the left */}
                    <Typography sx={{ fontFamily: 'Inter Tight, sans-serif', fontWeight: 'medium', fontSize: '25px', flexShrink: 0 }}>
                        {dynamicDialogTitle}
                    </Typography>

                    {/* Hide these elements based on tabIndex (hide when blended table not selected) */}
                    {tabIndex >= filteredBlendedTableIds.length && (
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                        {/* Show Totals Row */}
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mr: 2 }}>
                            <Typography component="div" sx={{ fontFamily: 'Inter Tight' }}>
                                Show Totals Row
                            </Typography>
                            <CustomColorSwitch
                                checked={showHeaderRow}
                                onChange={handleToggleHeaderRow}
                                inputProps={{ 'aria-label': 'Toggle Header Row' }}
                            />
                        </Box>

                        {/* Show Member Name */}
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mr: 2 }}>
                            <Typography component="div" sx={{ fontFamily: 'Inter Tight' }}>
                                Show Member Name
                            </Typography>
                            <CustomColorSwitch
                                checked={showMemberName}
                                onChange={handleToggleMemberName}
                                color="primary"
                                inputProps={{ 'aria-label': 'Toggle Member Name' }}
                            />
                        </Box>

                        {/* Sort Allocation Select */}
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mr: 2 }}>
                            <SortAllocationSelect sortBy={sortBy} handleSortByChange={handleSortByChange} />
                        </Box>

                        {/* Adjusted Net Total */}
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mr: 2 }}>
                            <FormControl fullWidth sx={{ m: 1 }}>
                                <InputLabel 
                                    htmlFor="outlined-adornment-amount" 
                                    style={{ fontWeight: 'bold', color: '#097c8f' }}
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
                                        style: { fontWeight: 'bold', color: '#097c8f' },
                                    }}
                                />
                            </FormControl>
                        </Box>
                    </Box>
                    )}
                </Box>
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
                    <TableContainer component={Paper} id="blendedTable" sx={{ border: 'none', marginTop: '15px' }}>

                        <Typography variant="h6" sx={{ fontFamily: 'Inter', fontWeight: 'bold', fontSize: '27px', border: 'none', marginTop: '15px', marginLeft: '20px' }}>
                            {dialogTitle}
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap', fontFamily: 'Inter Tight, sans-serif' }}>

                            <Box mb={2} mt={2} ml={3}>
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

                        {savedTableDisplayData.map(({ tableId, tableTitle, transferTotal }, index) => {
                            // Only render TransferWalletSummary for tables other than the last one
                            if (index <= savedTableDisplayData.length - 1) {
                                return (
                                    <Box mb={1} mt={2} ml={2} key={tableId}>
                                        <TransferWalletSummary
                                            transferTxnsToBlend={transferTxnsToBlend}
                                            transferTotal={transferTotal}
                                            walletTitle={tableTitle}
                                            walletNumber={index + 1}
                                        />
                                    </Box>
                                );
                            }

                            // Skip rendering for the last table
                            return null;
                            })}
                        </Box>

                        {/* Generated On Date */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', textAlign: 'right', mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontFamily: 'Inter Tight', fontWeight: 'bold', fontSize: '18px' }}>
                                Generated On:
                            </Typography>
                            <Typography variant="subtitle1" sx={{ fontFamily: 'Inter Tight', fontWeight: 'regular', fontSize: '18px', ml: 1, mr: 2 }}>
                                {generatedDateString}
                            </Typography>
                        </Box>

                        <Table sx={{ border: 'none', tableLayout: 'auto' }} aria-label="member table">
                            <TableHead>

                                {/* Table header row */}
                                <TableRow>
                                    <StyledTableCell sx={{paddingLeft: '25px'}}>&nbsp;&nbsp;&nbsp;Member Wallet</StyledTableCell>

                                    {showMemberName && <StyledTableCell>Member Name</StyledTableCell>}
                                    
                                    <StyledTableCell align="center">
                                        All Wallets
                                        <div style={{ whiteSpace: "pre-wrap", fontSize: "15px", fontWeight: 'normal' }}>Total Net ($)</div>
                                    </StyledTableCell>

                                    <StyledTableCell align="center">
                                        Share (%)
                                        {/* <div style={{ whiteSpace: "pre-wrap", fontSize: "15px", fontWeight: 'normal' }}>%</div> */}
                                    </StyledTableCell>

                                    <StyledTableCell align="center" sx={{borderLeft: "1px solid grey", borderRight: "1px solid grey"}}>
                                        Transfer Wallets Summary
                                        <div style={{ whiteSpace: "pre-wrap", fontSize: "15px", fontWeight: 'normal' }}>Total Net $ &nbsp;|&nbsp; Share %</div>
                                    </StyledTableCell>
                                    
                                    <StyledTableCell align="center" style={{ borderRight: "1px solid grey" }}>
                                        Base Wallet
                                        <div style={{ whiteSpace: "pre-wrap", fontSize: "15px", fontWeight: 'normal' }}>Total Net $ &nbsp;|&nbsp; Share % (# of txns)</div>
                                    </StyledTableCell>
                                    
                                    <StyledTableCell align="center">Contributions ($)</StyledTableCell>

                                    <StyledTableCell align="center" style={{ borderRight: "1px solid grey" }}>
                                        # of Contributions
                                        <div style={{ whiteSpace: "pre-wrap", fontSize: "15px", fontWeight: 'normal' }}>(per Chain)</div>
                                    </StyledTableCell>
                                    
                                    <StyledTableCell align="center">Refunds ($)</StyledTableCell>
                                    
                                    <StyledTableCell align="center" style={{ borderRight: "1px solid grey" }}>
                                        # of Refunds
                                        <div style={{ whiteSpace: "pre-wrap", fontSize: "15px", fontWeight: 'normal' }}>(per Chain)</div>
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

                                        <StyledTableCell align="center" style={{ fontWeight: "bold", backgroundColor: '#b5b5b5'}}>
                                            {totalTxns ? formatAmountDisplay(grandTotalNet) : null}
                                        </StyledTableCell>

                                        <StyledTableCell align="center" style={{ fontWeight: "bold", backgroundColor: '#b5b5b5' }}>
                                            {(totalShare * 100).toFixed(2)}%
                                        </StyledTableCell>

                                        {/* Transfer Wallets Summary */}
                                        <StyledTableCell align="center" sx={{...totalRowStyle, borderLeft: "1px solid grey", borderRight: "1px solid grey"}}>
                                            {formatAmountDisplay(totalTransferAmount)} &nbsp;|&nbsp; {Object.keys(transferTxnsToBlend).length} transfers
                                        </StyledTableCell>

                                        <StyledTableCell align="center" sx={{...totalRowStyle, borderLeft: "1px solid grey", borderRight: "1px solid grey"}}>
                                            {formatAmountDisplay(adjustedNetTotal !== "" ? Number(adjustedNetTotal) : totalNetAmount)} &nbsp;|&nbsp; {(totalShare * 100).toFixed(2)}% &nbsp;({totalTxns} txns)
                                        </StyledTableCell>

                                        <StyledTableCell align="center" style={totalRowStyle}>{totalContributionsAmount && formatAmountDisplay(totalContributionsAmount)}</StyledTableCell>
                                        <StyledTableCell align="center" style={totalRowStyleWithBorder}>{formatChainMap(aggregatedContributionsChainMap)}</StyledTableCell>
                                        <StyledTableCell align="center" style={totalRowStyle}>{formatAmountDisplay(totalRefundsAmount)}</StyledTableCell>
                                        <StyledTableCell align="center" style={totalRowStyle}>{formatChainMap(aggregatedRefundsChainMap)}</StyledTableCell>
                                    </TableRow>
                                )}

                                {/* Table data */}
                                {blendedTableData.map(({ memberWallet, data, adjustedNetAmount, share, baseWallet }) => (

                                        <StyledTableRow key={memberWallet}>
                                            <StyledTableCell component="th" scope="row">
                                            {'\u00A0\u00A0\u00A0' + shortenAddress(memberWallet)}
                                            </StyledTableCell>

                                            {showMemberName && (
                                                <StyledTableCell component="th" scope="row">
                                                    {getWalletName(memberWallets, memberWallet)}
                                                </StyledTableCell>
                                            )}

                                            <StyledTableCell align="center">{formatAmountDisplay(adjustedNetAmount)}</StyledTableCell>
                                            <StyledTableCell align="center">{(share * 100).toFixed(2)}%</StyledTableCell>

                                            {/* Transfer Wallets Summary */}
                                            <StyledTableCell align="center" style={{ width: '275px', paddingRight: '25px', borderLeft: "1px solid #b8b8b8", borderRight: "1px solid #b8b8b8"}}>
                                                {TransfersTableCell(data, tableTransferTotals)}
                                            </StyledTableCell>

                                            <StyledTableCell align="center" sx={{borderLeft: "1px solid #b8b8b8", borderRight: "1px solid #b8b8b8"}}>
                                                {baseWallet ? BaseWalletTableCell(baseWallet) : 'No contributions'}
                                            </StyledTableCell>

                                            <StyledTableCell align="center" >
                                                {baseWallet ? formatAmountDisplay(baseWallet.contributionsAmount) : formatAmountDisplay(0)}
                                            </StyledTableCell>
                                            <StyledTableCell align="center" sx={{borderRight: "1px solid #b8b8b8"}}>
                                                {baseWallet ? formatChainData(baseWallet.contributionsChainMap) : formatChainData({})}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {baseWallet ? formatAmountDisplay(baseWallet.refundsAmount) : formatAmountDisplay(0)}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {baseWallet ? formatChainData(baseWallet.refundsChainMap) : formatChainData({})}
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}

                            </TableBody>
                        </Table>
                    </TableContainer>
                    </>)
                    )}
            </DialogContent>
                    
            <DialogActions>
                <Button onClick={() => printTableToPDF('blendedTable', 'portrait', 'tabloid', 'blended-table.pdf', true, 2)}>Download PDF</Button>
                <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogActions>

        </Dialog>

    </>
    );
};
export default BlendedAllocationTable;