import "@fontsource/inter-tight";
import "./logos.css";
import { Box, DialogContent } from '@mui/material';
import { StyledBox, StyledDialog, StyledTypography } from './styles';
import React from 'react';

const logos = {
  arb: 'https://i.imgur.com/3kJricG.png',
  eth: 'https://i.imgur.com/iPqQBBB.png',
  bsc: 'https://i.imgur.com/a5V7FFD.png',
};

const CoinTemplate = ([coinKey, { name, chain, loading, txns }]) => (
  <Box key={coinKey} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
    <StyledTypography>
      {loading ? `Loading transactions for ${name}...  ` : `Loaded ${txns} transactions for ${name}  `}
    </StyledTypography>
    <img 
      src={logos[chain]} 
      className={`${loading ? "spinner" : ""} spinner-${chain.toLowerCase()}`} 
      alt={`${name} logo`} 
      style={{ width: '40px', height: '40px', marginLeft: '10px' }} 
    />
  </Box>
)

const LoadingScreen = ({ stableCoins, open = false }) => {
  console.log("StableCoins from loading screen: ", stableCoins)
  return (
    <StyledDialog 
      open={open}
    >
      <DialogContent>
        <StyledBox>
          {Object.entries(stableCoins).map(CoinTemplate)}
        </StyledBox>
      </DialogContent>
    </StyledDialog>
  );
};

export default LoadingScreen;
