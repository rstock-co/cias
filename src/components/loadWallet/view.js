import { Table, TableBody, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import { Box, Typography } from '@mui/material';
import '@fontsource/plus-jakarta-sans';
import '@fontsource/inter-tight';

import { wallets } from '../../lookup/wallets';
import AllocationTable from '../allocationTable/view';
import ChainFlowDialog from '../chainBalanceTable/view';
import { WalletSelect, TypeSelect, FilterWalletSelect, ChainSelect, DateRangeSelect, DirectionSelect } from '../../components/selectInputs';
import { StyledTableCell, StyledTableRow, textGradientStyle } from './styles';
import { loadWalletStyles, ColorButton } from './styles'; // styleRow

const LoadWallet = ({
    isLoading,
    selectedWallets,

    tableData,
    handleSelectedWalletChange,

    filters,
    handleValueChange,
    handleEventChange,
    handleDateChange,
    handleClearFilters,
    isStartDateDefault,
    isEndDateDefault,

    filterTypes,
    filterWallets,

    allocationDialogOpen,
    setAllocationDialogOpen,
    handleGenerateAllocations,

    chainDialogOpen,
    setChainDialogOpen,
    handleGenerateChainFlow,

} = {}) => {

    console.log("SELECTED WALLETS: ", selectedWallets)

    if (isLoading || tableData.length > 900) {
        return <CircularProgress />;
    }

    const propertyMap = {
        id: { header: '#', align: 'center' },
        chain: { header: 'Chain', align: 'center' },
        wallet: { header: 'Wallet', align: 'center' }, // Add this line
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h3" align="left">
                    <span style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '45px', fontWeight: 'bold', color: 'white', letterSpacing: '4px' }}>
                        WALLET LOOKUP
                    </span>
                </Typography>

                <Box sx={{ marginTop: '15px' }}>
                    <DateRangeSelect
                        selectedDateRange={filters.dateRange}
                        handleChange={handleDateChange}
                        isStartDateDefault={isStartDateDefault}
                        isEndDateDefault={isEndDateDefault}
                    />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    {selectedWallets.map((wallet, index) => (
                        <Typography key={index} variant="h4" align="left" sx={{ marginTop: index === 0 ? 0 : '10px' }}>
                            <span style={textGradientStyle}>{wallet.name}{':  '}</span>
                            <span style={{ fontFamily: 'Inter Tight', fontSize: '22px', color: 'white' }}>
                        {wallet.address}
                            </span>
                </Typography>
            ))}
                </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 2, marginTop: 5 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                    <WalletSelect
                        wallets={wallets}
                        selectedWallets={selectedWallets}
                        handleChange={handleSelectedWalletChange}
                    />

                    <TypeSelect
                        types={filterTypes}
                        selectedType={filters.type}
                        handleChange={handleEventChange('type')}
                    />

                    <ChainSelect
                        chains={['arb', 'eth', 'bsc']}
                        selectedChain={filters.chain}
                        handleChange={handleEventChange('chain')}
                    />

                    <DirectionSelect
                        directions={['In', 'Out']}
                        selectedDirection={filters.direction}
                        handleChange={handleEventChange('direction')}
                    />

                    <FilterWalletSelect
                        wallets={filterWallets}
                        filteredWallet={filters.filterWallet}
                        selectedWallets={selectedWallets}
                        handleChange={handleValueChange('filterWallet')}
                    />

                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: '15px', marginTop: '30px' }}>
                    <ColorButton
                        variant="contained"
                        onClick={handleClearFilters}
                        sx={{
                            marginTop: 6, fontFamily: 'Plus Jakarta Sans, sans-serif'
                        }}
                    >
                        Clear All Filters
                    </ColorButton>
                    <ColorButton
                        variant="contained"
                        onClick={handleGenerateAllocations}
                        sx={{
                            marginTop: 6, fontFamily: 'Plus Jakarta Sans, sans-serif'
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