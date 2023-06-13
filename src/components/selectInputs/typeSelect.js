import { MenuItem } from '@mui/material';
import { StyledTextField } from './styles';
import '@fontsource/inter';

export const TypeSelect = ({ types, selectedType, handleChange }) => {
    return (
        <StyledTextField
            select
            label="Type"
            value={selectedType}
            onChange={handleChange}
            variant="outlined"
            size="small"
            InputProps={{
                classes: {
                    input: 'custom-input',
                },
            }}
        >
            <MenuItem value="" sx={{ fontFamily: 'Inter, sans-serif' }}>
                <em>None</em>
            </MenuItem>
            {types.map(type => (
                <MenuItem key={type} value={type} sx={{ fontFamily: 'Inter, sans-serif' }}>{type}</MenuItem>
            ))}
        </StyledTextField>
    );
}

