import { TextField, MenuItem } from '@mui/material';

export const ChainSelect = ({ chains, selectedChain, handleChange }) => {
    return (
        <TextField
            select
            label="Chain"
            value={selectedChain}
            onChange={handleChange}
            variant="outlined"
            size="small"
            sx={{ minWidth: 120, backgroundColor: 'white' }}
        >
            <MenuItem value="">
                <em>None</em>
            </MenuItem>
            {chains.map((chain) => (
                <MenuItem key={chain} value={chain}>
                    {chain}
                </MenuItem>
            ))}
        </TextField>
    );
}
