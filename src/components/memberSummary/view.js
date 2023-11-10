
import { Dialog, DialogContent, DialogTitle, Table, TableBody, TableContainer, TableHead, Paper } from '@mui/material';
import { formatAmountDisplay } from '../../lib/functions/format';
import { memberWallets } from '../../lib/data';
import { StyledTableCell, StyledTableRow } from './styles';
import "@fontsource/inter-tight";

const MemberSummary = ({ memberData, dialogOpen, setDialogOpen }) => {

    const { memberSummary, memberWallet } = memberData;

// You can then pass memberSummary to the MemberSummary component
// and use memberWallet wherever you need the wallet address.


    const member = memberWallet && memberWallets.find(m => m.address.toLowerCase() === memberWallet.toLowerCase());
    const memberNameOrWallet = member ? member.name : memberWallet;

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
                <DialogTitle id="chain-flow-dialog-title">{`Member Summary: ${memberNameOrWallet}`}</DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <StyledTableRow>
                                    <StyledTableCell align="center">Move</StyledTableCell>
                                    <StyledTableCell align="center">Token</StyledTableCell>
                                    <StyledTableCell align="center">Total Net ($)</StyledTableCell>
                                    <StyledTableCell align="center">Total # Txns</StyledTableCell>
                                    <StyledTableCell align="center">Contributions ($)</StyledTableCell>
                                    <StyledTableCell align="center"># of Contributions</StyledTableCell>
                                    <StyledTableCell align="center">Refunds ($)</StyledTableCell>
                                    <StyledTableCell align="center"># of Refunds</StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {memberSummary && memberSummary.map((row, index) => (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell align="center">{row.moveName}</StyledTableCell>
                                        <StyledTableCell align="center">{row.token}</StyledTableCell>
                                        <StyledTableCell align="center">{formatAmountDisplay(row.netTotal)}</StyledTableCell>
                                        <StyledTableCell align="center">{row.transactionsCount}</StyledTableCell>
                                        <StyledTableCell align="center">{formatAmountDisplay(row.contributionsTotal)}</StyledTableCell>
                                        <StyledTableCell align="center">{row.contributionsCount}</StyledTableCell>
                                        <StyledTableCell align="center">{formatAmountDisplay(row.refundsTotal)}</StyledTableCell>
                                        <StyledTableCell align="center">{row.refundsCount}</StyledTableCell>
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

export default MemberSummary;
