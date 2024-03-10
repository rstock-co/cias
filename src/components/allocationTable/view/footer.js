import { Button, DialogActions }  from "@mui/material";
import { copyDistributionToClipboard, printBlendedTableToPDF } from "../../../lib/functions/actions"; // printTableToPDF
import { createNewCappedMove, generateCappedMoveData } from "../../../api/google";
import { extractTitle } from "../../../lib/functions/format";
import { getNowMST } from "../../../lib/functions/time";

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
    accessToken,
    cappedMoveAmount
}) => {
        
    const dateTime = getNowMST();
    const moveName = 'test-move'

    return (
        <DialogActions>
            {cappedMoveAmount && 
                <Button onClick={() => createNewCappedMove({
                    accessToken, 
                    data: generateCappedMoveData(sortedAllocationTableData, dialogTitle, moveName, dateTime), 
                    dateTime,
                    indexSheetName: 'index',
                    moveName,
                    walletAddress: '0x13k4as983423klakl942032340934jk',
                    cappedMoveAmount})}
                >
                    Generate Capped Move
                </Button>}
            {numberOfTokensToDistribute && 
                <Button onClick={() => copyDistributionToClipboard(sortedAllocationTableData, numberOfTokensToDistribute, dialogTitle)}>Copy Distribution</Button>}
            {savedTableId && 
                <Button onClick={() => deleteTableData(savedTableId)}>Delete Table</Button>}
            {!savedTableId && 
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
                </Button>}
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
};

export default FooterTemplate;
