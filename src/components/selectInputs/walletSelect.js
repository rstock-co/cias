// WalletSelect.js
import { TextField, MenuItem } from '@mui/material';

export const WalletSelect = ({ wallets, selectedWallet, handleChange }) => {
    return (
        <TextField
            select
            label="Wallet"
            value={selectedWallet.name}
            onChange={handleChange}
            variant="outlined"
            size="small"
            sx={{ minWidth: 120, backgroundColor: 'white' }}
        >
            <MenuItem value="">
                <em>None</em>
            </MenuItem>
            {wallets.map((wallet) => (
                <MenuItem key={wallet.name} value={wallet.name}>{wallet.name}</MenuItem>
            ))}
        </TextField>
    );
}