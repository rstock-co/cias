import "@fontsource/inter-tight";
import { Button, Dialog, DialogActions, DialogContent, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { StyledTableCell, StyledTableRow, totalRowStyle } from './styles';
import { calculateTotals, generatedDate, initialTotals } from './data';
import { formatAmountDisplay } from '../../lib/functions/format';
import { printTableToPDF } from '../../lib/functions/actions';


const MemberSummary = ({ memberData, dialogOpen, setDialogOpen }) => {
    const { memberSummary, memberName } = memberData;
    const totals = memberSummary && memberSummary.length > 0 ? calculateTotals(memberSummary) : initialTotals();
    
    return (
        <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            PaperProps={{
                style: {
                    width: '55%', // custom width
                    maxWidth: 'none', // override maxWidth
                },
            }}
        >
            <DialogContent>
                <TableContainer component={Paper} id="memberTable">
                    <Table>
                        <TableHead>
                            <TableRow>
                                {/* adjust colSpan as needed */}
                                <TableCell colSpan={5} style={{ borderBottom: 'none' }}>
                                <Typography variant="h6" sx={{ fontFamily: 'Inter', fontWeight: 'regular', fontSize: '22px', border: 'none' }}>
                                    Member Summary Table For:
                                </Typography>
                                <Typography variant="h6" sx={{ fontFamily: 'Inter', fontWeight: 'bold', fontSize: '28px', border: 'none' }}>
                                    {memberName}
                                </Typography>
                                </TableCell>
                                <TableCell align="right" colSpan={3} style={{ borderBottom: 'none' }}>
                                    <Typography variant="subtitle1" sx={{ fontFamily: 'Inter Tight', fontWeight: 'bold', fontSize: '16px', textAlign: 'right' }}>
                                        Generated On:
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ fontFamily: 'Inter Tight', fontWeight: 'regular', fontSize: '18px', textAlign: 'right' }}>
                                        {generatedDate()}
                                    </Typography>
                                </TableCell>
                            </TableRow>
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
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row" style={totalRowStyle}>Total</StyledTableCell>
                                <StyledTableCell style={totalRowStyle}></StyledTableCell> {/* Empty cell if needed */}
                                <StyledTableCell align="center" style={totalRowStyle}>{formatAmountDisplay(totals.totalNetAmount)}</StyledTableCell>
                                <StyledTableCell align="center" style={totalRowStyle}>{totals.totalTransactionsCount}</StyledTableCell>
                                <StyledTableCell align="center" style={totalRowStyle}>{formatAmountDisplay(totals.totalContributionsAmount)}</StyledTableCell>
                                <StyledTableCell align="center" style={totalRowStyle}>{totals.totalContributionsCount}</StyledTableCell>
                                <StyledTableCell align="center" style={totalRowStyle}>{formatAmountDisplay(totals.totalRefundsAmount)}</StyledTableCell>
                                <StyledTableCell align="center" style={totalRowStyle}>{totals.totalRefundsCount}</StyledTableCell>
                            </StyledTableRow>
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
            <DialogActions>
                <Button onClick={() => printTableToPDF('memberTable', 'letter', 'member-summary.pdf')}>Save as PDF</Button>
                <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogActions>
        </Dialog>
    )
};

export default MemberSummary;
