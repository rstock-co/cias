import "@fontsource/inter-tight";
import { Dialog, DialogContent, Paper, TableContainer } from "@mui/material";
import { GenerationDateTemplate, TableTitleTemplate, WalletSummariesTemplate } from "./summary";
import AllocationTableTemplate from "./body";
import FooterTemplate from "./footer";
import HeaderTemplate from "./header";
import SaveTableSnackbar from "../../../elements/snackbars";

const AllocationTable = (props = {}) => {

    const {
        dialogOpen, setDialogOpen, // selectedWallets, 
        dialogTitle, generatedDateString, isAggregated,
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

                        {TableTitleTemplate({dialogTitle})}

                        {WalletSummariesTemplate({summaryData})}

                        {GenerationDateTemplate({generatedDateString})}

                        {AllocationTableTemplate(props)}

                    </TableContainer>
                </DialogContent>

                {FooterTemplate(props)}

            </Dialog>

            {SaveTableSnackbar(props)}
        </>
    );
};

export default AllocationTable;
