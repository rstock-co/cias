// styles.js
import { styled } from '@mui/material/styles';
import { Dialog, Paper, Box, Typography } from '@mui/material';

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    width: '60vw',
    height: '60vh',
    margin: 'auto',
    maxWidth: 'none',
    maxHeight: 'none',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  '& .MuiDialogContent-root': {
    padding: '0px 24px 24px 24px',
    overflowY: 'visible',
  },
  '& .MuiDialog-container': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export const StyledPaper = styled(Paper)({
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1) !important', // Shadow for depth
  overflow: 'hidden !important',
  borderRadius: '15px !important', // Rounded corners
  backgroundColor: '#FFF !important', // Set a visible background color
  border: 'none !important', // Remove border
  // ... other necessary styles
});

export const StyledBox = styled(Box)({
  background: 'radial-gradient(circle at top center, #02343C 50vh, #01070D 100vh)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  overflowY: 'auto',
});

export const StyledTypography = styled(Typography)({
  fontFamily: 'Inter Tight, sans-serif',
  fontSize: '30px',
  marginRight: 2,
  color: 'white',
});
