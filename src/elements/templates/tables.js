import React from 'react';
import { Box, Typography } from '@mui/material';
import { formatAmountDisplay, FormatTxnLink } from '../../lib/functions/format';
import "@fontsource/inter-tight";

const logos = {
    arb: 'arb.png',
    eth: 'eth.png',
    bsc: 'busd.png',
  };

export const SummaryLine = ({ label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold', width: "200px" }}>
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
    <Box sx={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '16px', marginRight: '40px' }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'flex-start' }}>
            Transfer Wallet # {walletNumber}
            {walletTitle.includes('|') && (
                <Typography component="span" sx={{ fontFamily: 'Inter Tight, sans-serif', color: "#808080", fontSize: '0.6em', marginLeft: '0.5em', alignSelf: 'flex-start' }}>
                    [*Aggregated]
                </Typography>
            )}
        </Typography>

        <Typography sx={{ fontSize: '20px', fontWeight: 'lighter', fontFamily: 'Inter Tight, sans-serif'}}>
            {walletTitle}
        </Typography>

        <Typography sx={{ mb: 2, fontSize: '18px', fontFamily: 'Inter Tight, sans-serif' }}>
            Total Transfer Amount:&nbsp;&nbsp;
            <span style={{ color: '#097c8f' }}>
                {formatAmountDisplay(transferTotal)}
            </span>
        </Typography>

        {Object.entries(filteredTxns).map(([txnHash, txnData], index) => (
            <Box key={txnHash} sx={{ display: 'flex', alignItems: 'center', mb: 1, fontFamily: 'Inter Tight, sans-serif' }}>
                <img 
                src={logos[txnData.chain]} 
                alt={`${txnData.chain} logo`} 
                style={{ width: '20px', height: '20px', marginRight: '5px' }} />

                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Transfer {index + 1} &nbsp;  
                </Typography>

                <Typography variant="body1" sx={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '15px'}}>
                    <FormatTxnLink 
                        hash={txnHash} 
                        chain={txnData.chain} 
                        style={{ color: '#097c8f', textDecoration: 'underline' }} 
                    />
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                </Typography>

                <Typography variant="body1" sx={{ fontFamily: 'Inter Tight, sans-serif' }}>
                    {formatAmountDisplay(txnData.amount)}&nbsp;&nbsp;
                </Typography>

                <Typography variant="body1" sx={{ fontSize: '12px', fontFamily: 'Inter Tight, sans-serif' }}>
                    {` (${txnData.timestamp})`}
                </Typography>

            </Box>
        ))}
    </Box>
)};

