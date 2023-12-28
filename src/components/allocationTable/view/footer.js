import { Button, DialogActions }  from "@mui/material";
import { extractTitle } from "../../../lib/functions/format";
import { printBlendedTableToPDF } from "../../../lib/functions/actions"; // printTableToPDF

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
                // isAggregated 
                    printBlendedTableToPDF(
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
    )

export default FooterTemplate;
