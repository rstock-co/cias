import React from 'react';
import { DialogContent, Box } from '@mui/material';
import { StyledDialog, StyledPaper, StyledBox, StyledTypography } from './styles';
import "@fontsource/inter-tight";
import "./logos.css";

const logos = {
  arb: 'arb.png',
  eth: 'eth.png',
  bsc: 'busd.png',
};

const LoadingScreen = ({ stableCoins, open = false }) => {
  return (
    <StyledDialog 
      open={open}
      components={{ Paper: StyledPaper }}
    >
      <DialogContent>
        <StyledBox>
          {Object.entries(stableCoins).map(([coinKey, { name, chain, loading, txns }]) => (
            <Box key={coinKey} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
              <StyledTypography>
                {loading ? `Loading transactions for ${name}...` : `Loaded ${txns} transactions for ${name}`}
              </StyledTypography>
              <img 
                src={logos[chain]} 
                className={`${loading ? "spinner" : ""} spinner-${chain.toLowerCase()}`} 
                alt={`${name} logo`} 
                style={{ width: '40px', height: '40px' }} />
            </Box>
          ))}
        </StyledBox>
      </DialogContent>
    </StyledDialog>
  );
};

export default LoadingScreen;
