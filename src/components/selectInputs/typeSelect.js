import { TextField, MenuItem } from '@mui/material';

export const TypeSelect = ({ types, selectedType, handleChange }) => {
    return (
        <TextField
            select
            label="Type"
            value={selectedType}
            onChange={handleChange}
            variant="outlined"
            size="small"
            sx={{ minWidth: 120, backgroundColor: 'white' }}
        >
            <MenuItem value="">
                <em>None</em>
            </MenuItem>
            {types.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
        </TextField>
    );
}

