import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { Box, Typography } from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { wallets } from '../../lookup/wallets';
import MemberTable from '../memberTable/view';
import WalletSelect from './walletSelect';
import TypeSelect from './typeSelect';

const LoadWallet = ({
    selectedWallet,
    transactionType,
    handleWalletChange,
    handleTransactionTypeChange,
    handleGenerateTable,
    contributorTableData,
    recieverTableData,
    dialogOpen,
    setDialogOpen
} = {}) => {

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
        backgroundColor: walletType === 'Member' ? 'white' : '#FFF9C4',
        '&:nth-of-type(odd)': {
            backgroundColor: walletType === 'Member' ? theme.palette.action.hover : '#FFF9C4',
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    return (
        <Box sx={{ bgcolor: '#F3E5F5', pt: 50, p: 5 }}>
            <Typography variant="h3" align="left" gutterBottom>
                Wallet Lookup
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <WalletSelect
                        wallets={wallets}
                        selectedWallet={selectedWallet}
                        handleWalletChange={handleWalletChange}
                    />
                    <TypeSelect
                        transactionType={transactionType}
                        handleTransactionTypeChange={handleTransactionTypeChange}
                    />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    {selectedWallet.address && (
                        <Typography variant="body1" align="right">
                            Wallet Address: {selectedWallet.address}
                        </Typography>
                    )}
                    <Button
                        variant="contained"
                        onClick={handleGenerateTable}
                        color="warning"
                        sx={{ marginTop: 2 }}
                    >
                        Generate Allocations
                    </Button>
                </Box>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>#</StyledTableCell>
                            <StyledTableCell align="left">Date/Time</StyledTableCell>
                            <StyledTableCell align="left">Txn</StyledTableCell>
                            <StyledTableCell align="left">Contributor</StyledTableCell>
                            <StyledTableCell align="left">Type</StyledTableCell>
                            <StyledTableCell align="center">Amount&nbsp;($)</StyledTableCell>
                            <StyledTableCell align="center">Currency&nbsp;($)</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contributorTableData.length > 0 && contributorTableData.map((row) => (
                            <StyledTableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                walletType={row.walletType}
                            >
                                <StyledTableCell component="th" scope="row">
                                    {row.id}
                                </StyledTableCell>
                                <StyledTableCell align="left">{row.dateTime}</StyledTableCell>
                                <StyledTableCell align="left">{row.txn}</StyledTableCell>
                                <StyledTableCell align="left">{row.contributor}</StyledTableCell>
                                <StyledTableCell align="left">{row.walletType}</StyledTableCell>
                                <StyledTableCell align="center">{row.amount}</StyledTableCell>
                                <StyledTableCell align="center">{row.currency}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <MemberTable tableData={contributorTableData} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
        </Box>
    );


}


export default LoadWallet;
