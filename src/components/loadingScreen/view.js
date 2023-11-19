import React from 'react';
import { DialogContent, Box } from '@mui/material';
import { logos } from './data';
import "@fontsource/inter-tight";
import { StyledDialog, StyledBox, StyledTypography } from './styles';
import "./logos.css";

const LoadingScreen = ({ stableCoins, open = false }) => {
  return (
    <StyledDialog open={open}>
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
