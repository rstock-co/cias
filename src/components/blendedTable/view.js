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
    savedTables,
    filteredBlendedTableIds,
    // getTableIdFromTabIndex,
} = {}) => {
    
    console.log("filteredBlendedTableIds:", filteredBlendedTableIds);
    console.log("savedTables:", savedTables);
    console.log("tabIndex:", tabIndex);

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
                    <StyledTab key={index} label={`${extractTitle(savedTables.find(table => table.id === tableId).tableTitle)}`} disableRipple />
                )}
            </StyledTabs>
            {savedTables.length > 0 && tabIndex < filteredBlendedTableIds.length && (
                <SavedTable data={savedTables.find(table => table.id === filteredBlendedTableIds[tabIndex])} selectedWallets={selectedWallets} />
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
