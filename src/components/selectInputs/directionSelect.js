import { TextField, MenuItem } from '@mui/material';
import '@fontsource/inter';

export const DirectionSelect = ({ directions, selectedDirection, handleChange }) => {
    return (
        <TextField
            select
            label="Direction"
            value={selectedDirection}
            onChange={handleChange}
            variant="outlined"
            size="small"
            sx={{ minWidth: 120, backgroundColor: 'white', borderColor: '#4B0082' }}
        >
            <MenuItem value="" sx={{ fontFamily: 'Inter, sans-serif' }}>
                <em>None</em>
            </MenuItem>
            {directions.map((direction) => (
                <MenuItem key={direction} value={direction} sx={{ fontFamily: 'Inter, sans-serif' }}>
                    {direction}
                </MenuItem>
            ))}
        </TextField>
    );
}
