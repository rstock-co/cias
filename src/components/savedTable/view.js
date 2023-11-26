import "@fontsource/inter-tight";
import { Box, FormControl , InputAdornment, InputLabel, OutlinedInput, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography  } from '@mui/material';
import { StyledTableCell, StyledTableRow, WideStyledTableCell, totalRowStyle, totalRowStyleWithBorder } from "./styles";
import { formatAggregatedData, formatAmountDisplay, formatChainData, formatChainMap, shortenAddress } from "../../lib/functions/format";
import { SortAllocationSelect } from "../../elements/dropdowns";
import Switch from '@mui/material/Switch';

const SavedTable = ({ 
    // separate props
    
    // props from ux.base (data object)
    id, tableData, tableTitle, generatedOnDate, isAggregated,
    totalTxns, totalContributionsAmount, totalRefundsAmount, totalNetAmount, aggregatedContributionsChainMap, 
    aggregatedRefundsChainMap, aggregatedTxns, totalShare, state,
    headerStateSetters

} = {}) => (
    <>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <Box mb={2}>
                <div>Total Contributions Amount: {totalContributionsAmount && formatAmountDisplay(totalContributionsAmount)}</div>
                <div>Total Contributions: {formatChainMap(aggregatedContributionsChainMap)}</div>
                <div>Total Refunds Amount: {totalRefundsAmount && formatAmountDisplay(totalRefundsAmount)}</div>
                <div>Total Refunds: {formatChainMap(aggregatedRefundsChainMap)}</div>
                <div>Total Net Amount: {totalNetAmount && formatAggregatedData(aggregatedTxns).totalAmounts}</div>
                <div>Total Transactions: {formatAggregatedData(aggregatedTxns).txns}</div>
            </Box>

            {/* Header inputs and toggles */}
            <Box sx={{ ml: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end', mb: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 2 }}>
                    <Typography component="div">
                        Show Header Row (Totals)
                    </Typography>
                    <Switch
                        checked={state.showHeaderRow}
                        onChange={(e) => headerStateSetters(id).toggleHeaderRow(e.target.checked)}
                        color="primary"
                        inputProps={{ 'aria-label': 'Toggle Header Row' }}
                    />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 2 }}>
                    <Typography component="div">
                        Show Member Name
                    </Typography>
                    <Switch
                        checked={state.showMemberName}
                        onChange={(e) => headerStateSetters(id).toggleMemberName(e.target.checked)}
                        color="primary"
                        inputProps={{ 'aria-label': 'Toggle Member Name' }}
                    />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 2 }}>
                    <SortAllocationSelect sortBy={state.sortBy} handleSortByChange={(value) => headerStateSetters(id).sortBy(value)} />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 2 }}>
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel htmlFor="outlined-adornment-amount">Adjusted Net Total</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-amount"
                            variant="outlined"
                            size="small"
                            type="number"
                            value={state.adjustedNetTotal}
                            onChange={(e) => headerStateSetters(id).adjustedNetTotal(e.target.value)}
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
                        <TableCell colSpan={isAggregated ? 8 : state.showMemberName ? 7 : 6 } style={{ borderBottom: 'none' }}>
                            <Typography variant="h6" sx={{ fontFamily: 'Inter', fontWeight: 'bold', fontSize: '27px', border: 'none' }}>
                                {tableTitle}
                            </Typography>
                        </TableCell>
                        <TableCell align="right" colSpan={isAggregated ? 4 : 3} style={{ borderBottom: 'none' }}>
                        <Typography variant="subtitle1" sx={{ fontFamily: 'Inter Tight', fontWeight: 'bold', fontSize: '16px', textAlign: 'right' }}>
                            Generated On:
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontFamily: 'Inter Tight', fontWeight: 'regular', fontSize: '18px', textAlign: 'right' }}>
                            {generatedOnDate}
                        </Typography>
                        </TableCell>
                    </TableRow>

                    {/* Table header row */}
                    <TableRow>
                        <StyledTableCell>Member Wallet</StyledTableCell>
                            {state.showMemberName && <StyledTableCell>Member Name</StyledTableCell>}
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
                    {state.showHeaderRow && (
                        <TableRow>
                            <StyledTableCell component="th" scope="row" style={totalRowStyle}>
                                Total
                            </StyledTableCell>
                            {state.showMemberName && <StyledTableCell style={totalRowStyle}></StyledTableCell>}
                            <StyledTableCell align="center" style={{ fontWeight: "bold", backgroundColor: '#b5b5b5' }}>
                                {(totalShare * 100).toFixed(2)}%
                            </StyledTableCell>
                            <StyledTableCell align="center" style={{ fontWeight: "bold", backgroundColor: '#b5b5b5'}}>
                                {totalTxns ? formatAmountDisplay(state.adjustedNetTotal !== "" ? Number(state.adjustedNetTotal) : totalNetAmount) : null}
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
                    {tableData && tableData.map((row) => (
                        <StyledTableRow key={row.memberWallet} walletdescription={row.walletDescription}>
                            <StyledTableCell component="th" scope="row">
                                {shortenAddress(row.memberWallet)}
                            </StyledTableCell>
                            {state.showMemberName && (
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
    </>
);

export default SavedTable;
