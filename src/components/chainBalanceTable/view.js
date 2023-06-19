
import { Dialog, DialogContent, DialogTitle, Table, TableBody, TableContainer, TableHead, Paper } from '@mui/material';
import { calculateFlow } from '../../lib/functions/wallets';
import { StyledTableCell, StyledTableRow } from './styles';

const ChainFlowDialog = ({ tableData, dialogOpen, setDialogOpen }) => {

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
