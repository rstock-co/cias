import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress } from '@mui/material';
import { Box, Typography } from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { wallets } from '../../lookup/wallets';
import MemberTable from '../memberTable/view';
import ChainFlowDialog from '../chainBalanceTable/view';
import { WalletSelect, TypeSelect, FilterWalletSelect, ChainSelect, DateRangeSelect, DirectionSelect } from '../../components/selectInputs';

import { styleRow } from './styles';

const LoadWallet = ({
    tableData,

    selectedWallet,
    handleSelectedWalletChange,
    type,
    filterTypes,
    handleTypeChange,
    filterWallet,
    filterWallets,
    handleFilterWalletChange,
    chain,
    handleChainChange,
    dates,
    handleDatesChange,
    direction,
    handleDirectionChange,

    handleGenerateAllocations,
    handleGenerateChainFlow,

    allocationDialogOpen,
    setAllocationDialogOpen,
    chainDialogOpen,
    setChainDialogOpen,
    isLoading
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

    const StyledTableRow = styled(TableRow)(({ theme, walletType, isRefund }) => ({
        backgroundColor: isRefund ? '#FFA50030' : walletType === 'Member' ? 'white' : '#FFF9C4',
        '&:nth-of-type(odd)': {
            backgroundColor: isRefund ? '#FFA50030' : walletType === 'Member' ? theme.palette.action.hover : '#FFF9C4',
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));


    if (isLoading || tableData.length > 900) {
        return <CircularProgress />;
    }

    return (
        <Box sx={{ bgcolor: '#F3E5F5', pt: 50, p: 5, pb: 100 }}>
            {selectedWallet.address && (
                <Typography variant="h3" align="left" gutterBottom>
                    Wallet Lookup {' | '}  <span style={{ fontSize: '35px', color: '#4B0082' }}>{selectedWallet.name}</span> {' | '}
                    <span style={{ fontSize: '30px', color: '#FF0000' }}>
                        {selectedWallet.address.substring(0, 4)}
                    </span>
                    <span style={{ fontSize: '30px', color: '#4B0082' }}>
                        {selectedWallet.address.substring(4, selectedWallet.address.length - 4)}
                    </span>
                    <span style={{ fontSize: '30px', color: '#FF0000' }}>
                        {selectedWallet.address.substring(selectedWallet.address.length - 4)}
                    </span>
                    {'  |'}
                </Typography>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <WalletSelect
                        wallets={wallets}
                        selectedWallet={selectedWallet}
                        handleChange={handleSelectedWalletChange}
                    />
                    <TypeSelect
                        types={filterTypes} // list of all possible types (this must be generated)
                        selectedType={type}
                        handleChange={handleTypeChange}
                    />
                    <FilterWalletSelect
                        wallets={filterWallets} // list of all possible wallets (this must be generated)
                        selectedWallet={filterWallet}
                        handleChange={handleFilterWalletChange}
                    />
                    <ChainSelect
                        chains={['arb', 'eth', 'bsc']}
                        selectedChain={chain}
                        handleChange={handleChainChange}
                    />
                    <DirectionSelect
                        directions={['In', 'Out']}
                        selectedDirection={direction}
                        handleChange={handleDirectionChange}
                    />



                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '15px' }}>
                    <DateRangeSelect
                        selectedDateRange={dates}
                        handleChange={handleDatesChange}
                    />

                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: '15px' }}>

                    <Button
                        variant="contained"
                        onClick={handleGenerateAllocations}
                        color="warning"
                        sx={{ marginTop: 2 }}
                    >
                        Generate Allocations
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleGenerateChainFlow}>
                        Chain Cash Flow
                    </Button>
                </Box>
                </Box>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>#</StyledTableCell>
                            <StyledTableCell align="center">Chain</StyledTableCell>
                            <StyledTableCell align="center">In/Out</StyledTableCell>
                            <StyledTableCell align="left">Date/Time</StyledTableCell>
                            <StyledTableCell align="left">Txn</StyledTableCell>
                            <StyledTableCell align="left">From</StyledTableCell>
                            <StyledTableCell align="left">To</StyledTableCell>
                            <StyledTableCell align="left">Type</StyledTableCell>
                            <StyledTableCell align="center">Amount&nbsp;($)</StyledTableCell>
                            <StyledTableCell align="center">Currency&nbsp;($)</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {tableData.length > 0 && tableData.length < 900 && tableData.map((row) => (
                            <StyledTableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, ...styleRow(row, row.walletType) }}
                                walletType={row.walletType}
                                refund={row.inout === 'Out' && row.walletType === 'Member'}
                            >
                                <StyledTableCell component="th" scope="row">
                                    {row.id}
                                </StyledTableCell>
                                <StyledTableCell align="center">{row.chain}</StyledTableCell>
                                <StyledTableCell align="center">{row.inout}</StyledTableCell>
                                <StyledTableCell align="left">{row.dateTime}</StyledTableCell>
                                <StyledTableCell align="left">{row.txn}</StyledTableCell>
                                <StyledTableCell align="left">{row.from}</StyledTableCell>
                                <StyledTableCell align="left">{row.to}</StyledTableCell>
                                <StyledTableCell align="left">{row.walletType}</StyledTableCell>
                                <StyledTableCell align="center">{row.amountDisplay}</StyledTableCell>
                                <StyledTableCell align="center">{row.currency}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <MemberTable tableData={tableData} dialogOpen={allocationDialogOpen} setDialogOpen={setAllocationDialogOpen} />
            <ChainFlowDialog tableData={tableData} dialogOpen={chainDialogOpen} setDialogOpen={setChainDialogOpen} />
        </Box>
    );


}


export default LoadWallet;
