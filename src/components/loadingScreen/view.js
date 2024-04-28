import "@fontsource/inter-tight";
import "./logos.css";
import { Box, DialogContent } from '@mui/material';
import { StyledBox, StyledDialog, StyledTypography } from './styles';
import React from 'react';
import {logos} from '../../lib'

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

const LoadingScreen = ({ stableCoins, open = false }) => (
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

export default LoadingScreen;
