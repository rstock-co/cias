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
        backgroundColor: walletType !== "Member" ? '#FFF9C4' : theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


const MemberTable = ({ tableData, dialogOpen, setDialogOpen }) => {
    const memberTableData = generateAllocationTable(tableData);
    return (
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
            <DialogTitle>Member Wallet Transactions</DialogTitle>
            <DialogContent>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="member table">
                        {/* Render table header */}
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Member Wallet</StyledTableCell>
                                <StyledTableCell align="center">Total Amount ($)</StyledTableCell>
                                <StyledTableCell align="center"># of Transactions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        {/* Render table body */}
                        <TableBody>
                            {memberTableData.map((row) => (
                                <StyledTableRow key={row.memberWallet}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.memberWallet}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{row.totalAmount}</StyledTableCell>
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