// styles.js
import { styled } from '@mui/material/styles';
import { Dialog, Box, Typography } from '@mui/material';

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    width: '60vw',
    height: '60vh',
    margin: 'auto',
    maxWidth: 'none',
    maxHeight: 'none',
    marginTop: 'auto',
    marginBottom: 'auto',
    backgroundColor: 'transparent',
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
