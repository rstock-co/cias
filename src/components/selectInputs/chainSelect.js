import '@fontsource/inter';
import { MenuItem } from '@mui/material';
import { StyledTextField } from './styles';

export const ChainSelect = ({ chains, selectedChain, handleChange }) => {
    return (
        <StyledTextField
            select
            label="Chain"
            value={selectedChain}
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
            {chains.map((chain) => (
                <MenuItem key={chain} value={chain} sx={{ fontFamily: 'Inter, sans-serif' }}>
                    {chain}
                </MenuItem>
            ))}
        </StyledTextField>
    );
};
