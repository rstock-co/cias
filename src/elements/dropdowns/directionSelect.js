import '@fontsource/inter-tight';
import { MenuItem } from '@mui/material';
import { StyledTextField } from './styles';

export const DirectionSelect = ({ directions, selectedDirection, handleChange }) => (
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
    )
