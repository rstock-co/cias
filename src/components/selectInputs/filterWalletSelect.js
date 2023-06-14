import { Autocomplete, TextField, ThemeProvider } from '@mui/material';
import { autoCompleteTheme, useStyles } from './styles';
import '@fontsource/inter';

export const FilterWalletSelect = ({
    wallets = [], // ensure wallets has a default value
    filteredWallet,
    selectedWallets = [], // ensure selectedWallets has a default value
    handleChange,
}) => {
    const classes = useStyles();

    return (
        <ThemeProvider theme={autoCompleteTheme}>
            <Autocomplete
                options={wallets.filter(
                    (wallet) => !selectedWallets.includes(wallet.toLowerCase())
                )}
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
                                lineHeight: 'normal', // Maintain consistent vertical alignment
                            },
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        className={`${classes.root} ${filteredWallet ? classes.customInputValue : classes.customInput}`}
                    />
                )}
                sx={{
                    width: '475px',
                    height: '45px', // Adjust the height as desired 
                }}
            />
        </ThemeProvider>
    );
};

