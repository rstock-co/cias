import "@fontsource/inter-tight";
import { Box, Typography } from '@mui/material';
import { FormatTxnLink, extractTitle, formatAmountDisplay, formatChainMap } from '../../lib/functions/format';
import React from 'react';
import "./styles.css";

const logos = {
    arb: 'arb.png',
    eth: 'eth.png',
    bsc: 'busd.png',
  };

  export const SummaryLine = ({ label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold', width: "235px" }}>
            {label}
        </Typography>
        <Typography variant="body1" sx={{ fontFamily: 'Inter Tight, sans-serif', display: 'flex', alignItems: 'center' }}>
            {value}
        </Typography>
    </Box>
);


export const TransferWalletSummary = ({ transferTxnsToBlend, transferTotal, walletTitle, walletNumber }) => {

    const filterTxns = (tableId, transferTxnsToBlend) => Object.entries(transferTxnsToBlend)
            .filter(([, txnData]) => txnData.tableID === tableId)
            .reduce((acc, [txnHash, txnData]) => {
                acc[txnHash] = txnData;
                return acc;
            }, {});

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

        <Typography sx={{ fontSize: '20px', color: '#097c8f', fontFamily: 'Inter Tight, sans-serif'}}>
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

export const formatLogoChainMap = (chainMapArray) => {
    const logos = {
        arb: 'https://i.imgur.com/3kJricG.png',
        eth: 'https://i.imgur.com/iPqQBBB.png',
        bsc: 'https://i.imgur.com/a5V7FFD.png',
    };

    return Array.isArray(chainMapArray) && chainMapArray.length > 0
        ? chainMapArray.map((part, index) => {
              const [chain, number] = part.split('(');
              const count = number?.slice(0, -1);
              const logoUrl = logos[chain];

              return (
                  <span key={index} style={{ display: 'inline-flex', alignItems: 'center', marginRight: '5px' }}>
                      {logoUrl && (
                          <img
                              src={logoUrl}
                              alt={`${chain} logo`}
                              className={`spinner-${chain.toLowerCase()}`} 
                              style={{ 
                                  width: '20px', 
                                  height: '20px', 
                                  marginRight: '5px',
                              }}
                          />
                      )}
                      {count}
                  </span>
              );
          }).filter(Boolean)
        : null;
};


export const WalletSummary = ({ 
    id, walletTitle, walletType, fetchType,
    totalNetAmount, aggregatedContributionsChainMap, totalContributionsAmount, totalRefundsAmount, aggregatedRefundsChainMap, 
 } = {}) => {

    const totalContributions =  walletTitle.startsWith('Blended') ? formatLogoChainMap(formatChainMap(aggregatedContributionsChainMap)) : formatLogoChainMap(aggregatedContributionsChainMap);
    const totalRefunds =  walletTitle.startsWith('Blended') ? formatLogoChainMap(formatChainMap(aggregatedRefundsChainMap)) : formatLogoChainMap(aggregatedRefundsChainMap);
    
    return (

    <Box sx={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '16px', marginRight: '40px', marginBottom: 0 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'flex-start' }}>
            {walletType === 'Blended' ? 'Base Wallet' : `Wallet # ${id + 1}`}
            {walletTitle.includes('|') && (
                <Typography 
                    component="span" 
                    sx={{ 
                        fontFamily: 'Inter Tight, sans-serif', 
                        color: "#808080", 
                        fontSize: '0.6em', 
                        marginLeft: '0.5em', 
                        alignSelf: 'flex-start',
                        textShadow: `0 0 10px #097c8f, 0 0 20px #097c8f` // Adjust the glow effect here
                }}>
                    [*Aggregated]
                </Typography>
            
            )}
        </Typography>

        <Typography sx={{ fontSize: '20px', fontWeight: 'lighter', color: '#097c8f', fontFamily: 'Inter Tight, sans-serif'}}>
            {extractTitle(walletTitle)}
        </Typography>

        <Typography sx={{ mb: 2, fontSize: '18px', fontFamily: 'Inter Tight, sans-serif' }}>
            Total Net Amount:&nbsp;&nbsp;
            <span style={{ color: '#097c8f' }}>
                {formatAmountDisplay(totalNetAmount, fetchType)}
            </span>
        </Typography>

        <Box mb={2} mt={2}>
            <SummaryLine label="Total Contribution Txns:" value={totalContributions} />
            <SummaryLine label="Total Contributions Amount:" value={formatAmountDisplay(totalContributionsAmount, fetchType)} />
            <SummaryLine label="Total Refund Txns:" value={totalRefunds ? totalRefunds : 0} />
            <SummaryLine label="Total Refunds Amount:" value={formatAmountDisplay(totalRefundsAmount, fetchType)} />

        </Box>
    </Box>
);
            };

export const TransfersTableCell = (memberData, transferTotals) => {
    const savedWallets = Object.entries(memberData)
        .filter(([key]) => key.startsWith('savedWallet'));

    if (savedWallets.length === 0) return <Typography variant="body2" sx={{ fontFamily: 'Inter Tight, sans-serif' }}>No transfers made</Typography>;

    let totalAmount = 0;

    return (
        <Box>
            {savedWallets.map(([walletKey, walletData]) => {
                // Extract the number from the walletKey (e.g., 'savedWallet2') and use it to access the correct transferTotal
                const [transferId] = walletKey.match(/\d+$/);
                const totalForThisTransfer = transferTotals[transferId] || 0;
                const transferAmount = walletData.share * totalForThisTransfer;
                totalAmount += transferAmount;

                return (
                    <Box key={walletKey} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0, fontFamily: 'Inter Tight, sans-serif', alignItems: 'right' }}>
                        <Typography variant="body2" sx={{ fontFamily: 'Inter Tight, sans-serif', flex: 0.75, textAlign: 'right', paddingRight: 0 }}>
                            {walletData.walletName}:
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flex: 1 }}>
                            <Typography variant="body2" sx={{ fontFamily: 'Inter Tight, sans-serif', textAlign: 'right', minWidth: '50px' }}>
                                {formatAmountDisplay(transferAmount)}
                            </Typography>
                            <Typography variant="body2" sx={{ fontFamily: 'Inter Tight, sans-serif', ml: 1, mr: 0.5  }}>
                                |
                            </Typography>
                            <Typography variant="body2" sx={{ fontFamily: 'Inter Tight, sans-serif', textAlign: 'right', minWidth: '45px' }}>
                                {(walletData.share * 100).toFixed(2)}%
                            </Typography>
                        </Box>
                    </Box>
                );
            })}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0, alignItems: 'center' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', fontFamily: 'Inter Tight, sans-serif', flex: 0.75, textAlign: 'right', paddingRight: 0 }}>Total:</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', fontFamily: 'Inter Tight, sans-serif', textAlign: 'right', minWidth: '50px' }}>
                        {formatAmountDisplay(totalAmount)}
                    </Typography>
                    {/* Add empty placeholders to align with the pipes and percentages */}
                    <Typography variant="body2" sx={{ visibility: 'hidden', ml: 1, mr: 0.5 }}>|</Typography>
                    <Typography variant="body2" sx={{ visibility: 'hidden', textAlign: 'right', minWidth: '45px' }}>%</Typography>
                </Box>
            </Box>
        </Box>  
    );
}


export const BaseWalletTableCell = (baseWallet) => (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0, fontFamily: 'Inter Tight, sans-serif' }}>
        <Typography variant="body1" sx={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '15px', textAlign: 'center' }}>
            {formatAmountDisplay(baseWallet.adjustedNetAmount)} &nbsp;|&nbsp; {(baseWallet.share * 100).toFixed(2)}%  &nbsp;({baseWallet.txns} txns)
        </Typography>
    </Box>
);
