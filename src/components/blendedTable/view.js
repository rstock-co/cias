import { Paper, Dialog, DialogTitle, DialogContent, TableContainer, Table, TableCell, TableHead, 
    TableRow, TableBody, DialogActions, Button, Box, Typography, 
    FormControl, InputLabel, OutlinedInput, InputAdornment } from "@mui/material";
import { formatAmountDisplay, shortenAddress, formatChainMap, formatChainData, formatAggregatedData } from "../../lib/functions/format";
import { getWalletName, sumObjectValues } from "../../lib/functions/wallets";
import { memberWallets } from "../../lib/data/wallets";
import { TransferWalletSummary, WalletSummary, TransfersTableCell } from "../../elements/templates/tables";
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
    tabTitle,

    aggregateDataForBlendedTable

} = {}) => {
    
    console.log("savedTables:", savedTables);
    console.log("table transfer totals: ",tableTransferTotals)
    console.log("savedTableDisplayData:", savedTableDisplayData);

    console.log("aggregate data for blended table:", aggregateDataForBlendedTable)

    const totalTransferAmount = sumObjectValues(tableTransferTotals)
    const grandTotalNet = adjustedNetTotal !== "" ? Number(adjustedNetTotal) + totalTransferAmount : totalNetAmount + totalTransferAmount;

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
                                    
                                    <StyledTableCell align="center">
                                        All Wallets
                                        <div style={{ whiteSpace: "pre-wrap", fontSize: "15px", fontWeight: 'normal', fontStyle: "italic" }}>(Total Net $)</div>
                                    </StyledTableCell>

                                    <StyledTableCell align="center">
                                        Share
                                        <div style={{ whiteSpace: "pre-wrap", fontSize: "15px", fontWeight: 'normal', fontStyle: "italic" }}>(%)</div>
                                    </StyledTableCell>
                                    
                                    {/* {isAggregated && (
                                        <WideStyledTableCell align="center" style={{ borderRight: "1px solid grey" }}>
                                            Total Net ($)
                                            <div style={{ whiteSpace: "pre-wrap", fontSize: "15px", fontWeight: 'normal', fontStyle: "italic" }}>(per Wallet)</div>
                                        </WideStyledTableCell>
                                    )} */}

                                    <StyledTableCell align="center">
                                        Transfer Wallets Summary
                                        <div style={{ whiteSpace: "pre-wrap", fontSize: "15px", fontWeight: 'normal', fontStyle: "italic" }}>(Total Net $ | Share %)</div>
                                    </StyledTableCell>
                                    
                                    <StyledTableCell align="center" style={{ borderRight: "1px solid grey" }}>
                                        Base Wallet
                                        <div style={{ whiteSpace: "pre-wrap", fontSize: "15px", fontWeight: 'normal', fontStyle: "italic" }}>(Total Net $ | Share %)</div>
                                    </StyledTableCell>
                                    
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

                                        <StyledTableCell align="center" style={{ fontWeight: "bold", backgroundColor: '#b5b5b5'}}>
                                            {totalTxns ? formatAmountDisplay(grandTotalNet) : null}
                                        </StyledTableCell>

                                        <StyledTableCell align="center" style={{ fontWeight: "bold", backgroundColor: '#b5b5b5' }}>
                                            {(totalShare * 100).toFixed(2)}%
                                        </StyledTableCell>

                                        {/* {isAggregated && (
                                            <WideStyledTableCell align="center" style={totalRowStyleWithBorder}>{formatAggregatedData(aggregatedTxns).totalAmounts}</WideStyledTableCell>
                                        )} */}

                                        {/* Transfer Wallets Summary */}
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
                                {Object.entries(aggregateDataForBlendedTable)
                                    .map(([memberWallet, data]) => {
                                        const adjustedNetAmount = Object.values(data).reduce((acc, walletData) => {
                                            return acc + (walletData && walletData.adjustedNetAmount ? walletData.adjustedNetAmount : 0);
                                        }, 0);

                                        // Return an object representing each row, along with calculated adjustedNetAmount
                                        return { memberWallet, data, adjustedNetAmount };
                                    })
                                    .sort((a, b) => b.adjustedNetAmount - a.adjustedNetAmount) // Sort by adjustedNetAmount in descending order
                                    .map(({ memberWallet, data, adjustedNetAmount }) => {
                                        const baseWallet = data.baseWallet;
                                        const share = adjustedNetAmount / grandTotalNet;

                                    return (
                                        <StyledTableRow key={memberWallet}>
                                            <StyledTableCell component="th" scope="row">
                                                {shortenAddress(memberWallet)}
                                            </StyledTableCell>

                                            {showMemberName && (
                                                <StyledTableCell component="th" scope="row">
                                                    {getWalletName(memberWallets, memberWallet)}
                                                </StyledTableCell>
                                            )}

                                            <StyledTableCell align="center">{formatAmountDisplay(adjustedNetAmount)}</StyledTableCell>
                                            <StyledTableCell align="center">{(share * 100).toFixed(2)}%</StyledTableCell>

                                            <StyledTableCell align="center" style={{ maxWidth: '200px' }}>
                                                {TransfersTableCell(data, grandTotalNet)}
                                            </StyledTableCell>


                                            <StyledTableCell align="center">
                                                {baseWallet ? baseWallet.txns : 0}
                                            </StyledTableCell>

                                            {isAggregated && (
                                                <WideStyledTableCell align="center">
                                                    {baseWallet ? formatAggregatedData(baseWallet.walletTxns).txns : 0}
                                                </WideStyledTableCell>
                                            )}

                                            <StyledTableCell align="center">
                                                {baseWallet ? formatAmountDisplay(baseWallet.contributionsAmount) : formatAmountDisplay(0)}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {baseWallet ? formatChainData(baseWallet.contributionsChainMap) : formatChainData({})}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {baseWallet ? formatAmountDisplay(baseWallet.refundsAmount) : formatAmountDisplay(0)}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {baseWallet ? formatChainData(baseWallet.refundsChainMap) : formatChainData({})}
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    );
                                })}

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
