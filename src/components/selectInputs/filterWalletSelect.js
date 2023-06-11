import { Autocomplete, TextField } from '@mui/material';

export const FilterWalletSelect = ({ wallets, filteredWallet, selectedWallet, handleChange }) => {
    return (
        <Autocomplete
            options={wallets.filter(wallet => wallet.toLowerCase() !== selectedWallet.toLowerCase())}
            value={filteredWallet}
            sx={{ width: '475px' }}
            onChange={(event, newValue) => handleChange(newValue || '')}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Wallet"
                    variant="outlined"
                    size="small"
                    sx={{ minWidth: 120, backgroundColor: 'white' }}
                />
            )}
        />
    );
};
