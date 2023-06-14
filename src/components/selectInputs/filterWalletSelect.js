import { Autocomplete, TextField, ThemeProvider } from '@mui/material';
import { autoCompleteTheme } from './styles';
import '@fontsource/inter';

export const FilterWalletSelect = ({
    wallets = [], 
    filteredWallet,
    selectedWallets = [], 
    handleChange,
}) => {
    return (
        <ThemeProvider theme={autoCompleteTheme}>
            <Autocomplete
                options={
                    wallets.filter(
                        (wallet) =>
                            typeof wallet === 'string' &&
                            !selectedWallets
                                .filter((selectedWallet) => typeof selectedWallet.address === 'string')
                                .map((selectedWallet) => selectedWallet.address.toLowerCase())
                                .includes(wallet.toLowerCase())
                    )
                }
                value={filteredWallet}
                onChange={(event, newValue) => handleChange(newValue || '')}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Filter By Wallet"
                        variant="outlined"
                        size="small"
                        InputProps={{
                            ...params.InputProps,
                            style: {
                                lineHeight: 'normal',
                            },
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": filteredWallet ? {
                                    borderColor: "#f2db88",
                                    boxShadow: "0 0 3px 3px #b09946",
                                } : {},
                            },
                        }}
                    />
                )}
                sx={{
                    width: '475px',
                    height: '45px',
                }}
            />
        </ThemeProvider>
    );
};

