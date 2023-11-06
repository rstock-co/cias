import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { loadScreenStyles } from './styles';
import "@fontsource/inter-tight"

const LoadingScreen = ({stableCoins}) => {
  return (
    <Box sx={loadScreenStyles}>
      {Object.entries(stableCoins).map(([coinKey, { name, loading, txns }]) => (
        <Typography key={coinKey} variant="body1" sx={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '30px' }}>
          {loading ? `Loading transactions for ${name}...` : `Loaded ${txns} transactions for ${name}`} 
          {loading && <CircularProgress />}
        </Typography>
      ))}
    </Box>
  );
};

export default LoadingScreen;