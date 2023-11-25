import '@fontsource/inter-tight';
import { MenuItem } from '@mui/material';
import { StyledTextField } from './styles';

export const TypeSelect = ({ types, selectedType, handleChange }) => (
        <StyledTextField
            select
            label="Type"
            value={selectedType}
            onChange={handleChange}
            variant="outlined"
            size="small"
            sx={{ width: '180px' }}
            InputProps={{
                classes: {
                    input: selectedType !== "" ? 'custom-input custom-input-value' : 'custom-input',
                },
            }}
        >
            <MenuItem value="" sx={{ fontFamily: 'Inter Tight, sans-serif' }}>
                <em>All</em>
            </MenuItem>
            {types.map(type => (
                <MenuItem key={type} value={type} sx={{ fontFamily: 'Inter Tight, sans-serif' }}>{type}</MenuItem>
            ))}
        </StyledTextField>
    )

