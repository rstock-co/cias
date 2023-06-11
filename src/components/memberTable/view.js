import {
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    DialogActions,
    Button
} from "@mui/material";

import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { generateAllocationTable } from "../../lib/functions/wallets";
import { formatAmount } from "../../lib/functions/wallets";

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


const MemberTable = ({ tableData, dialogOpen, setDialogOpen }) => {
    const memberTableData = generateAllocationTable(tableData);
    return (
        <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            PaperProps={{
                style: {
                    width: '80%', // custom width, you can specify any value
                    maxWidth: 'none', // override maxWidth
                },
            }}
        >
            <DialogTitle>Member Wallet Transactions</DialogTitle>
            <DialogContent style={{ overflowX: 'auto' }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="member table">
                        {/* Render table header */}
                        <TableHead>
                            <TableRow>
                                <StyledTableCell></StyledTableCell> {/* Empty cell for aligning with Member Wallet column */}
                                <StyledTableCell align="center">
                                    {/* Sum up the total amounts */}
                                    Total Amount: {formatAmount(memberTableData.reduce((total, row) => total + row.amount, 0))}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {/* Sum up the total transactions */}
                                    Total Transactions: {memberTableData.reduce((total, row) => total + row.contributions, 0)}
                                </StyledTableCell>
                            </TableRow>
                            <TableRow>
                                <StyledTableCell>Member Wallet</StyledTableCell>
                                <StyledTableCell align="center">Total Amount ($)</StyledTableCell>
                                <StyledTableCell align="center"># of Transactions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        {/* Render table body */}
                        <TableBody>
                            {memberTableData.map((row) => (
                                <StyledTableRow key={row.contributor} walletType={row.walletType}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.contributor}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{formatAmount(row.amount)}</StyledTableCell>

                                    <StyledTableCell align="center">{row.contributions}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};


export default MemberTable;