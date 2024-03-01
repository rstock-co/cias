import { Box, Chip, FormControl, InputAdornment, InputLabel, OutlinedInput, Typography } from '@mui/material';
import CustomColorToggle from '../../../elements/toggles/coloredToggle';
import { SortAllocationSelect } from '../../../elements/dropdowns';
import { chipStyles } from './styles';

const ShowConversionsTemplate = ({ showConversions, handleToggleConversions }) => (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mr: 2 }}>
        <Typography component="div" sx={{ fontFamily: 'Inter Tight' }}>
            Show Conversions
        </Typography>
        <CustomColorToggle
            checked={showConversions}
            onChange={handleToggleConversions}
            inputProps={{ 'aria-label': 'Toggle Conversions' }}
        />
    </Box>
)

const ShowTotalsRowTemplate = ({ showHeaderRow, handleToggleHeaderRow }) => (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mr: 2 }}>
        <Typography component="div" sx={{ fontFamily: 'Inter Tight' }}>
            Show Totals Row
        </Typography>
        <CustomColorToggle
            checked={showHeaderRow}
            onChange={handleToggleHeaderRow}
            inputProps={{ 'aria-label': 'Toggle Header Row' }}
        />
    </Box>
)

const ShowMemberNameTemplate = ({ showMemberName, handleToggleMemberName }) => (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mr: 2 }}>
        <Typography component="div" sx={{ fontFamily: 'Inter Tight' }}>
            Show Member Name
        </Typography>
        <CustomColorToggle
            checked={showMemberName}
            onChange={handleToggleMemberName}
            color="primary"
            inputProps={{ 'aria-label': 'Toggle Member Name' }}
        />
    </Box>
)

const SortAllocationSelectTemplate = ({ sortBy, handleSortByChange }) => (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mr: 2 }}>
        <SortAllocationSelect sortBy={sortBy} handleSortByChange={handleSortByChange} />
    </Box>
)


const AdjustedNetTotalTemplate = ({adjustedNetTotal, handleAdjustedNetTotalChange }) => (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mr: 2 }}>
        <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel 
                htmlFor="outlined-adornment-amount" 
                style={{ fontWeight: 'bold', color: '#097c8f' }}
            >
                Adjusted Net Total
            </InputLabel>
            <OutlinedInput
                id="outlined-adornment-amount"
                variant="outlined"
                size="small"
                type="number"
                value={adjustedNetTotal}
                onChange={handleAdjustedNetTotalChange}
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                label="Adjust Total Net Am"
                placeholder="Enter adjusted net"
                sx={{ margin: "none", maxWidth: 200, fontFamily: 'Inter Tight, sans-serif' }}
                InputLabelProps={{
                    style: { fontWeight: 'bold', color: '#097c8f' },
                }}
            />
        </FormControl>
    </Box>
)

const DistributionTokens = ({numberOfTokensToDistribute, handleNumberOfTokensToDistributeChange }) => (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mr: 2 }}>
        <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel 
                htmlFor="outlined-adornment-amount" 
                style={{ fontWeight: 'bold', color: '#097c8f' }}
            >
                # of Tokens to Distribute
            </InputLabel>
            <OutlinedInput
                id="outlined-adornment-amount"
                variant="outlined"
                size="small"
                type="number"
                value={numberOfTokensToDistribute}
                onChange={handleNumberOfTokensToDistributeChange}
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                label="Tokens to Distribute"
                placeholder="Enter # of tokens"
                sx={{ margin: "none", maxWidth: 200, fontFamily: 'Inter Tight, sans-serif' }}
                InputLabelProps={{
                    style: { fontWeight: 'bold', color: '#097c8f' },
                }}
            />
        </FormControl>
    </Box>
)

const HeaderTemplate = ({
    savedTableId,
    showConversions,
    handleToggleConversions,
    showHeaderRow, 
    handleToggleHeaderRow, 
    showMemberName, 
    handleToggleMemberName, 
    sortBy, 
    handleSortByChange, 
    adjustedNetTotal, 
    handleAdjustedNetTotalChange,
    numberOfTokensToDistribute, 
    handleNumberOfTokensToDistributeChange,
}) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '15px', marginRight: '25px' }}> 
        <Box> 
            <Box sx={{ml: 3}}>
                {savedTableId && (
                    <Chip
                        label={`Saved as Table # ${savedTableId}`}
                        sx={chipStyles}
                    />
                )}
            </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', ml: 2 }}>
            {ShowConversionsTemplate({ showConversions, handleToggleConversions })}

            {ShowTotalsRowTemplate({ showHeaderRow, handleToggleHeaderRow })}

            {ShowMemberNameTemplate({showMemberName, handleToggleMemberName})}

            {SortAllocationSelectTemplate({ sortBy, handleSortByChange })}

            {AdjustedNetTotalTemplate({ adjustedNetTotal, handleAdjustedNetTotalChange })}

            {DistributionTokens({ numberOfTokensToDistribute, handleNumberOfTokensToDistributeChange })}
        </Box>
    </Box>
)

export default HeaderTemplate;
