import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledColorButton = styled(Button)(({ theme }) => ({
    background: '#04373A',
    color: '#08E2EA',
    border: '1px solid #08E2EA',
    transform: 'translateY(-2px)',
    boxShadow: '3.5px 3.5px 0 #095F71',
    transition: 'box-shadow 0.3s ease-in-out',
    // background: `linear-gradient(to right, #1D5AEF, #11BCE0)`,
    '&:hover': {
        // background: `linear-gradient(to right, #1D5AEF, #11BCE0)`,
        backgroundColor: '#094c4f',
        boxShadow: '0 0 10px #08E2EA', // 0 0 20px #1D5AEF, 0 0 30px #1D5AEF, 0 0 40px #1D5AEF',
    },
}));