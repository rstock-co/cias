import "@fontsource/inter-tight";
import { Dialog, DialogContent, Paper, TableContainer } from "@mui/material";
import { ExportProcessSnackbar, SaveTableSnackbar } from "../../../elements/snackbars";
import { GenerationDateTemplate, TableTitleTemplate, WalletSummariesTemplate } from "./summary";
import AllocationTableTemplate from "./body";
import FooterTemplate from "./footer";
import HeaderTemplate from "./header";

const AllocationTable = (props = {}) => {

    const {
        dialogOpen, setDialogOpen, selectedWallets, 
        dialogTitle, generatedDateString, isAggregated, isCappedMove, selectedCappedMoveWallets, isCappedWalletFound,
        summaryData, // sortedAllocationTableData
    } = props;

    // console.log("allocation table data: ", sortedAllocationTableData)
    // console.log("summary data: ", summaryData)
    // console.log("selected wallets: ", selectedWallets)
    // console.log("dialog title: ", dialogTitle)

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
                    <TableContainer component={Paper} id="allocationTable" sx={{ border: 'none' }}>

                        {TableTitleTemplate({dialogTitle, isCappedMove, isCappedWalletFound, selectedWallets, selectedCappedMoveWallets})}

                        {WalletSummariesTemplate({summaryData})}

                        {GenerationDateTemplate({generatedDateString})}

                        {AllocationTableTemplate(props)}

                    </TableContainer>
                </DialogContent>

                {FooterTemplate(props)}

            </Dialog>

            {SaveTableSnackbar(props)}
            {ExportProcessSnackbar(props)}
        </>
    );
};

export default AllocationTable;
