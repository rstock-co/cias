import { Table, TableBody, TableContainer, TableRow, Paper, Box, Typography, IconButton, Snackbar  } from '@mui/material';
import { WalletSelect, TypeSelect, FilterWalletSelect, ChainSelect, DateRangeSelect, DirectionSelect, MoveSelect } from '../../components/selectInputs';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PersonIcon from '@mui/icons-material/Person';
import { propertyMap } from './data';
import { wallets, moves } from '../../lib/data';
import { isPoolInvestmentsWallet } from '../../lib/functions/wallets';
import { copyToClipboard } from '../../lib/functions/actions';
import { StyledTableHead, StyledTableCell, StyledTableRow, textGradientStyle } from './styles';
import { loadWalletStyles, ColorButton } from './styles';
import AllocationTable from '../allocationTable/';
import ChainCashFlowDialog from '../chainCashFlow/view';
import LoadingScreen from './loadingScreen';
import MemberSummaryDialog from '../memberSummary/view';
import '@fontsource/plus-jakarta-sans';
import '@fontsource/inter-tight';

const LoadWallet = ({
    // ux.init
    isLoading, stableCoins, selectedWallets,
    
    // ux.base
    tableData, handleSelectedWalletChange,

    // ux.select
    filterTypes, filterWallets,
    
    // ux.filter
    filters, handleValueChange, handleEventChange, handleDateChange, handleClearFilters, isStartDateDefault, isEndDateDefault,

    // ux.dialog
    allocationDialogOpen, setAllocationDialogOpen, handleGenerateAllocations,
    chainDialogOpen, setChainDialogOpen, handleGenerateChainFlow,
    snackbarOpen, setSnackbarOpen, handleCloseSnackbar,
    loadingDialogOpen,
    memberSummaryDialogOpen, setMemberSummaryDialogOpen, handleMemberSummary, memberSummaryData,
    dialogKey

    // ux.calculations
    // totalTransactionsByChain, totalValueByChain, formattedChainDataString

} = {}) => (

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
            {selectedWallets.length > 0 && selectedWallets.map((wallet, index) => (
                <Typography key={index} variant="h4" align="left" sx={{ marginTop: index === 0 ? 0 : '10px' }}>
                    <span style={textGradientStyle}>{wallet.name}{':  '}</span>
                    <span style={{ fontFamily: 'Inter Tight', fontSize: '22px', color: 'white' }}>
                        {wallet.address}
                    </span>
                </Typography>
            ))}

            {isPoolInvestmentsWallet(selectedWallets) && 
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

        <TableContainer component={Paper} sx={{ maxHeight: '80vh', overflow: 'auto', background: 'transparent', backdropFilter: 'blur(5px)' }}>
            <Table sx={{ minWidth: 2020, backgroundColor: 'transparent' }} stickyHeader aria-label="simple table">
                <StyledTableHead sx={{ width: '100%' }}>
                    <TableRow>
                        {Object.entries(propertyMap).map(([key, value]) => (
                            <StyledTableCell key={key} align={value.align}>
                                {value.header}
                            </StyledTableCell>
                        ))}                 
                    </TableRow>
                </StyledTableHead>
        
                <TableBody>
                    {tableData.length > 0 && tableData.length < 900 && tableData.map((row) => (
                        <StyledTableRow
                            key={row.id}
                            walletType={row.walletType}
                            isRefund={row.inout === 'Out' && row.walletType.startsWith('Member')}
                        >
                            {Object.entries(propertyMap).map(([key, value]) => {
                                if (key === 'from' || key === 'to') {
                                    const isMember = row.walletType.startsWith('Member');
                                    const isSelectedAddress = selectedWallets.some(wallet => wallet.address === row[key]);
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
                                                onClick={() => copyToClipboard(row[key], setSnackbarOpen)}
                                                sx={{
                                                    padding: '5px',
                                                    margin: '1px',
                                                    marginLeft: '3px',
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
                                            {isMember && !isSelectedAddress && (
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleMemberSummary(row[key])} // Pass the member wallet address
                                                    sx={{
                                                        padding: '3px',
                                                        margin: '1px',
                                                        marginLeft: '0px',
                                                        "&:hover": {
                                                            backgroundColor: '#012226', 
                                                        }
                                                    }}
                                                >
                                                    <PersonIcon 
                                                        style={{ 
                                                            fontSize: '14px',
                                                            color: '#1ab4b9',
                                                        }} 
                                                    />
                                                </IconButton>
                                            )}
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

        <AllocationTable key={dialogKey} tableData={tableData} dialogOpen={allocationDialogOpen} setDialogOpen={setAllocationDialogOpen} selectedWallets={selectedWallets} isLoading={isLoading} move={filters.move} />

        <ChainCashFlowDialog tableData={tableData} dialogOpen={chainDialogOpen} setDialogOpen={setChainDialogOpen} />

        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar} message="Wallet address copied to clipboard" anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} sx={{ '& .MuiSnackbarContent-root': { backgroundColor: '#105c69', fontFamily: 'Inter Tight, sans-serif', fontSize: '20px', boxShadow: '0 0 10px 3px #4ed3e6' } }} />
        
        <LoadingScreen stableCoins={stableCoins} open={loadingDialogOpen} />
        
        <MemberSummaryDialog memberData={memberSummaryData} dialogOpen={memberSummaryDialogOpen} setDialogOpen={setMemberSummaryDialogOpen} />
    </Box>
);

export default LoadWallet;