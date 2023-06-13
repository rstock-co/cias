// WalletSelect.js
import { MenuItem } from '@mui/material';
import { StyledTextField } from './styles';
import '@fontsource/inter';

export const WalletSelect = ({ wallets, selectedWallet, handleChange }) => {
    return (
        <StyledTextField
            select
            label="Wallet"
            value={selectedWallet.name}
            onChange={handleChange}
            variant="outlined"
            size="small"
            sx={{ width: '250px' }}
            InputProps={{
                classes: {
                    input: 'custom-input',
                },
            }}
        >
            <MenuItem value="" sx={{ fontFamily: 'Inter, sans-serif' }}>
                <em>None</em>
            </MenuItem>
            {wallets.map((wallet) => (
                <MenuItem key={wallet.name} value={wallet.name} sx={{ fontFamily: 'Inter, sans-serif' }}>{wallet.name} </MenuItem>
            ))}
        </StyledTextField>
    );
}