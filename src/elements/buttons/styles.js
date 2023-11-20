import { Button, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledColorButton = styled(Button)(({ theme }) => ({
    // background: '#04373A',
    background: `linear-gradient(to right, #022027, #04373A)`,
    color: '#08E2EA',
    border: '1px solid #08E2EA',
    transform: 'translateY(-2px)',
    boxShadow: '3.5px 3.5px 0 #095D6F',
    transition: 'box-shadow 0.3s ease-in-out',
    marginTop: 12,
    '&:hover': {
        background: '#0A5067',
        backgroundColor: '#0c546e',
        boxShadow: '0 0 10px #08E2EA', // 0 0 20px #1D5AEF, 0 0 30px #1D5AEF, 0 0 40px #1D5AEF',
    },
}));

export const StyledChip = styled(Chip)(({ theme, blended }) => ({
    fontFamily: 'Inter Tight, sans-serif',
    backgroundColor: blended ? '#048241' : '#c24a2d',
    color: 'white',
    cursor: 'pointer',
    marginLeft: 12,
    marginBottom: 2,
    height: 24,
    fontSize: '0.8rem',
    lineHeight: 1,
    paddingTop: '2px',
    paddingBottom: 0,
    '&:hover': {
        backgroundColor: blended ? '#048241' : '#c24a2d',
        boxShadow: '0 0 10px #08E2EA' // 0 0 20px #1D5AEF, 0 0 30px #1D5AEF, 0 0 40px #1D5AEF',
    },
  }));