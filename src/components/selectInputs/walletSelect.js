import { FormControl, MenuItem, Checkbox, ListItemText } from '@mui/material';
import { CustomInputLabel, CustomSelect, CustomOutlinedInput } from './styles';
import '@fontsource/inter-tight';

export const WalletSelect = ({ wallets, selectedWallets, handleChange }) => {

    return (
        <div>
            <FormControl sx={{ width: 450 }}>
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
                        <MenuItem key={wallet.name} value={wallet.name} >
                            <Checkbox checked={selectedWallets.some(sw => sw.name === wallet.name)} />
                            <ListItemText primary={wallet.name} sx={{ fontFamily: 'Inter Tight, sans-serif' }} />
                        </MenuItem>
                    ))}
                </CustomSelect>
            </FormControl>
        </div>
    );
}
