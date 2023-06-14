import { tableCellClasses } from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { TableCell, TableRow } from '@mui/material';
import '@fontsource/plus-jakarta-sans';
import '@fontsource/inter';

const determineBackground = (walletType, isRefund) => {
    if (isRefund) {
        return 'linear-gradient(to bottom, #0A0216, #1D0F35)'; // purple: #532491, #0A051D // like buttons: #11BCE0, #1D5AEF
    } else if (walletType === 'Member') {
        return 'linear-gradient(to bottom, #0d0d0d, #000000)';
    } else {
        return 'linear-gradient(to bottom, #063142, #01070D)'; // teal: #004C57, #031B27
    }
};

export const StyledTableCell = styled(TableCell)(({ theme, walletType, isRefund }) => ({
    position: 'relative',
    fontSize: 14,
    color: theme.palette.common.white,
    backgroundImage: determineBackground(walletType, isRefund),
    borderColor: '#5b5b5b',
    fontFamily: 'Inter, sans-serif',
    [`&.${tableCellClasses.head}`]: {
        background: 'none',
        backgroundImage: 'linear-gradient(to bottom, #07888A, #0A4963)',  // purple:  #0A0216, #1D0F35)',
        borderColor: '#999999',
        color: theme.palette.common.white,
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: '0.5px',
        fontFamily: 'Plus Jakarta Sans, sans-serif'
    },
    [`&.${tableCellClasses.body}`]: {
        // Place for body-specific styles if necessary
    },
    '&::before': {
        content: isRefund ? '""' : 'none',
        display: 'block',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 1,
    },
    '& > *': {
        position: 'relative',
        zIndex: 2,
    },
}));


export const StyledTableRow = styled(TableRow)(({ theme, isRefund, walletType }) => ({
    backgroundColor: isRefund ? '#FFA50030' : walletType === 'Member' ? 'white' : '#FFF9C4',
    '&:nth-of-type(odd)': {
        backgroundColor: isRefund ? '#FFA50030' : walletType === 'Member' ? theme.palette.action.hover : '#FFF9C4',
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));



export const loadWalletStyles = {
    background: 'radial-gradient(circle at top center, #02343C 50vh, #01070D 100vh)',  // dark blue #0D0F4D 50vh, #070310 100vh)
    pt: 50,
    p: 5,
    pb: 100,
    position: 'relative',
};

export const ColorButton = styled(Button)(({ theme }) => ({
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

export const textGradientStyle = {
    background: '-webkit-linear-gradient(left, #11BCE0, #418CFE)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    fontSize: '30px',
    fontWeight: 'bold'
};






