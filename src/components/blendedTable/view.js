import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { printAllocationTable } from "../../lib/functions/actions";
import TableTabs from "./tableTabs";
import "@fontsource/inter-tight";

const BlendedAllocationTable = ({ 
    selectedWallets, 
    savedTables, 
    transferTxnsToBlend, 
    dialogOpen, 
    setDialogOpen, 
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
                <TableTabs savedTables={savedTables} selectedWallets={selectedWallets} />
            </DialogContent>
            
            <DialogActions>
                <Button onClick={printAllocationTable}>Save as PDF</Button>
                <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogActions>
        </Dialog>

    </>
);

export default BlendedAllocationTable;
