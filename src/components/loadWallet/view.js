import { Table, TableBody, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress } from '@mui/material';
import { Box, Typography } from '@mui/material';
import '@fontsource/plus-jakarta-sans';

import { wallets } from '../../lookup/wallets';
import AllocationTable from '../allocationTable/view';
import ChainFlowDialog from '../chainBalanceTable/view';
import { WalletSelect, TypeSelect, FilterWalletSelect, ChainSelect, DateRangeSelect, DirectionSelect } from '../../components/selectInputs';
import { StyledTableCell, StyledTableRow } from './styles';
import { styleRow, loadWalletStyles } from './styles';

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

    console.log("SELECTED WALLET: ", selectedWallet)

    if (isLoading || tableData.length > 900) {
        return <CircularProgress />;
    }

    return (
        <Box sx={loadWalletStyles}>
            {selectedWallet.address && (
                <Typography variant="h3" align="left" gutterBottom>
                    <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '45px', fontWeight: 'bold', color: 'white' }}>Wallet Lookup </span>  <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '35px', color: '#C99AF7' }}>{' | '}{selectedWallet.name}{' | '}</span>
                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '25px', color: 'white' }}>
                        {selectedWallet.address}
                    </span>
                    {/* <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '25px', color: '#4498FF' }}>
                        {selectedWallet.address.substring(0, 4)}
                    </span>
                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '25px', color: 'white' }}>
                        {selectedWallet.address.substring(4, selectedWallet.address.length - 4)}
                    </span>
                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '25px', color: '#4498FF' }}>
                        {selectedWallet.address.substring(selectedWallet.address.length - 4)}
                    </span>
                    {'  |'} */}
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
                        filteredWallet={filterWallet}
                        selectedWallet={selectedWallet.address}
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
            <TableContainer component={Paper} sx={{ background: 'transparent', backdropFilter: 'blur(5px)' }}>


                <Table sx={{ minWidth: 650, backgroundColor: 'transparent' }} aria-label="simple table">
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
            <AllocationTable tableData={tableData} dialogOpen={allocationDialogOpen} setDialogOpen={setAllocationDialogOpen} selectedWallet={selectedWallet} />
            <ChainFlowDialog tableData={tableData} dialogOpen={chainDialogOpen} setDialogOpen={setChainDialogOpen} />
        </Box>
    );


}


export default LoadWallet;
