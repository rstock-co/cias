import { Table, TableBody, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import { Box, Typography } from '@mui/material';
import '@fontsource/plus-jakarta-sans';

import { wallets } from '../../lookup/wallets';
import AllocationTable from '../allocationTable/view';
import ChainFlowDialog from '../chainBalanceTable/view';
import { WalletSelect, TypeSelect, FilterWalletSelect, ChainSelect, DateRangeSelect, DirectionSelect } from '../../components/selectInputs';
import { StyledTableCell, StyledTableRow, textGradientStyle } from './styles';
import { loadWalletStyles, ColorButton } from './styles'; // styleRow

const LoadWallet = ({
    tableData,

    selectedWallets,
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

    console.log("SELECTED WALLET: ", selectedWallets)

    if (isLoading || tableData.length > 900) {
        return <CircularProgress />;
    }

    const propertyMap = {
        id: { header: '#', align: 'center' },
        chain: { header: 'Chain', align: 'center' },
        inout: { header: 'In/Out', align: 'center' },
        dateTime: { header: 'Date/Time', align: 'left' },
        txn: { header: 'Txn', align: 'left' },
        from: { header: 'From', align: 'left' },
        to: { header: 'To', align: 'left' },
        walletType: { header: 'Type', align: 'left' },
        amountDisplay: { header: 'Amount ($)', align: 'center' },
        currency: { header: 'Currency ($)', align: 'center' },
    };

    return (
        <Box sx={loadWalletStyles}>
            {selectedWallets.length > 0 && selectedWallets.map((wallet, index) => (
                <Typography key={index} variant="h3" align="left" gutterBottom>
                    <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '40px', fontWeight: 'bold', color: 'white', letterSpacing: '2.5px' }}>WALLET LOOKUP </span>
                    <span style={textGradientStyle} >{' | '}{wallet.name}{' | '}</span>
                    {/* style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '35px', color: '#67C3FF' }} */}
                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '25px', color: 'white' }}>
                        {wallet.address}
                    </span>
                    {/* <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '25px', color: '#4498FF' }}>
                        {wallet.address.substring(0, 4)}
                    </span>
                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '25px', color: 'white' }}>
                        {wallet.address.substring(4, wallet.address.length - 4)}
                    </span>
                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '25px', color: '#4498FF' }}>
                        {wallet.address.substring(wallet.address.length - 4)}
                    </span>
                    {'  |'} */}
                </Typography>
            ))}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <WalletSelect
                        wallets={wallets}
                        selectedWallets={selectedWallets}
                        handleChange={handleSelectedWalletChange}
                    />
                    <TypeSelect
                        types={filterTypes} // list of all possible types (this must be generated)
                        selectedType={type}
                        handleChange={handleTypeChange}
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
                    <FilterWalletSelect
                        wallets={filterWallets} // list of all possible wallets (this must be generated)
                        filteredWallet={filterWallet}
                        selectedWallets={selectedWallets}
                        handleChange={handleFilterWalletChange}
                    />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '15px' }}>
                    <DateRangeSelect
                        selectedDateRange={dates}
                        handleChange={handleDatesChange}
                    />

                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: '15px' }}>

                        <ColorButton
                        variant="contained"
                            onClick={handleGenerateAllocations}
                            sx={{
                                marginTop: 2, fontFamily: 'Plus Jakarta Sans, sans-serif'
                            }}
                    >
                        Generate Allocations
                        </ColorButton>
                        <ColorButton
                            variant="contained"
                            onClick={handleGenerateChainFlow}
                            sx={{ marginTop: 2, fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                        >
                        Chain Cash Flow
                        </ColorButton>
                </Box>
                </Box>
            </Box>
            <TableContainer component={Paper} sx={{ background: 'transparent', backdropFilter: 'blur(5px)' }}>
                <Table sx={{ minWidth: 650, backgroundColor: 'transparent' }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {Object.entries(propertyMap).map(([key, value]) => (
                                <StyledTableCell key={key} align={value.align}>
                                    {value.header}
                                </StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableData.length > 0 && tableData.length < 900 && tableData.map((row) => (
                            <StyledTableRow
                                key={row.id}
                                walletType={row.walletType}
                                isRefund={row.inout === 'Out' && row.walletType === 'Member'}
                            >
                                {Object.entries(propertyMap).map(([key, value]) => (
                                    <StyledTableCell
                                        key={key}
                                        align={value.align}
                                        walletType={row.walletType}
                                        isRefund={row.inout === 'Out' && row.walletType === 'Member'}
                                    >
                                        {row[key]}
                                    </StyledTableCell>
                                ))}
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <AllocationTable tableData={tableData} dialogOpen={allocationDialogOpen} setDialogOpen={setAllocationDialogOpen} selectedWallets={selectedWallets} />
            <ChainFlowDialog tableData={tableData} dialogOpen={chainDialogOpen} setDialogOpen={setChainDialogOpen} />
        </Box>
    );
}

export default LoadWallet;