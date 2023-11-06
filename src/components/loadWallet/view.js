import { Table, TableBody, TableContainer, TableHead, TableRow, Paper, Box, Typography, IconButton, Snackbar  } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { WalletSelect, TypeSelect, FilterWalletSelect, ChainSelect, DateRangeSelect, DirectionSelect, MoveSelect } from '../../components/selectInputs';
import { wallets } from '../lookup/wallets';
import { moves } from '../lookup/moves';
import { StyledTableCell, StyledTableRow, textGradientStyle } from './styles';
import { loadWalletStyles, ColorButton } from './styles';
import '@fontsource/plus-jakarta-sans';
import '@fontsource/inter-tight';

import AllocationTable from '../allocationTable/view';
import ChainCashFlowDialog from '../chainCashFlow/view';
import LoadingScreen from './loadingScreen';


const LoadWallet = ({
    isLoading,
    arbStatus,
    ethStatus,
    bscStatus,
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

    snackbarOpen,
    setSnackbarOpen,
    handleCloseSnackbar,

    handleGenerateChainFlow,

    // calculateTotalTransactionsByChain,
    // calculateTotalValueByChain,
    // formatChainData

} = {}) => {

    const walletAddress = selectedWallets[selectedWallets.length - 1].address;
    const isPoolInvestmentsWallet = selectedWallets.length === 1 && selectedWallets[0].address.toLowerCase() === "0xb79e768bef0ca0a34e53c3fe2ac26e600acf8cca".toLowerCase();

    if (isLoading || tableData.length > 900) {
        return (
            <LoadingScreen
                walletAddress={walletAddress}
                arbStatus={arbStatus}
                ethStatus={ethStatus}
                bscStatus={bscStatus}
            />
        );
    }

    const propertyMap = {
        id: { header: '#', align: 'center' },
        chain: { header: 'Chain', align: 'center' },
        wallet: { header: 'Wallet', align: 'center' }, 
        inout: { header: 'In/Out', align: 'center' },
        dateTime: { header: 'Date/Time', align: 'left' },
        link: { header: 'Txn', align: 'center' },
        from: { header: 'From', align: 'left' },
        to: { header: 'To', align: 'left' },
        walletType: { header: 'Type', align: 'left' },
        amountDisplay: { header: 'Amount ($)', align: 'center' },
        currency: { header: 'Currency ($)', align: 'center' },
    };

    // const totalTransactionsByChain = calculateTotalTransactionsByChain(tableData);
    // const totalValueByChain = calculateTotalValueByChain(tableData);
    // const formattedChainData = formatChainData(totalTransactionsByChain, totalValueByChain);

    const copyToClipboard = async (text) => {
        if (!navigator.clipboard) {
          console.error('Clipboard API not available');
          return;
        }
      
        try {
          await navigator.clipboard.writeText(text);
          console.log('Text copied to clipboard');
          setSnackbarOpen(true);
        } catch (err) {
          console.error('Failed to copy text: ', err);
        }
    };
      
      
    return (

        <Box sx={loadWalletStyles}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography variant="h3" align="left" sx={{ marginBottom: '25px' }}>
                    <span style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '45px', fontWeight: 'bold', color: 'white', letterSpacing: '4px' }}>
                        WALLET LOOKUP
                    </span>
                    </Typography >
                    {/* {formattedChainData.map((data, index) => (
                        <Typography variant="h6" align="left" key={index} >
                            <span style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '20px', color: 'white', letterSpacing: '1px' }}>
                                {data}
                            </span>
                        </Typography>
                    ))} */}
                </Box>

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

                {isPoolInvestmentsWallet && 
                    <Box sx={{ marginTop: '70px' }}>
                        <MoveSelect
                            moves={moves.map(move => move.moveName)}
                            selectedMove={filters.move}
                            handleChange={handleEventChange('move')}
                        />
                    </Box>
                }
                </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 2 }}>
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
                            isRefund={row.inout === 'Out' && row.walletType.startsWith('Member')}
                            >
                            {Object.entries(propertyMap).map(([key, value]) => {
                                if (key === 'from' || key === 'to') {
                                return (
                                    <StyledTableCell
                                    key={key}
                                    align={value.align}
                                    walletType={row.walletType}
                                    isRefund={row.inout === 'Out' && row.walletType.startsWith('Member')}
                                    >
                                    {row[key]}
                                    <IconButton
                                        size="small"
                                        onClick={() => copyToClipboard(row[key])}
                                        sx={{
                                            padding: '5px',
                                            margin: '2px',
                                            marginLeft: '5px',
                                            // backgroundColor: '#012226', 
                                            "&:hover": {
                                              backgroundColor: '#012226', 
                                            }
                                        }}
                                    >
                                        <ContentCopyIcon 
                                            style={{ 
                                            fontSize: '14px',
                                            color: '#1ab4b9',
                                            }} 
                                        />
                                    </IconButton>
                                    </StyledTableCell>
                                );
                                } else {
                                return (
                                    <StyledTableCell
                                    key={key}
                                    align={value.align}
                                    walletType={row.walletType}
                                    isRefund={row.inout === 'Out' && row.walletType.startsWith('Member')}
                                    >
                                    {row[key]}
                                    </StyledTableCell>
                                );
                                }
                            })}
                            </StyledTableRow>
                        ))}
                        </TableBody>
                </Table>
            </TableContainer>
            <AllocationTable tableData={tableData} dialogOpen={allocationDialogOpen} setDialogOpen={setAllocationDialogOpen} selectedWallets={selectedWallets} isLoading={isLoading} move={filters.move} />
            <ChainCashFlowDialog tableData={tableData} dialogOpen={chainDialogOpen} setDialogOpen={setChainDialogOpen} />
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar} message="Wallet address copied to clipboard" anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} sx={{ '& .MuiSnackbarContent-root': { backgroundColor: '#105c69', fontFamily: 'Inter Tight, sans-serif', fontSize: '20px', boxShadow: '0 0 10px 3px #4ed3e6' } }} />

        </Box>

    );
}

export default LoadWallet;