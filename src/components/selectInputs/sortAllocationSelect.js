import { Autocomplete, TextField } from '@mui/material';

export const SortAllocationSelect = ({ sortBy, handleSortByChange }) => {
    const sortOptions = ["# of contributions", "Amount"];

    return (
        <Autocomplete
            value={sortBy}
            options={sortOptions}
            sx={{ width: '300px', marginBottom: '20px' }}
            getOptionLabel={(option) => option}
            onChange={(event, newValue) => handleSortByChange(newValue || "")}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Sort By"
                    variant="outlined"
                    size="small"
                    sx={{ minWidth: 120, backgroundColor: 'white' }}
                />
            )}
        />
    );
};






