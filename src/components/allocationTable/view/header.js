const ShowTotalsRowTemplate = ({ showHeaderRow, handleToggleHeaderRow }) => (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mr: 2 }}>
        <Typography component="div" sx={{ fontFamily: 'Inter Tight' }}>
            Show Totals Row
        </Typography>
        <CustomColorSwitch
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
        <CustomColorSwitch
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

const HeaderTemplate = ({
    savedTableId,
    showHeaderRow, 
    handleToggleHeaderRow, 
    showMemberName, 
    handleToggleMemberName, 
    sortBy, 
    handleSortByChange, 
    adjustedNetTotal, 
    handleAdjustedNetTotalChange 
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
            {ShowTotalsRowTemplate({ showHeaderRow, handleToggleHeaderRow })}

            {ShowMemberNameTemplate({showMemberName, handleToggleMemberName})}

            {SortAllocationSelectTemplate({ sortBy, handleSortByChange })}

            {AdjustedNetTotalTemplate({ adjustedNetTotal, handleAdjustedNetTotalChange })}
        </Box>
    </Box>
)

export default HeaderTemplate;