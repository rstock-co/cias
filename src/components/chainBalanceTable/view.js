import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { Dialog, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: 'Roboto, sans-serif'
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        fontFamily: 'Roboto, sans-serif'
    },
}));

const StyledTableRow = styled(TableRow)(({ theme, walletType }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const ChainFlowDialog = ({ tableData, dialogOpen, setDialogOpen }) => {

    const calculateFlow = (data, chain) => {
        const chainData = data.filter(item => item.chain === chain);
        const inTxns = chainData.filter(item => item.inout === "In");
        const outTxns = chainData.filter(item => item.inout === "Out");

        const inflow = inTxns.reduce((acc, cur) => acc + Number(cur.amount), 0);
        const outflow = outTxns.reduce((acc, cur) => acc + Number(cur.amount), 0);
        const netFlow = inflow - outflow;

        const txnsIn = inTxns.length;
        const txnsOut = outTxns.length;

        return {
            chain,
            inflow,
            outflow,
            netFlow,
            txnsIn,
            txnsOut,
            totalTxns: txnsIn + txnsOut
        };
    };

    const chains = Array.from(new Set(tableData.map(item => item.chain)));
    const chainFlows = chains.map(chain => calculateFlow(tableData, chain));

    return (
        <>
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                PaperProps={{
                    style: {
                        width: '50%', // custom width, you can specify any value
                        maxWidth: 'none', // override maxWidth
                    },
                }}
            >
                <DialogTitle id="chain-flow-dialog-title">Chain Cash Flow</DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <StyledTableRow>
                                    <StyledTableCell>Chain</StyledTableCell>
                                    <StyledTableCell>Inflow</StyledTableCell>
                                    <StyledTableCell>Outflow</StyledTableCell>
                                    <StyledTableCell>Net</StyledTableCell>
                                    <StyledTableCell># Txns In</StyledTableCell>
                                    <StyledTableCell># Txns Out</StyledTableCell>
                                    <StyledTableCell>Total # Txns</StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {chainFlows.map((row, index) => (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell>{row.chain}</StyledTableCell>
                                        <StyledTableCell>{row.inflow}</StyledTableCell>
                                        <StyledTableCell>{row.outflow}</StyledTableCell>
                                        <StyledTableCell>{row.netFlow}</StyledTableCell>
                                        <StyledTableCell>{row.txnsIn}</StyledTableCell>
                                        <StyledTableCell>{row.txnsOut}</StyledTableCell>
                                        <StyledTableCell>{row.totalTxns}</StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default ChainFlowDialog;
