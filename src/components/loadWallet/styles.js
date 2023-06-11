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