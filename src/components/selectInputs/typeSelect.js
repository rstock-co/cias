import { TextField, MenuItem } from '@mui/material';
import '@fontsource/inter';

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
            <MenuItem value="" sx={{ fontFamily: 'Inter, sans-serif' }}>
                <em>None</em>
            </MenuItem>
            {types.map(type => (
                <MenuItem key={type} value={type} sx={{ fontFamily: 'Inter, sans-serif' }}>{type}</MenuItem>
            ))}
        </TextField>
    );
}

