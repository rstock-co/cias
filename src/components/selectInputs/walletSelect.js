import { FormControl, OutlinedInput, InputLabel, MenuItem, Checkbox, ListItemText, Select } from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';

const useStyles = makeStyles({
    menuItem: {
        fontFamily: 'Inter, sans-serif',
    },
});

const CustomInputLabel = withStyles({
    root: {
        color: '#e6c347', // Set the label color
        fontWeight: 'bold',
        fontFamily: 'Inter, sans-serif',
        fontSize: '17px',
        letterSpacing: '0.75px',
        '&.Mui-focused': {
            color: '#e6c347',
            fontWeight: 'bold',
        },
    },
})(InputLabel);

const CustomOutlinedInput = withStyles({
    root: {
        color: '#6DFAFE',
        height: '50px',
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#096B78', // Set the border color
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#096B78', // Keep the border color on hover
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#096B78', // Keep the border color when focused
        },
    },
})(OutlinedInput);

const CustomSelect = withStyles({
    root: {
        height: '50px',
        '& .MuiSelect-icon': {
            color: '#6DFAFE', // Set the select dropdown arrow color
        },
    },
    "& .MuiSelect-select": {
        backgroundColor: "#011D24",
        color: "#6DFAFE",
    },
})(Select);

export const WalletSelect = ({ wallets, selectedWallets, handleChange }) => {
    const classes = useStyles();
    return (
        <div>
            <FormControl sx={{ m: 1, width: 450 }}>
                <CustomInputLabel id="demo-multiple-checkbox-label">Select Wallet</CustomInputLabel>
                <CustomSelect
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={selectedWallets.map(wallet => wallet.name)}
                    onChange={handleChange}
                    input={<CustomOutlinedInput label="Select Wallet" />}
                    renderValue={(selected) => selected.join(', ')}
                >
                    {wallets.map(wallet => (
                        <MenuItem key={wallet.name} value={wallet.name} className={classes.menuItem} >
                            <Checkbox checked={selectedWallets.some(sw => sw.name === wallet.name)} />
                            <ListItemText primary={wallet.name} />
                        </MenuItem>
                    ))}
                </CustomSelect>
            </FormControl>
        </div>
    );
}
