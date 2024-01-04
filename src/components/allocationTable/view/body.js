import { ConversionDetailsTemplate, formatLogoChainMap } from '../../../elements/templates/tables';
import { StyledTableCell, StyledTableRow, WideStyledTableCell, totalRowStyle, totalRowStyleWithBorder } from './styles';
import { Table, TableBody, TableHead, TableRow } from '@mui/material';
import { formatAggregatedData, formatAmountDisplay, formatChainMap, shortenAddress } from '../../../lib/functions/format';

const AllocationTableHeaderTemplate = ({
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

const AllocationTableTotalsRowTemplate = ({
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
            <StyledTableCell align="center" style={totalRowStyleWithBorder}>{formatLogoChainMap(formatChainMap(aggregatedContributionsChainMap))}</StyledTableCell>
            <StyledTableCell align="center" style={totalRowStyle}>{formatAmountDisplay(totalRefundsAmount)}</StyledTableCell>
            <StyledTableCell align="center" style={totalRowStyle}>{formatLogoChainMap(formatChainMap(aggregatedRefundsChainMap))}</StyledTableCell>
        </TableRow>
    )

const AllocationTableTemplate = ({
    isAggregated,
    showConversions, 
    showMemberName, 
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
}) => {
    console.log("Allocation Table DATA: ", sortedAllocationTableData)
    return (
    <Table sx={{ border: 'none', tableLayout: 'auto' }} aria-label="member table">
        {AllocationTableHeaderTemplate({showMemberName, isAggregated })}

        {}
        <TableBody>

            {AllocationTableTotalsRowTemplate({showHeaderRow, totalRowStyle, showMemberName, totalShare, totalTxns, adjustedNetTotal, totalNetAmount, isAggregated, totalRowStyleWithBorder, aggregatedTxns, totalContributionsAmount, aggregatedContributionsChainMap, totalRefundsAmount, aggregatedRefundsChainMap})}

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

                    {showConversions ? (
                        <StyledTableCell align="center">
                        <ConversionDetailsTemplate
                            totalUSD={row.adjustedNetAmount}
                            refundTxns={row.normalRefundTxns}
                            contributionTxns={row.normalContributionTxns}
                            type={'all'}
                      />
                      </StyledTableCell>
                    ) : ( <StyledTableCell align="center">{formatAmountDisplay(row.adjustedNetAmount)}</StyledTableCell>) }
                    
                    {isAggregated && (
                        <WideStyledTableCell align="center" style={{ borderRight: "1px solid #b8b8b8" }}>{formatAggregatedData(row.walletTxns).totalAmounts}</WideStyledTableCell>
                    )}

                    <StyledTableCell align="center" style={{ borderRight: isAggregated ? "none" : "1px solid #b8b8b8" }}>{row.txns}</StyledTableCell>

                    {isAggregated && (
                        <WideStyledTableCell align="center" style={{ borderRight: "1px solid #b8b8b8" }}>{formatAggregatedData(row.walletTxns).txns}</WideStyledTableCell>
                    )}

                    {showConversions ? (
                        <StyledTableCell align="center">
                        <ConversionDetailsTemplate
                            totalUSD={row.contributionsAmount}
                            normalRe={row.normalRefundTxns}
                            contributionTxns={row.normalContributionTxns}
                            type={'contribution'}
                        />
                        </StyledTableCell>
                    ) : ( <StyledTableCell align="center">{formatAmountDisplay(row.contributionsAmount)}</StyledTableCell> ) }

                    <StyledTableCell align="center" style={{ borderRight: "1px solid #b8b8b8" }} >{formatLogoChainMap(formatChainMap(row.contributionsChainMap))}</StyledTableCell>

                    {showConversions ? (
                        <StyledTableCell align="center">
                            {<ConversionDetailsTemplate
                                totalUSD={row.refundsAmount}
                                refundTxns={row.normalRefundTxns}
                                contributionTxns={row.normalContributionTxns}
                                type={'refund'}
                            />}
                        </StyledTableCell>
                    
                    ) : ( <StyledTableCell align="center">{formatAmountDisplay(row.refundsAmount)}</StyledTableCell> ) }

                    <StyledTableCell align="center">{formatLogoChainMap(formatChainMap(row.refundsChainMap))}</StyledTableCell>

                </StyledTableRow>
            ))}
        </TableBody>
    </Table>
)}

export default AllocationTableTemplate;
