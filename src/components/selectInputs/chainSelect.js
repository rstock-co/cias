import '@fontsource/inter';

import { TextField, MenuItem } from '@mui/material';

export const ChainSelect = ({ chains, selectedChain, handleChange }) => {
    return (
        <TextField
            select
            label="Chain"
            id="ChainSelect"
            value={selectedChain}
            onChange={handleChange}
            variant="outlined"
            size="small"
            inputProps={sx = {{ fontFamily: 'Inter, sans-serif'
}} }
        >
            <MenuItem value="" sx={{ fontFamily: 'Inter, sans-serif' }}>
                <em>None</em>
            </MenuItem>
            {chains.map((chain) => (
                <MenuItem key={chain} value={chain} sx={{ fontFamily: 'Inter, sans-serif' }}>
                    {chain}
                </MenuItem>
            ))}
        </TextField>
    );
}
