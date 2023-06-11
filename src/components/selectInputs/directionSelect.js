import { TextField, MenuItem } from '@mui/material';

export const DirectionSelect = ({ directions, selectedDirection, handleChange }) => {
    return (
        <TextField
            select
            label="Direction"
            value={selectedDirection}
            onChange={handleChange}
            variant="outlined"
            size="small"
            sx={{ minWidth: 120, backgroundColor: 'white' }}
        >
            <MenuItem value="">
                <em>None</em>
            </MenuItem>
            {directions.map((direction) => (
                <MenuItem key={direction} value={direction}>
                    {direction}
                </MenuItem>
            ))}
        </TextField>
    );
}
