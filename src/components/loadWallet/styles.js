import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { TableCell, TableRow } from '@mui/material';
import '@fontsource/plus-jakarta-sans';

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
        backgroundColor: '#070D3A',
        color: theme.palette.common.white,
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: 'Plus Jakarta Sans, sans-serif'
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        fontFamily: 'Plus Jakarta Sans, sans-serif'
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
    background: 'radial-gradient(circle at top center, #3A1768 50vh, #100725 100vh)',
    pt: 50,
    p: 5,
    pb: 100,
    position: 'relative',
};








