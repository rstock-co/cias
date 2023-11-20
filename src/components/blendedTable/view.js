import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { StyledTabs, StyledTab } from './styles'; 
import { printAllocationTable } from "../../lib/functions/actions";
import { extractTitle } from '../../lib/functions/format';
import SavedTable from '../savedTable';
import "@fontsource/inter-tight";

const BlendedAllocationTable = ({ 
    dialogOpen, 
    setDialogOpen,
    tabIndex,
    handleTabChange,
    selectedWallets, 
    move,
    savedTables,
    filteredBlendedTableIds,
    dialogTitle,
    TabTitle,

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
    generatedDate,
    isAggregated
} = {}) => {
    
    console.log("filteredBlendedTableIds:", filteredBlendedTableIds);
    console.log("savedTables:", savedTables);
    console.log("tabIndex:", tabIndex);
    console.log("dialogTitle:", dialogTitle)

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
                Blended Allocation Table
            </DialogTitle>

            <DialogContent style={{ overflowX: 'auto' }}>
            <StyledTabs value={tabIndex} onChange={handleTabChange}>
                {filteredBlendedTableIds.map((tableId, index) => 
                    <StyledTab
                        key={index}
                        label={
                        <div>
                            Transfer Wallet # {index + 1}
                            <br />
                            {extractTitle(savedTables.find((table) => table.id === tableId).tableTitle)}
                        </div>
                        }
                        disableRipple
                    />                  
                )}
                <StyledTab label={TabTitle} disableRipple />
            </StyledTabs>
            {savedTables.length > 0 && (
                tabIndex < filteredBlendedTableIds.length
                ? <SavedTable data={savedTables.find(table => table.id === filteredBlendedTableIds[tabIndex])} selectedWallets={selectedWallets} />
                : <SavedTable 
                    data={{
                        selectedWallets,
                        move,
                        tableTitle: dialogTitle,
                        generatedOnDate: generatedDate,
                        tableData: sortedAllocationTableData,
                        totals: {totalTxns, totalContributionsAmount, totalRefundsAmount, totalNetAmount, aggregatedContributionsChainMap, 
                            aggregatedRefundsChainMap, aggregatedTxns, totalShare},
                        numContributors: sortedAllocationTableData.length, 
                        adjustedNetTotal: adjustedNetTotal !== "" ? Number(adjustedNetTotal) : totalNetAmount, 
                        isAggregated
                    }}

                />
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
