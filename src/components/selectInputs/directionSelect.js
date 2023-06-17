import { MenuItem } from '@mui/material';
import { StyledTextField } from './styles';
import '@fontsource/inter-tight';

export const DirectionSelect = ({ directions, selectedDirection, handleChange }) => {
    return (
        <StyledTextField
            select
            label="Direction"
            value={selectedDirection}
            onChange={handleChange}
            variant="outlined"
            size="small"
            InputProps={{
                classes: {
                    input: selectedDirection !== "" ? 'custom-input custom-input-value' : 'custom-input',
                },
            }}
        >
            <MenuItem value="" sx={{ fontFamily: 'Inter Tight, sans-serif' }}>
                <em>All</em>
            </MenuItem>
            {directions.map((direction) => (
                <MenuItem key={direction} value={direction} sx={{ fontFamily: 'Inter Tight, sans-serif' }}>
                    {direction}
                </MenuItem>
            ))}
        </StyledTextField>
    );
}
