import "@fontsource/inter-tight"
import { Autocomplete, TextField, ThemeProvider } from '@mui/material';
import { autoCompleteTheme } from './styles';

export const WalletSelectAuto = ({ wallets = [], handleChange}) => (
        <ThemeProvider theme={autoCompleteTheme}>
            <Autocomplete
                multiple
                options={wallets.map(wallet => wallet.name)}
                getOptionLabel={(option) => option}
                filterSelectedOptions={true}
                onChange={(event, newValue, reason) => handleChange(newValue || '', reason)}
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
                    />
                )}
                sx={{
                    width: '475px',
                }}
            />
        </ThemeProvider>
    );
