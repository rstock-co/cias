import { Table, TableBody, TableContainer, TableRow, Paper, Box, Typography, IconButton, Snackbar  } from '@mui/material';
import { StyledTableHead, StyledTableCell, StyledTableRow, textGradientStyle, loadWalletStyles } from './styles';
import { WalletSelect, TypeSelect, FilterWalletSelect, ChainSelect, DateRangeSelect, DirectionSelect, MoveSelect } from '../../elements/dropdowns';
import { ToggleChipButton, ColorButton } from '../../elements/buttons';
import { propertyMap } from './data';
import { allWallets as wallets, moves } from "../../lib/data";
import { isPoolInvestmentsWallet } from '../../lib/functions/wallets';
import { copyToClipboard } from '../../lib/functions/actions';
import AllocationTable from '../allocationTable/';
import BlendedAllocationTable from '../blendedTable/';
import ChainCashFlowDialog from '../chainCashFlow/view';
import LoadingScreen from '../loadingScreen/view';
import MemberSummaryDialog from '../memberSummary/view';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PersonIcon from '@mui/icons-material/Person';
import '@fontsource/plus-jakarta-sans';
import '@fontsource/inter-tight';

const LoadWallet = ({
    // ux.init
    stableCoins, selectedWallets,
    
    // ux.base
    tableData, handleSelectedWalletChange,

    // ux.saveTable
    savedTables, saveTableData, deleteTableData, savedTableId, handleToggleChip, transferTxnsToBlend, isTxnBlended, getSavedTableIDFromDescription,
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
    
    console.log("SavedTables: ",savedTables)
    console.log("BlendedTableList: ",  blendedTableList);
    console.log("TransferTxnsToBlend: ", transferTxnsToBlend);
    
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
                            {<span style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '20px', color: 'white', letterSpacing: '1px' }}>
                                {data}
                            </span>}
                        </Typography>
                    ))} */}
                </Box>

                <Box sx={{ marginTop: '15px' }}>
                    <DateRangeSelect selectedDateRange={filters.dateRange} handleChange={handleDateChange} isStartDateDefault={isStartDateDefault} isEndDateDefault={isEndDateDefault} />
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
                        <Box sx={{ marginTop: '35px' }}>
                            <MoveSelect moves={moves.map(move => move.moveName)} selectedMove={filters.move} handleChange={handleFilterChange('move')} />
                        </Box>}
                </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                    <WalletSelect wallets={wallets} selectedWallets={selectedWallets} handleChange={handleSelectedWalletChange} />
                    <TypeSelect types={filterTypes} selectedType={filters.type} handleChange={handleFilterChange('type')} />
                    <ChainSelect chains={['arb', 'eth', 'bsc']} selectedChain={filters.chain} handleChange={handleFilterChange('chain')} />
                    <DirectionSelect directions={['In', 'Out']} selectedDirection={filters.direction} handleChange={handleFilterChange('direction')} />
                    <FilterWalletSelect wallets={filterWallets} filteredWallet={filters.filterWallet} handleChange={handleFilterValueChange('filterWallet')} selectedWallets={selectedWallets}  />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: '15px', marginTop: '30px' }}>
                    <ColorButton onClick={handleClearFilters} buttonText="Clear All Filters" />
                    <ColorButton onClick={handleGenerateAllocations} buttonText="Generate Allocations" />
                    <ColorButton onClick={handleGenerateChainFlow} buttonText="Chain Cash Flow" />
                </Box>
            </Box>
            {/* HEADER END */}

            {/* TABLE START */}
            <TableContainer component={Paper} sx={{ maxHeight: '80vh', overflow: 'auto', background: 'transparent', backdropFilter: 'blur(5px)' }}>
                <Table sx={{ minWidth: 2020, backgroundColor: 'transparent' }} stickyHeader aria-label="simple table">
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
                                                        onToggle={(txnHash, isBlended) => handleToggleChip(savedTableID, txnHash, isBlended, row.amount)}
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
                transferTxnsToBlend={transferTxnsToBlend}
                savedTables={savedTables}
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