import "@fontsource/inter-tight";
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, 
    FormControl, InputAdornment, InputLabel, OutlinedInput, Paper, Snackbar, Table, TableBody,
    TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { extractTitle, formatAggregatedData, formatAmountDisplay, formatChainData, formatChainMap, shortenAddress } from "../../lib/functions/format";
import { printBlendedTableToPDF, printTableToPDF } from "../../lib/functions/actions";
import { WalletSummary } from "../../elements/templates/tables";
import { SortAllocationSelect } from "../../elements/dropdowns/sortAllocationSelect";
import { CustomColorSwitch } from "../../elements/toggles/coloredToggle";
import { StyledTableCell, StyledTableRow, WideStyledTableCell, chipStyles, totalRowStyle, totalRowStyleWithBorder } from "./styles";

const HeaderTemplate = ({
    savedTableId,
    showHeaderRow, 
    handleToggleHeaderRow, 
    showMemberName, 
    handleToggleMemberName, 
    sortBy, 
    handleSortByChange, 
    adjustedNetTotal, 
    handleAdjustedNetTotalChange 
}) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '15px', marginRight: '25px' }}> 
        <Box> 
            <Box sx={{ml: 3}}>
                {savedTableId && (
                    <Chip
                        label={`Saved as Table # ${savedTableId}`}
                        sx={chipStyles}
                    />
                )}
            </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', ml: 2 }}>
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
    </Box>
)

const TableTitle = ({ dialogTitle }) => (
    <Typography variant="h6" sx={{ fontFamily: 'Inter', fontWeight: 'bold', fontSize: '27px', border: 'none', marginTop: '15px', marginLeft: '20px', marginBottom: '10px' }}>
        {dialogTitle}
    </Typography>
);

const WalletSummaryTemplate = ({ 
    walletName, 
    netAmount, 
    totalContributions, 
    contributionsAmount, 
    totalRefunds, 
    refundsAmount 
}, index) => (
    <Box mb={0} mt={2} ml={3}>
        <WalletSummary
            key={index}
            id={index}
            walletTitle={walletName}
            walletType="Allocation"
            totalNetAmount={netAmount} 
            aggregatedContributionsChainMap={totalContributions}
            totalContributionsAmount={contributionsAmount}
            totalRefundsAmount={refundsAmount}
            aggregatedRefundsChainMap={totalRefunds}
        />
    </Box>
);

const WalletSummaries = ({summaryData}) => summaryData && summaryData.length > 0 && (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}> 
        {summaryData.map(WalletSummaryTemplate)}
    </Box>
)

const GenerationDate = ({generatedDateString}) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', textAlign: 'right', mb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontFamily: 'Inter Tight', fontWeight: 'bold', fontSize: '16px', textAlign: 'right' }}>
            Generated On:&nbsp;&nbsp;&nbsp;
        </Typography>
        <Typography variant="subtitle1" sx={{ fontFamily: 'Inter Tight', fontWeight: 'regular', fontSize: '18px', textAlign: 'right', marginRight: '15px' }}>
            {generatedDateString}
        </Typography>
    </Box>
)

const SummaryTableHeader = ({
    showMemberName, 
    isAggregated 
}) => (
    <TableHead>
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
)

const SummaryTableTotalsRow = ({
    showHeaderRow, 
    showMemberName, 
    totalShare, 
    totalTxns, 
    adjustedNetTotal, 
    totalNetAmount, 
    isAggregated, 
    aggregatedTxns, 
    totalContributionsAmount, 
    aggregatedContributionsChainMap, 
    totalRefundsAmount, 
    aggregatedRefundsChainMap
}) => 
    showHeaderRow && (
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
            <StyledTableCell align="center" style={isAggregated ? totalRowStyle : { ...totalRowStyle, borderRight: "1px solid grey" }}>
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
    )

const SummaryTable = ({
    showMemberName, 
    isAggregated, 
    showHeaderRow, 
    totalRowStyle, 
    totalShare, 
    totalTxns, 
    adjustedNetTotal, 
    totalNetAmount, 
    totalRowStyleWithBorder, 
    aggregatedTxns, 
    totalContributionsAmount, 
    aggregatedContributionsChainMap, 
    totalRefundsAmount, 
    aggregatedRefundsChainMap, 
    sortedAllocationTableData 
}) => (
    <Table sx={{ border: 'none', tableLayout: 'auto' }} aria-label="member table">
        {SummaryTableHeader({showMemberName, isAggregated })}

        {}
        <TableBody>

            {SummaryTableTotalsRow({showHeaderRow, totalRowStyle, showMemberName, totalShare, totalTxns, adjustedNetTotal, totalNetAmount, isAggregated, totalRowStyleWithBorder, aggregatedTxns, totalContributionsAmount, aggregatedContributionsChainMap, totalRefundsAmount, aggregatedRefundsChainMap})}

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
)

const TableFooterButtons = ({ 
    savedTableId, 
    selectedWallets, 
    move, 
    dialogTitle, 
    saveTableData,
    deleteTableData,
    isAggregated, 
    generatedDateString, 
    sortedAllocationTableData, 
    totalTxns, 
    totalNetAmount, 
    aggregatedContributionsChainMap, 
    aggregatedRefundsChainMap, 
    aggregatedTxns, 
    totalShare, 
    adjustedNetTotal}) => (
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
            <Button onClick={() => {
                isAggregated 
                    ? printBlendedTableToPDF(
                        'allocationTable', 
                        sortedAllocationTableData.length > 15 ? 'portrait' : 'landscape', 
                        sortedAllocationTableData.length > 15 ? 'tabloid' : 'letter', 
                        `${extractTitle(dialogTitle)}.pdf`
                    )
                    : printTableToPDF(
                        'allocationTable', 
                        sortedAllocationTableData.length > 15 ? 'portrait' : 'landscape', 
                        sortedAllocationTableData.length > 15 ? 'tabloid' : 'letter', 
                        `${extractTitle(dialogTitle)}.pdf`
                    )
            }}>
                Download PDF
            </Button>

            <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
    )

const AllocationTable = (props = {}) => {

    const {
        dialogOpen, setDialogOpen, selectedWallets, 
        saveTableSnackbarMessage, saveTableSnackbarOpen, handleCloseSaveTableSnackbar,
        dialogTitle, generatedDateString, isAggregated,
        sortedAllocationTableData, summaryData,
    } = props;

    console.log("allocation table data: ", sortedAllocationTableData)
    console.log("summary data: ", summaryData)
    console.log("selected wallets: ", selectedWallets)
    console.log("dialog title: ", dialogTitle)

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
                {HeaderTemplate(props)}


                <DialogContent style={{ overflowX: 'auto' }}>
                    <TableContainer component={Paper} id="allocationTable" sx={{ border: 'none',  }}>

                        {TableTitle({ dialogTitle })}

                        {WalletSummaries({summaryData})}

                        {GenerationDate({generatedDateString})}

                        {SummaryTable(props)}

                    </TableContainer>
                </DialogContent>

                {TableFooterButtons(props)}

            </Dialog>

            {/* Message renders when the 'Save Table' or 'Delete Table' button is clicked */}
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
