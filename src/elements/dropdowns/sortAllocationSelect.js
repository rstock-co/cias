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
                    InputLabelProps={{
                        style: {
                            fontWeight: 'bold', // Make the label text bold
                            color: '#097c8f', // Set a different font color for the label
                        },
                    }}
                    InputProps={{
                        ...params.InputProps,
                        style: {
                            fontFamily: 'Inter Tight, sans-serif',
                        },
                    }}
                    
                />
            )}
        />
    );
};
  





