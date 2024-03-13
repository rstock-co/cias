import { Button, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledColorButton = styled(Button)(({ highlighted }) => ({
    // background: '#04373A',
    background: highlighted ? '#0A5067' : `linear-gradient(to right, #022027, #04373A)`,
    color: '#08E2EA',
    border: '1px solid #08E2EA',
    transform: 'translateY(-2px)',
    boxShadow: highlighted ? '0 0 3px 3px #b09946' : '3.5px 3.5px 0 #095D6F',
    transition: 'box-shadow 0.3s ease-in-out',
    marginTop: 12,
    '&:hover': {
        color: highlighted ? '#49afe3' : '#08E2EA',
        background: '#0A5067',
        backgroundColor: highlighted ? '#0c3769' : '#0A5067',
        boxShadow: highlighted ? '0 0 10px #7dbaff' : '0 0 10px #08E2EA', // 0 0 20px #1D5AEF, 0 0 30px #1D5AEF, 0 0 40px #1D5AEF',
    },
}));

export const StyledChip = styled(Chip)(({ blended }) => ({
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

  
export const FetchTypeButton = styled(Button)(({ active }) => ({
    fontFamily: 'Inter Tight, sans-serif',
    fontWeight: 'regular',
    fontSize: '15px',
    background: active ? '-webkit-linear-gradient(left, #264aa6, #0b2566)' : `linear-gradient(to right, #022027, #04373A)`,
    color: active ? '#8fafff' : '#08E2EA',
    border: active ? '1px solid #5580ed !important' : '1px solid #08E2EA !important',
    transform: 'translateY(-2px)',
    boxShadow: active ? '0 0 3px 3px #b09946' : 'none',
    transition: 'box-shadow 0.3s ease-in-out, background 0.3s ease-in-out',
    marginTop: 12,
    '&:hover': {
        background: active ? '#0A5067' : '#0c546e',
        boxShadow: '0 0 3px 3px #b09946', // maintain the box shadow on hover
    },
    '&:focus, &:active, &:focus-visible': {
        border: '#3a61c2'
    },
}));


  
