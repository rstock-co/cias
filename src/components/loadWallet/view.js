import '@fontsource/plus-jakarta-sans';
import '@fontsource/inter-tight';
import { Box, IconButton, Paper, Snackbar, Table, TableBody, TableContainer, TableRow, Typography  } from '@mui/material';
import { ChainSelect, DateRangeSelect, DirectionSelect, FilterWalletSelect, MoveSelect, TypeSelect, WalletSelect } from '../../elements/dropdowns';
import { ColorButton, FetchTypeSelect, ToggleChipButton } from '../../elements/buttons';
import { StyledTableCell, StyledTableHead, StyledTableRow, loadWalletStyles, textGradientStyle } from './styles';
import { moves, allWallets as wallets } from "../../lib/data";
import AllocationTable from '../allocationTable/';
import BlendedAllocationTable from '../blendedTable/';
import ChainCashFlowDialog from '../chainCashFlow/view';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LoadingScreen from '../loadingScreen/view';
import MemberSummaryDialog from '../memberSummary/view';
import PersonIcon from '@mui/icons-material/Person';
import { copyToClipboard } from '../../lib/functions/actions';
import { isPoolInvestmentsWallet } from '../../lib/functions/wallets';
import { propertyMap } from './data';

const LoadWallet = ({
    // ux.init
    stableCoins, selectedWallets, fetchType, setFetchType, historicalBNBPrices, historicalETHPrices,
    // ux.base
    tableData, handleSelectedWalletChange,

    // ux.saveTable
    savedTables, saveTableData, deleteTableData, setSavedTables, savedTableId, handleToggleChip, transferTxnsToBlend, isTxnBlended, getSavedTableIDFromDescription,
    saveTableSnackbarOpen, saveTableSnackbarMessage, handleCloseSaveTableSnackbar,

    // ux.blend
    blendedTableList,

    // ux.select
    filterTypes, filterWallets,
    
    // ux.filter
    filters, handleFilterValueChange, handleFilterChange, handleDateChange, handleClearFilters, isStartDateDefault, isEndDateDefault,

    // ux.dialog
    allocationDialogOpen, setAllocationDialogOpen, blendedAllocationDialogOpen, setBlendedAllocationDialogOpen, handleGenerateAllocations,
    chainDialogOpen, setChainDialogOpen, handleGenerateChainFlow,
    snackbarOpen, setSnackbarOpen, handleCloseSnackbar,
    loadingDialogOpen,
    memberSummaryDialogOpen, setMemberSummaryDialogOpen, handleMemberSummary, memberSummaryData,

    // ux.calculations
    // totalTransactionsByChain, totalValueByChain, formattedChainDataString

} = {}) => {
    
    // console.log("SavedTables: ",savedTables)
    // console.log("BlendedTableList: ",  blendedTableList);
    // console.log("TransferTxnsToBlend: ", transferTxnsToBlend);
    console.log("tableData: ", tableData);
    console.log("historicalBNBPrices: ", historicalBNBPrices);
    console.log("historicalETHPrices: ", historicalETHPrices);
    
    return (

        <Box sx={loadWalletStyles}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', width: selectedWallets.length > 0 ? '1045px' : '1380px', marginRight: '0px' }}>
                    
                    <Typography variant="h3" align="left" sx={{ flexGrow: 1}}>
                        <span style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '45px', fontWeight: 'bold', color: 'white', letterSpacing: '4px' }}>
                            WALLET LOOKUP
                        </span>
                    </Typography>
                    
                    <Box sx={{ marginRight: selectedWallets.length > 0 ? '89px' : '347px', marginTop: '10px' }}>
                        <DateRangeSelect selectedDateRange={filters.dateRange} handleChange={handleDateChange} isStartDateDefault={isStartDateDefault} isEndDateDefault={isEndDateDefault} />
                    </Box>

                    
                </Box>

                

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    {selectedWallets.length > 0 && selectedWallets.map((wallet, index) => (
                        <Typography key={index} variant="h4" align="right" sx={{ marginTop: index === 0 ? 0 : '10px' }}>
                            <span style={textGradientStyle}>{wallet.name}{':  '}</span>
                            <a 
                                href={`https://debank.com/profile/${wallet.address}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                style={{ fontFamily: 'Inter Tight', fontSize: '22px', color: 'white', textDecoration: 'none' }}
                            >
                                {wallet.address}
                            </a>
                        </Typography>
                    ))}

                    {isPoolInvestmentsWallet(selectedWallets) && 
                        <Box sx={{ marginTop: '35px' }}>
                            <MoveSelect moves={moves.map(move => move.moveName)} selectedMove={filters.move} handleChange={handleFilterChange('move')} />
                        </Box>}
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: '30px' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <FetchTypeSelect
                        fetchType={fetchType} 
                        setFetchType={setFetchType} 
                    />
                    <ColorButton onClick={handleGenerateChainFlow} buttonText="Saved Tables" />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
   
                    <Box sx={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                        <WalletSelect wallets={wallets} selectedWallets={selectedWallets} handleChange={handleSelectedWalletChange} />
                        <TypeSelect types={filterTypes} selectedType={filters.type} handleChange={handleFilterChange('type')} />
                        <ChainSelect chains={['arb', 'eth', 'bsc']} selectedChain={filters.chain} handleChange={handleFilterChange('chain')} />
                        <DirectionSelect directions={['In', 'Out']} selectedDirection={filters.direction} handleChange={handleFilterChange('direction')} />
                        <FilterWalletSelect wallets={filterWallets} filteredWallet={filters.filterWallet} handleChange={handleFilterValueChange('filterWallet')} selectedWallets={selectedWallets} />
                    </Box>

  
                    <Box sx={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                        <ColorButton onClick={handleClearFilters} buttonText="Clear All Filters" />
                        <ColorButton onClick={handleGenerateAllocations} buttonText="Generate Allocations" />
                        <ColorButton onClick={handleGenerateChainFlow} buttonText="Chain Cash Flow" />
                    {/* <SettingsIcon sx={{ fontSize: 40, color: '#095D6F' }} /> */}
                    </Box>
                </Box>
            </Box>
            {/* HEADER END */}

            {/* TABLE START */}
            <TableContainer component={Paper} sx={{ maxHeight: '80vh', overflow: 'auto', background: 'transparent', backdropFilter: 'blur(5px)' }}>
                <Table sx={{ minWidth: 2050, backgroundColor: 'transparent' }} stickyHeader aria-label="simple table">
                    <StyledTableHead>
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
                                walletdescription={row.walletDescription}
                                outflow={(row.flow === 'Out').toString()}
                            >
                                {Object.entries(propertyMap).map(([key, value]) => {
                                    if (key === 'from' || key === 'to') {
                                        const isMember = row.walletDescription.startsWith('Member');
                                        const isSelectedAddress = selectedWallets.some(wallet => wallet.address === row[key]);
                                        return (
                                            <StyledTableCell
                                                key={key}
                                                align={value.align}
                                                walletdescription={row.walletDescription}
                                                outflow={(row.flow === 'Out').toString()}
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
                                    } else if (key === 'walletDescription') {
                                        const savedTableID = getSavedTableIDFromDescription(row.walletDescription, savedTables);
                                        const displayChip = savedTableID !== null;
                                        return (
                                            <StyledTableCell
                                                key={key}
                                                align={value.align}
                                                walletdescription={row.walletDescription}
                                                outflow={(row.flow === 'Out').toString()}
                                            >
                                                {row[key]}
                                                {displayChip && (
                                                    <ToggleChipButton 
                                                        onToggle={(txnHash, isBlended) => handleToggleChip(savedTableID, txnHash, isBlended, row.amount, row.dateTime, row.chain)}
                                                        blended={isTxnBlended(savedTableID, row.hash)}
                                                        hash={row.hash}
                                                    />
                                                )}
                                            </StyledTableCell>
                                        );
                                    } else {
                                        return (
                                            <StyledTableCell
                                                key={key}
                                                align={value.align}
                                                walletdescription={row.walletDescription}
                                                outflow={(row.flow === 'Out').toString()}
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

            <AllocationTable 
                tableData={tableData} 
                dialogOpen={allocationDialogOpen} 
                setDialogOpen={setAllocationDialogOpen} 
                selectedWallets={selectedWallets} 
                move={filters.move} 
                saveTableData={saveTableData}
                deleteTableData={deleteTableData}
                savedTableId={savedTableId}
                saveTableSnackbarMessage={saveTableSnackbarMessage}
                saveTableSnackbarOpen={saveTableSnackbarOpen}
                handleCloseSaveTableSnackbar={handleCloseSaveTableSnackbar}
            />

            <BlendedAllocationTable
                tableData={tableData}
                dialogOpen={blendedAllocationDialogOpen}
                setDialogOpen={setBlendedAllocationDialogOpen} 
                selectedWallets={selectedWallets} 
                move={filters.move} 
                transferTxnsToBlend={transferTxnsToBlend}
                savedTables={savedTables}
                setSavedTables={setSavedTables}
                blendedTableList={blendedTableList}
            />

            <ChainCashFlowDialog 
                tableData={tableData} 
                dialogOpen={chainDialogOpen} 
                setDialogOpen={setChainDialogOpen} 
            />

            <Snackbar 
                open={snackbarOpen} 
                autoHideDuration={3000} 
                onClose={handleCloseSnackbar} 
                message="Wallet address copied to clipboard" 
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} 
                sx={{ '& .MuiSnackbarContent-root': { backgroundColor: '#105c69', fontFamily: 'Inter Tight, sans-serif', fontSize: '20px', boxShadow: '0 0 10px 3px #4ed3e6' } }} />
            
            <LoadingScreen 
                stableCoins={stableCoins} 
                open={loadingDialogOpen} 
            />
            
            <MemberSummaryDialog 
                memberData={memberSummaryData} 
                dialogOpen={memberSummaryDialogOpen} 
                setDialogOpen={setMemberSummaryDialogOpen} 
            />
        </Box>
    );
};
export default LoadWallet;
