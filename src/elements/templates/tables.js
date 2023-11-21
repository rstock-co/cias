import { Box, Typography } from '@mui/material';
import { formatAmountDisplay } from '../../lib/functions/format';
import "@fontsource/inter-tight";

export const SummaryLine = ({ label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold', width: "250px" }}>
            {label}
        </Typography>
        <Typography variant="body1" sx={{ fontFamily: 'Inter Tight, sans-serif' }}>
            {value}
        </Typography>
    </Box>
);

export const TransferWalletSummary = ({ transferTxnsToBlend, transferTotal, walletTitle, walletNumber }) => {

    const filterTxns = (tableId, transferTxnsToBlend) => {
        return Object.entries(transferTxnsToBlend)
            .filter(([_, txnData]) => txnData.tableID === tableId)
            .reduce((acc, [txnHash, txnData]) => {
                acc[txnHash] = txnData;
                return acc;
            }, {});
    };


    const filteredTxns = filterTxns(walletNumber, transferTxnsToBlend);
    
    return (
    <Box sx={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '16px', marginRight: '20px' }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            Transfer Wallet # {walletNumber}
        </Typography>
        <Typography sx={{ fontSize: '20px', fontWeight: 'lighter', fontFamily: 'Inter Tight, sans-serif'}}>
            {walletTitle}
        </Typography>
        <Typography sx={{ mb: 2, fontSize: '18px', fontFamily: 'Inter Tight, sans-serif' }}>
            Total Transfer Amount:&nbsp;&nbsp;{formatAmountDisplay(transferTotal)}
        </Typography>
        {Object.entries(filteredTxns).map(([txnHash, txnData], index) => (
            <Box key={txnHash} sx={{ display: 'flex', alignItems: 'center', mb: 1, fontFamily: 'Inter Tight, sans-serif' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Transfer {index + 1} &nbsp;&nbsp;   
                </Typography>
                    {txnData.link}&nbsp;&nbsp;|&nbsp;&nbsp;

                <Typography variant="body1" sx={{fontFamily: 'Inter Tight, sans-serif'}}>
                    {txnData.timestamp}  {formatAmountDisplay(txnData.amount)}
                </Typography>
            </Box>
        ))}
    </Box>
)};

