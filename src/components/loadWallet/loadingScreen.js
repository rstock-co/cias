import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { loadScreenStyles } from './styles';
import "@fontsource/inter-tight"

const LoadingScreen = ({
  arbStatus,
  ethStatus,
  bscStatus,
}) => {
  return (
    <Box
      sx={loadScreenStyles}
    >
      <Typography variant="body1" sx={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '30px' }}>
        {arbStatus.loading ? 'Loading transactions for Arbitrum...' : `Loaded ${arbStatus.txns} transactions for Arbitrum`} {arbStatus.loading && <CircularProgress />}
      </Typography>
      <Typography variant="body1" sx={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '30px' }}>
        {ethStatus.loading ? 'Loading transactions for Ethereum...' : `Loaded ${ethStatus.txns} transactions for Ethereum`} {ethStatus.loading && <CircularProgress />}
      </Typography>
      <Typography variant="body1" sx={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '30px' }}>
        {bscStatus.loading ? 'Loading transactions for Binance Smart Chain...' : `Loaded ${bscStatus.txns} transactions for Binance Smart Chain`} {bscStatus.loading && <CircularProgress />}
      </Typography>
    </Box>
  );
};

export default LoadingScreen;
