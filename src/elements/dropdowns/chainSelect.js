import '@fontsource/inter-tight';
import { MenuItem } from '@mui/material';
import { StyledTextField } from './styles';

export const ChainSelect = ({ chains, selectedChain, handleChange }) => (
        <StyledTextField
            select
            label="Chain"
            value={selectedChain}
            onChange={handleChange}
            variant="outlined"
            size="small"
            InputProps={{
                classes: {
                    input: selectedChain !== "" ? 'custom-input custom-input-value' : 'custom-input',
                },
            }}
        >
            <MenuItem value="" sx={{ fontFamily: 'Inter Tight, sans-serif' }}>
                <em>All</em>
            </MenuItem>
            {chains.map((chain) => (
                <MenuItem key={chain} value={chain} sx={{ fontFamily: 'Inter Tight, sans-serif' }}>
                    {chain}
                </MenuItem>
            ))}
        </StyledTextField>
    );
