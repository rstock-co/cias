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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h3" align="left" gutterBottom>
                    <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '40px', fontWeight: 'bold', color: 'white', letterSpacing: '2.5px' }}>
                        WALLET LOOKUP
                    </span>
                </Typography>

                <DateRangeSelect
                    selectedDateRange={dates}
                    handleChange={handleDatesChange}
                />

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    {selectedWallets.map((wallet, index) => (
                        <Typography key={index} variant="h4" align="left" sx={{ marginTop: index === 0 ? 0 : '10px' }}>
                            <span style={textGradientStyle}>{wallet.name}{':  '}</span>
                            <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '20px', color: 'white' }}>
                        {wallet.address}
                            </span>
                </Typography>
            ))}
                </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 3, marginTop: 5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <WalletSelect
                        wallets={wallets}
                        selectedWallets={selectedWallets}
                        handleChange={handleSelectedWalletChange}
                    />
                    <TypeSelect
                        types={filterTypes}
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
                        wallets={filterWallets}
                        filteredWallet={filterWallet}
                        selectedWallets={selectedWallets}
                        handleChange={handleFilterWalletChange}
                    />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: '15px', marginTop: '30px' }}>
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