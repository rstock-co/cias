// WalletSelect.js
import { TextField, MenuItem } from '@mui/material';
import '@fontsource/inter';

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
            <MenuItem value="" sx={{ fontFamily: 'Inter, sans-serif' }}>
                <em>None</em>
            </MenuItem>
            {wallets.map((wallet) => (
                <MenuItem key={wallet.name} value={wallet.name} sx={{ fontFamily: 'Inter, sans-serif' }}>{wallet.name} </MenuItem>
            ))}
        </TextField>
    );
}