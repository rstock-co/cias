
import { Dialog, DialogContent, DialogTitle, Table, TableBody, TableContainer, TableHead, Paper } from '@mui/material';
import { calculateFlow, formatAmountDisplay } from '../../lib/functions/wallets';
import { StyledTableCell, StyledTableRow } from './styles';
import "@fontsource/inter-tight";

const ChainCashFlowDialog = ({ tableData, dialogOpen, setDialogOpen }) => {

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
                                    <StyledTableCell align="center">Chain</StyledTableCell>
                                    <StyledTableCell align="center">Inflow</StyledTableCell>
                                    <StyledTableCell align="center">Outflow</StyledTableCell>
                                    <StyledTableCell align="center">Net</StyledTableCell>
                                    <StyledTableCell align="center"># Txns In</StyledTableCell>
                                    <StyledTableCell align="center"># Txns Out</StyledTableCell>
                                    <StyledTableCell align="center">Total # Txns</StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {chainFlows.map((row, index) => (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell align="center">{row.chain}</StyledTableCell>
                                        <StyledTableCell align="center">{formatAmountDisplay(row.inflow)}</StyledTableCell>
                                        <StyledTableCell align="center">{formatAmountDisplay(row.outflow)}</StyledTableCell>
                                        <StyledTableCell align="center">{formatAmountDisplay(row.netFlow)}</StyledTableCell>
                                        <StyledTableCell align="center">{row.txnsIn}</StyledTableCell>
                                        <StyledTableCell align="center">{row.txnsOut}</StyledTableCell>
                                        <StyledTableCell align="center">{row.totalTxns}</StyledTableCell>
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

export default ChainCashFlowDialog;
