import { FormControl, OutlinedInput, InputLabel, MenuItem, Checkbox, ListItemText } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { StyledSelect } from './styles';
import '@fontsource/inter';

const useStyles = makeStyles((theme) => ({
    menuItem: {
        fontFamily: 'Inter, sans-serif',
    },
    checkbox: {
        color: '#6DFAFE',
    },
}));

export const WalletSelect = ({ wallets, selectedWallets, handleChange }) => {
    const classes = useStyles();
    return (
        <FormControl sx={{ width: '450px' }}>
            <InputLabel id="demo-multiple-checkbox-label" className='MuiInputLabel-root'>Wallet</InputLabel>
            <StyledSelect
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={selectedWallets.map(wallet => wallet.name)}
                onChange={handleChange}
                input={<OutlinedInput label="Wallet" classes={{ root: 'MuiOutlinedInput-root', input: 'MuiOutlinedInput-input custom-input' }} />}
                renderValue={(selected) => selected.join(', ')}
            >
                <MenuItem disabled value="" className={classes.menuItem}>
                    <em>None</em>
                </MenuItem>
                {wallets.map((wallet) => (
                    <MenuItem key={wallet.name} value={wallet.name} className={classes.menuItem}>
                        <Checkbox checked={selectedWallets.some(sw => sw.name === wallet.name)} className={classes.checkbox} />
                        <ListItemText primary={wallet.name} />
                    </MenuItem>
                ))}
            </StyledSelect>
        </FormControl>
    );
}
