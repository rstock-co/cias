import { Button, DialogActions }  from "@mui/material";
import { copyDistributionToClipboard, printBlendedTableToPDF } from "../../../lib/functions/actions"; // printTableToPDF
import { extractTitle } from "../../../lib/functions/format";

const FooterTemplate = ({ 
    savedTableId, 
    selectedWallets, 
    move, 
    dialogTitle, 
    saveTableData,
    setDialogOpen,
    deleteTableData,
    isAggregated, 
    generatedDateString, 
    sortedAllocationTableData, 
    totalTxns, 
    totalNetAmount, 
    totalContributionsAmount,
    totalRefundsAmount,
    aggregatedContributionsChainMap, 
    aggregatedRefundsChainMap, 
    aggregatedTxns, 
    totalShare, 
    adjustedNetTotal,
    numberOfTokensToDistribute,
    handleCappedMoveExport,
    exportType,
    cappedMoveAmount
}) => (
        <DialogActions>
            {cappedMoveAmount ? (
                exportType === 'new' ? <Button onClick={() => handleCappedMoveExport('new')}> Generate Capped Move </Button>
                : <Button onClick={() => handleCappedMoveExport('existing')}> Update Capped Move </Button>
                ) : null}
            {numberOfTokensToDistribute ?
                <Button onClick={() => copyDistributionToClipboard(sortedAllocationTableData, numberOfTokensToDistribute, dialogTitle)}>Copy Distribution</Button> : null}
            {savedTableId ?
                <Button onClick={() => deleteTableData(savedTableId)}>Delete Table</Button> : null}
            {!savedTableId ?
                <Button onClick={() => saveTableData({
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
                        showConversions: false,
                        showMemberName: false,
                        showHeaderRow: false,
                        sortBy: "Amount",
                        transferTotal: 0,
                    }})}
                >
                    Save Table
                </Button> : null}
            <Button onClick={() => {printBlendedTableToPDF(
                'allocationTable', 
                sortedAllocationTableData.length > 15 ? 'portrait' : 'landscape', 
                sortedAllocationTableData.length > 15 ? 'tabloid' : 'letter', 
                `${extractTitle(dialogTitle)}.pdf`
            )
                // : printTableToPDF(
                //     'allocationTable', 
                //     sortedAllocationTableData.length > 15 ? 'portrait' : 'landscape', 
                //     sortedAllocationTableData.length > 15 ? 'tabloid' : 'letter', 
                //     `${extractTitle(dialogTitle)}.pdf`
                // )
            }}>
                Download PDF
            </Button>

            <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
);


export default FooterTemplate;
