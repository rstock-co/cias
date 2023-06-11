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
    Button,
    Box
} from "@mui/material";

import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { generateAllocationTableData } from "../../lib/functions/wallets";
import { formatAmountDisplay } from "../../lib/functions/wallets";

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

const AllocationTable = ({ tableData, dialogOpen, setDialogOpen, selectedWallet }) => {
    let allocationTableData = [];
    if (selectedWallet && selectedWallet.address) {
        allocationTableData = generateAllocationTableData(tableData, selectedWallet);
    }

    const totalContributionsAmount = allocationTableData.reduce((acc, row) => acc + row.contributionsAmount, 0);
    const totalContributions = allocationTableData.reduce((acc, row) => acc + row.contributions, 0);
    const totalRefundsAmount = allocationTableData.reduce((acc, row) => acc + row.refundsAmount, 0);
    const totalRefunds = allocationTableData.reduce((acc, row) => acc + row.refunds, 0);
    const totalNetAmount = totalContributionsAmount - totalRefundsAmount;
    const totalTransactions = totalContributions + totalRefunds;

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
                <Box mb={2}>
                    <div>Total Contributions Amount: {formatAmountDisplay(totalContributionsAmount)}</div>
                    <div>Total Contributions: {totalContributions}</div>
                    <div>Total Refunds Amount: {formatAmountDisplay(totalRefundsAmount)}</div>
                    <div>Total Refunds: {totalRefunds}</div>
                    <div>Total Net Amount: {formatAmountDisplay(totalNetAmount)}</div>
                    <div>Total Transactions: {totalTransactions}</div>
                </Box>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="member table">
                        {/* Render table header */}
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Member Wallet</StyledTableCell>
                                <StyledTableCell align="center">Contributions Amount ($)</StyledTableCell>
                                <StyledTableCell align="center"># of Contributions</StyledTableCell>
                                <StyledTableCell align="center">Refunds Amount ($)</StyledTableCell>
                                <StyledTableCell align="center"># of Refunds</StyledTableCell>
                                <StyledTableCell align="center">Net Amount ($)</StyledTableCell>
                                <StyledTableCell align="center">Net Transactions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        {/* Render table body */}
                        <TableBody>
                            {allocationTableData.map((row) => (
                                <StyledTableRow key={row.uniqueMemberWallet} walletType={row.walletType}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.uniqueMemberWallet}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{formatAmountDisplay(row.contributionsAmount)}</StyledTableCell>
                                    <StyledTableCell align="center">{row.contributions}</StyledTableCell>
                                    <StyledTableCell align="center">{formatAmountDisplay(row.refundsAmount)}</StyledTableCell>
                                    <StyledTableCell align="center">{row.refunds}</StyledTableCell>
                                    <StyledTableCell align="center">{formatAmountDisplay(row.netAmount)}</StyledTableCell>
                                    <StyledTableCell align="center">{row.contributions + row.refunds}</StyledTableCell>
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

export default AllocationTable;
