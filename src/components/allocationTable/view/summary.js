import { Box, Typography } from '@mui/material';
import { WalletSummary } from '../../../elements/templates/tables';

export const TableTitleTemplate = ({ dialogTitle, isCappedMove, selectedCappedMoveWallets }) => (
    <>
        {isCappedMove && selectedCappedMoveWallets && selectedCappedMoveWallets.length > 0 ? 
            (<Typography variant="h6" sx={{ fontFamily: 'Inter', fontWeight: 'bold', fontSize: '27px', border: 'none', marginTop: '15px', marginLeft: '20px', marginBottom: '10px' }}>
                Capped Move: <span style={{ fontWeight: 600, fontSize: '29px', color: '#097c8f' }}>{selectedCappedMoveWallets[0].name}</span> 
            </Typography>) : null}
        <Typography variant="h6" sx={{ fontFamily: 'Inter', fontWeight: 'bold', fontSize: isCappedMove ? '24px' : '27px', border: 'none', marginTop: '15px', marginLeft: '20px', marginBottom: '10px' }}>
            {dialogTitle}
        </Typography>
    </>
);

const WalletSummaryTemplate = ({ 
    walletName, 
    netAmount, 
    totalContributions, 
    contributionsAmount, 
    totalRefunds, 
    refundsAmount,
    fetchType
}, index) => {
    const contributionsArray = totalContributions.split(', ').map(contribution => contribution.trim());
    return (
    <Box mb={0} mt={2} ml={3}>
        <WalletSummary
            key={index}
            id={index}
            walletTitle={walletName}
            walletType="Allocation"
            fetchType={fetchType}
            totalNetAmount={netAmount} 
            aggregatedContributionsChainMap={contributionsArray}
            totalContributionsAmount={contributionsAmount}
            totalRefundsAmount={refundsAmount}
            aggregatedRefundsChainMap={totalRefunds}
        />
    </Box>
)};

export const WalletSummariesTemplate = ({summaryData}) => summaryData && summaryData.length > 0 && (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}> 
        {summaryData.map(WalletSummaryTemplate)}
    </Box>
)

export const GenerationDateTemplate = ({generatedDateString}) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', textAlign: 'right', mb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontFamily: 'Inter Tight', fontWeight: 'bold', fontSize: '16px', textAlign: 'right' }}>
            Generated On:&nbsp;&nbsp;&nbsp;
        </Typography>
        <Typography variant="subtitle1" sx={{ fontFamily: 'Inter Tight', fontWeight: 'regular', fontSize: '18px', textAlign: 'right', marginRight: '15px' }}>
            {generatedDateString}
        </Typography>
    </Box>
);