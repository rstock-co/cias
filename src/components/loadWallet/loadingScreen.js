import React from 'react';
import { Dialog, DialogContent, Box, CircularProgress, Typography } from '@mui/material';
import "@fontsource/inter-tight";

const LoadingScreen = ({ stableCoins, open = false }) => {
  return (
    <Dialog
      open={open}
      PaperProps={{
        style: {
          boxShadow: 'none', // Removes shadow
          overflow: 'hidden', // Hides the overflow content
          borderRadius: 0, // Optional: removes the border radius if you want a square dialog
          backgroundColor: 'transparent', // Removes white background to prevent white borders
          width: '60vw', // Sets the width of the dialog to 60% of the viewport width
          height: '60vh', // Sets the height of the dialog to 60% of the viewport height
          margin: 'auto', // Centers the dialog horizontally
        }
      }}
      sx={{
        '& .MuiDialog-paper': {
          maxWidth: 'none', // Allows the dialog to expand to the set width
          maxHeight: 'none', // Ensures that the dialog doesn't exceed the set height
          // If you need to adjust the vertical position:
          marginTop: 'auto',
          marginBottom: 'auto',
        },
        '& .MuiDialogContent-root': {
          padding: '0px 24px 24px 24px', // Adjust as needed
          overflowY: 'visible', // Ensures there's no scrollbar unless necessary
          // Adjust other styles as necessary
        },
        // Center the dialog vertically
        '& .MuiDialog-container': {
          display: 'flex',
          alignItems: 'center', // This centers the dialog vertically
          justifyContent: 'center', // This centers the dialog horizontally
        },
      }}
    >
      {/* Remove DialogTitle if not needed */}
      {/* <DialogTitle id="loading-dialog-title">Loading Transactions</DialogTitle> */}
      <DialogContent>
        <Box
          sx={{
            background: 'radial-gradient(circle at top center, #02343C 50vh, #01070D 100vh)', // Set the gradient background
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%', // Ensure the Box takes up the full height of DialogContent
            overflowY: 'auto', // Add scroll if the content is too tall
          }}
        >
          {Object.entries(stableCoins).map(([coinKey, { name, loading, txns }]) => (
            <Box key={coinKey} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontFamily: 'Inter Tight, sans-serif', 
                  fontSize: '30px', 
                  marginRight: 2,
                  color: 'white', // Set the text color to white
                }}
              >
                {loading ? `Loading transactions for ${name}...` : `Loaded ${txns} transactions for ${name}`}
              </Typography>
              {loading && <CircularProgress size={36} style={{ color: 'white' }} />}
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LoadingScreen;
