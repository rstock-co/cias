import "@fontsource/inter-tight";
import { Box, DialogContent, FormControl, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { StyledBox, StyledDialog, StyledTypography } from './styles';
import { ColorButton } from '../../elements/buttons';
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { WalletSelectAuto } from '../../elements/dropdowns';
import { autoCompleteTheme } from '../../elements/dropdowns/styles';
import { formatCurrency } from "../../lib/functions/format";

const CappedMoveAmount = ({cappedMoveAmount, handleCappedMoveAmountChange }) => (
  <ThemeProvider theme={autoCompleteTheme}>
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mr: 2 }}>
        <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel 
                htmlFor="outlined-adornment-amount" 
                style={{ marginLeft: '10px', fontWeight: 'bold', color: "#e6c347" }}
            >
                Capped Move Amount
            </InputLabel>
            <OutlinedInput
                id="outlined-adornment-amount"
                variant="outlined"
                size="small"
                type="number"
                value={cappedMoveAmount}
                onChange={handleCappedMoveAmountChange}
                startAdornment={<InputAdornment position="start" sx={{color: "#6DFAFE"}}>$</InputAdornment>}
                label="Capped Move Amount"
                placeholder="Enter capped move amount"
                sx={{ marginLeft: '10px', minWidth: 475, fontFamily: 'Inter Tight, sans-serif' }}
                InputLabelProps={{
                    style: { fontWeight: 'bold', color: '#000000' },
                }}
            />
        </FormControl>
    </Box>
  </ThemeProvider>
)

const CappedMoveDialog = ({ open = false, wallets, selectedWallets, handleMultiSelectWalletChange, cappedMoveAmount, handleCappedMoveAmountChange, setAllocationDialogOpen, setFinishCappedMoveDialogOpen }) => (
    <StyledDialog 
      open={open}
    >
      <DialogContent>
        <StyledBox>
          <StyledTypography sx={{marginBottom: '0px', lineHeight: 1}}>
            Select Capped Move
          </StyledTypography>
          <StyledTypography sx={{marginBottom: '25px', marginTop: '0px', fontSize: '18px'}}>
            (only 1 wallet)
          </StyledTypography>
          <WalletSelectAuto wallets={wallets} selectedWallets={selectedWallets} handleChange={handleMultiSelectWalletChange} />
          <StyledTypography sx={{marginTop: '50px', marginBottom: '15px'}}>
            Set Capped Amount
          </StyledTypography>
          <CappedMoveAmount cappedMoveAmount={cappedMoveAmount} handleCappedMoveAmountChange={handleCappedMoveAmountChange} />
          {cappedMoveAmount && selectedWallets && selectedWallets.length > 0 ? 
            <>
                <StyledTypography sx={{fontSize: '28px', marginBottom: '0px', marginTop: '30px', lineHeight: 1.1}}>
                  Confirm Cap
                </StyledTypography>
                <StyledTypography sx={{ 
                  marginBottom: '15px', 
                  marginTop: '10px', 
                  fontSize: '20px', 
                  border: '1px solid', 
                  borderColor: '#096B78', 
                  borderRadius: '10px', 
                  padding: '5px 15px', 
                  boxShadow: '0 0 2px 2px #b09946',
                  minWidth: '440px',
                  fontWeight: 500,
                }}>
                  Set cap at &nbsp; <span style={{ fontWeight: 400, fontSize: '22px', color: '#e6c347' }}>{formatCurrency(Number(cappedMoveAmount))} USD</span> &nbsp;&nbsp;for &nbsp;&nbsp;<span style={{ fontWeight: 400, fontSize: '22px', color: '#e6c347' }}>{selectedWallets[0].name}</span>
                </StyledTypography>

              <ColorButton 
                onClick={() => { 
                  setAllocationDialogOpen(true); 
                  setFinishCappedMoveDialogOpen(false) 
                }} 
                buttonText="Confirm" 
              />
            </>
          : null}

        </StyledBox>
      </DialogContent>
    </StyledDialog>
  );

export default CappedMoveDialog;
