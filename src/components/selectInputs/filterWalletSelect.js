import { Autocomplete, TextField, createTheme, ThemeProvider } from '@mui/material';
import { makeStyles } from '@mui/styles';
import '@fontsource/inter';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            height: '45px',
            '& fieldset': {
                border: '1px solid #096B78',
                '&:hover': {
                    borderColor: '#096B78',
                },
            },
            '& input': {
                padding: '10px 14px',
                color: '#6DFAFE',
                border: 'none', // Hide the inner border
            },
            '&.Mui-focused fieldset': {
                borderColor: '#096B78',
                boxShadow: '0 0 3px 2px #096B78',
            },
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#096B78',
        },
        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#096B78',
        },
        '& .MuiAutocomplete-clearIndicator, & .MuiAutocomplete-popupIndicator': {
            color: '#6DFAFE',
        },
        '& .MuiAutocomplete-root': {
            height: '50px', // Adjust the height as desired
        },
        '& .MuiInputLabel-root': {
            fontSize: '13px',
            color: '#e6c347',
            fontWeight: 'bold',
            '&.Mui-focused': {
                fontSize: '13px', // Adjust the font size when focused
            },
            '&.MuiInputLabel-shrink': {
                fontSize: '20px', // Adjust the font size when value is present
                top: '-15px',
                left: '-10px',
            },
        },
    },
    customInput: {
        '& fieldset': {
            borderColor: "#096B78",
        },
        '& input': {
            // background: 'linear-gradient(to right, #011D24, #02343C)',
        }
    },
    customInputValue: {
        '& fieldset': {
            borderColor: "#f2db88",
            boxShadow: '0 0 3px 3px #b09946', // Add the glow when value is present
        },
        '& input': {
            // background: 'linear-gradient(to right, #011D24, #02343C)',
        }
    },
}));

const theme = createTheme();

export const FilterWalletSelect = ({
    wallets,
    filteredWallet,
    selectedWallet,
    handleChange,
}) => {
    const classes = useStyles();

    return (
        <ThemeProvider theme={theme}>
            <Autocomplete
                options={wallets.filter(
                    (wallet) => wallet.toLowerCase() !== selectedWallet.toLowerCase()
                )}
                value={filteredWallet}
                onChange={(event, newValue) => handleChange(newValue || '')}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Wallet"
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
