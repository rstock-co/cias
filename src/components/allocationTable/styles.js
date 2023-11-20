import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { TableRow, TableCell } from "@mui/material";
import "@fontsource/inter-tight";


export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: 'Inter, sans-serif',
        borderBottom: 'none',
        position: 'sticky',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        fontFamily: 'Inter Tight, sans-serif',
        borderBottom: 'none',
        padding: '13px 22px',  // Adjusted padding
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
    backgroundColor: '#999999',
    padding: '4px 22px',  // Reduced padding; adjust as needed
    lineHeight: '1.2',    // Smaller line height; adjust as needed
};

export const totalRowStyleWithBorder = {
    ...totalRowStyle,
    borderRight: "1px solid grey"
};

export const chipStyles = {
    fontFamily: 'Inter Tight, sans-serif',
    fontWeight: 'regular',
    fontSize: '15px',
    backgroundColor: '#09576C',
    color: '#08E2EA',
    border: '1px solid #08E2EA',
    transform: 'translateY(-2px)',
    boxShadow: '1.5px 1.5px 0 #095F71',
    '&:hover': {
        boxShadow: '1.5px 1.5px 6px #096473',
    },
};

