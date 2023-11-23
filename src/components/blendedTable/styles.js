import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { TableRow, TableCell, Tabs, Tab } from "@mui/material";
import "@fontsource/inter-tight";


export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: 'Inter, sans-serif',
        padding: '15px 10px',
        borderBottom: 'none'
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 15,
        fontFamily: 'Inter Tight, sans-serif',
        borderBottom: 'none',
        padding: '10px 10px',  // Adjusted padding
        lineHeight: '1.1',    // Smaller line height
    },
}));

export const WideStyledTableCell = styled(StyledTableCell)({
    padding: '13px 30px',  // Adjusted padding
    // any other specific styles
});


export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

// ALLOCATION TABLE

export const totalRowStyle = {
    fontWeight: 'bold',
    fontFamily: 'Inter, sans-serif',
    backgroundColor: '#b5b5b5',
    padding: '4px 22px',  // Reduced padding; adjust as needed
    lineHeight: '1.2',    // Smaller line height; adjust as needed
};

export const totalRowStyleWithBorder = {
    ...totalRowStyle,
    borderRight: "1px solid grey"
};

export const chipStyles = {
    fontFamily: 'Inter Tight, sans-serif',
    fontWeight: 'bold',
    background: 'radial-gradient(circle at top center, #02343C 50vh, #01070D 100vh)',
    boxShadow: '0 0 10px #02343C', // Adjust the color to match the lighter version of your Chip's background
    '&:hover': {
        boxShadow: '0 0 15px #02343C', // Make the glow a bit larger on hover
    },
};

// TABLE TABS

export const StyledTabs = styled(Tabs)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'light' ? '#eee' : theme.palette.divider,
    borderRadius: 10,
    minHeight: 44,
    '.MuiTabs-flexContainer': {
        display: 'inline-flex',
        position: 'relative',
        zIndex: 1
    },
    '.MuiTabs-scroller': {
        [theme.breakpoints.up('md')]: {
            padding: '0 8px',
        }
    },
    '.MuiTabs-indicator': {
        top: 9,
        bottom: 9,
        right: 9,
        height: 'auto',
        background: 'none',
        '&:after': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            left: 4,
            right: 4,
            bottom: 0,
            borderRadius: 8,
            backgroundColor: theme.palette.mode === 'light' ? '#fff' : theme.palette.action.selected,
            boxShadow: '2px 2px 6px #096473',
        }
    }
}));

export const StyledTab = styled(Tab)(({ theme }) => ({
    '&:hover': {
        opacity: 1
    },
    minHeight: 70,
    minWidth: 96,
    fontFamily: 'Inter, sans-serif',
    [theme.breakpoints.up('md')]: {
        minWidth: 120
    },
    '.MuiTab-wrapper': {
        color: '#097c8f !important',
        textTransform: 'initial'
    },
    '&.Mui-selected': {
        color: '#097c8f !important', // Your desired color
    },
}));