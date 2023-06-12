import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { TableCell, TableRow } from '@mui/material';
import '@fontsource/plus-jakarta-sans';
import '@fontsource/inter';

const styles = {
    refundRow: {
        backgroundColor: '#FFA50030 !important',
    }, memberRow: {
        backgroundColor: 'white !important',
        '&:nth-of-type(odd)': {
            backgroundColor: 'action.hover',
        },
    }, nonMemberRow: {
        backgroundColor: '#FFF9C4 !important',
        '&:nth-of-type(odd)': {
            backgroundColor: '#FFF9C4',
        },
    }
};

export const styleRow = (row) => {
    const isRefund = row.inout === 'Out' && row.walletType === 'Member';
    let rowStyle;
    if (isRefund) {
        rowStyle = styles.refundRow;
    } else if (row.walletType === 'Member') {
        rowStyle = styles.memberRow;
    } else {
        rowStyle = styles.nonMemberRow;
    }
    return rowStyle;
}

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        background: 'none', // clear any previous backgrounds
        backgroundImage: 'linear-gradient(to bottom, #0A0216, #1D0F35)',
        // backgroundColor: '#3447DD',
        borderColor: '#999999',
        color: theme.palette.common.white,
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: '0.5px', 
        fontFamily: 'Plus Jakarta Sans, sans-serif'
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        color: theme.palette.common.white,
        // background: 'none', // clear any previous backgrounds
        backgroundImage: 'linear-gradient(to bottom, #0d0d0d, #000000)',
        // backgroundColor: '#1d1d1d',
        borderColor: '#5b5b5b',
        fontFamily: 'Inter, sans-serif'
        // fontFamily: 'Plus Jakarta Sans, sans-serif'
    },
}));

export const StyledTableRow = styled(TableRow)(({ theme, walletType, isRefund }) => ({
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
    background: 'radial-gradient(circle at top center, #0D0F4D 50vh, #070310 100vh)',
    pt: 50,
    p: 5,
    pb: 100,
    position: 'relative',
};








