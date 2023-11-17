import { tableCellClasses } from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { TableHead, TableCell, TableRow } from '@mui/material';
import '@fontsource/plus-jakarta-sans';
import "@fontsource/inter-tight"
import "@fontsource/inter"

const determineBackground = (walletdescription, outflow) => {
    if (outflow) {
        return 'linear-gradient(to bottom, #0A0216, #1D0F35)';
    } else if (walletdescription && walletdescription.startsWith('Member')) {
        return 'linear-gradient(to bottom, #0d0d0d, #000000)';
    } else {
        return 'linear-gradient(to bottom, #063142, #01070D)';
    }
};

export const StyledTableHead = styled(TableHead)(({ theme }) => ({
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--body-bg)', // Define this variable or replace with a specific value
    zIndex: 7,
    position: 'sticky',
    top: 0,
    fontWeight: 700,
    '& span': {
      opacity: 0,
      transform: 'translateY(-100%)',
      transition: theme.transitions.create(['opacity', 'transform'], {
        duration: theme.transitions.duration.standard,
      }),
    },
    '& .MuiTableCell-head': { // This targets Material-UI's TableCell with the 'head' class
        padding: '8px 16px', // Example of reduced padding; adjust as needed
        // If you have a specific height in mind, you can set it here:
        height: '40px', // Or any other value that suits your design
    },
}));


export const StyledTableCell = styled(TableCell)(({ theme, walletdescription, outflow }) => ({
    position: 'relative',
    fontSize: 14,
    color: "#e6e6e6",
    backgroundImage: determineBackground(walletdescription, outflow),
    borderColor: '#5b5b5b',
    fontFamily: 'Inter Tight, sans-serif',
    [`&.${tableCellClasses.head}`]: {
        background: 'none',
        backgroundImage: 'linear-gradient(to bottom, #07888A, #0A4963)',  // purple:  #0A0216, #1D0F35)',
        borderColor: '#999999',
        color: theme.palette.common.white,
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: '0.5px',
        fontFamily: 'Inter, sans-serif'
    },
    [`&.${tableCellClasses.body}`]: {
        // Set the height and line height for body cells
        height: '35px',
        padding: '4px 8px', // Adjust padding to reduce height, keep horizontal padding the same for alignment
        lineHeight: '35px', // Set line height to 'normal' to ensure text fits within the new height
    },
    '&::before': {
        content: outflow ? '""' : 'none',
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


export const StyledTableRow = styled(TableRow)(({ theme, outflow, walletdescription }) => ({
    backgroundColor: outflow ? '#FFA50030' : (walletdescription && walletdescription.startsWith('Member')) ? 'white' : '#FFF9C4',
    '&:nth-of-type(odd)': {
        backgroundColor: outflow ? '#FFA50030' : (walletdescription && walletdescription.startsWith('Member')) ? theme.palette.action.hover : '#FFF9C4',
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

export const loadScreenStyles = {
    background: 'radial-gradient(circle at top center, #02343C 50vh, #01070D 100vh)',  // dark blue #0D0F4D 50vh, #070310 100vh)
    pt: 50,
    p: 5,
    pb: 150,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    color: '#ffffff',
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






