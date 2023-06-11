import { TextField, MenuItem } from '@mui/material';

export const FilterWalletSelect = ({ wallets, selectedWallet, handleChange }) => {
    return (
        <TextField
            select
            label="Wallet"
            value={selectedWallet}
            onChange={handleChange}
            variant="outlined"
            size="small"
            sx={{ minWidth: 120, backgroundColor: 'white' }}
        >
            <MenuItem value="">
                <em>None</em>
            </MenuItem>
            {wallets.map((wallet) => (
                <MenuItem key={wallet} value={wallet}>
                    {wallet}
                </MenuItem>
            ))}
        </TextField>
    );
}
