import '@fontsource/inter-tight';
import { Checkbox, FormControl, ListItemText, MenuItem } from '@mui/material';
import { CustomInputLabel, CustomOutlinedInput, CustomSelect, autoCompleteTheme } from './styles';
import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';

export const WalletSelect = ({ wallets, selectedWallets, handleChange }) => {
    const [selectOpen, setSelectOpen] = useState(false);

    const handleClose = () => {
        setSelectOpen(false);
    };

    const handleSelectChange = (event) => {
        handleChange(event);
        handleClose(); // Close the select when an item is clicked
    };

    const handleOpen = () => {
        setSelectOpen(true);
    };


    return (
        <ThemeProvider theme={autoCompleteTheme}>
            <div>
                <FormControl sx={{ width: 450 }}>
                    <CustomInputLabel id="demo-multiple-checkbox-label" shrink={true}>Select Wallet</CustomInputLabel>
                    <CustomSelect
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={selectedWallets.map(wallet => wallet.name)}
                        onChange={handleSelectChange}
                        input={<CustomOutlinedInput label="Select Wallet" />}
                        renderValue={(selected) => selected.join(', ')}
                        open={selectOpen}
                        onOpen={handleOpen}
                        onClose={handleClose}
                    >
                        {wallets.map((wallet,index) => (
                            <MenuItem key={index} value={wallet.name}>
                                <Checkbox checked={selectedWallets.some(sw => sw.name === wallet.name)} />
                                <ListItemText primary={wallet.name} sx={{ fontFamily: 'Inter Tight, sans-serif' }} />
                            </MenuItem>
                        ))}
                    </CustomSelect>
                </FormControl>
            </div>
        </ThemeProvider>
    );
};
