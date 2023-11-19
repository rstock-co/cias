import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { StyledTabs, StyledTab } from './styles'; 
import { printAllocationTable } from "../../lib/functions/actions";
import { extractTitle } from '../../lib/functions/format';
import SavedTable from '../savedTable';
import "@fontsource/inter-tight";

const BlendedAllocationTable = ({ 
    tableData,
    dialogOpen, 
    setDialogOpen,
    tabIndex,
    handleTabChange,
    selectedWallets, 
    transferTxnsToBlend, 
    savedTables, 
    blendedTableList,
} = {}) => (

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
                    {savedTables.length > 0 && savedTables.map(table => (
                        <StyledTab key={table.id} label={`${extractTitle(table.tableTitle)}`} disableRipple />
                    ))}
                </StyledTabs>
                {savedTables.length > 0 && (
                    <SavedTable data={savedTables[tabIndex]} selectedWallets={selectedWallets} />
                )}
            </DialogContent>
            
            <DialogActions>
                <Button onClick={printAllocationTable}>Download PDF</Button>
                <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogActions>

        </Dialog>

    </>
);

export default BlendedAllocationTable;
