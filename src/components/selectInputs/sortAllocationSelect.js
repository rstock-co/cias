import { Autocomplete, TextField } from '@mui/material';
import "@fontsource/inter-tight"

export const SortAllocationSelect = ({ sortBy, handleSortByChange }) => {
    const sortOptions = ["# of contributions", "Amount"];

    return (
        <Autocomplete
            value={sortBy}
            options={sortOptions}
            sx={{ width: '208px', fontFamily: 'Inter Tight, sans-serif' }}
            getOptionLabel={(option) => option}
            onChange={(event, newValue) => handleSortByChange(newValue || "")}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Sort By"
                    variant="outlined"
                    size="small"
                    sx={{ maxWidth: 200, backgroundColor: 'white', fontFamily: 'Inter Tight, sans-serif' }}
                />
            )}
        />
    );
};






