// WalletSelect.js
import { TextField, MenuItem } from '@mui/material';

const WalletSelect = ({ wallets, selectedWallet, handleWalletChange }) => {
    return (
        <TextField
            select
            label="Wallet"
            value={selectedWallet.name}
            onChange={handleWalletChange}
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

export default WalletSelect;