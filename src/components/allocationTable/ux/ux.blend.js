import { formatAmountDisplay, formatChainMap, formatWalletName } from "../../../lib/functions/format";
import { Box, Button } from "@mui/material";

const BlendUX = ({ 
    transferTxnsToBlend,  

    totalContributionsAmount,
    aggregatedContributionsChainMap,
    totalRefundsAmount,
    aggregatedRefundsChainMap,
    totalNetAmount,
    aggregatedTxns
} = {}) => {   

    const checkBlendedTable = () => {
        return Object.values(transferTxnsToBlend).some(table => table.txnsToBlend && table.txnsToBlend.length > 0);
    };

    const isBlendedTable = checkBlendedTable();

    const calculateTotalAmount = (transferTxnsToBlend) => {
        return Object.values(transferTxnsToBlend).reduce((acc, table) => acc + table.totalAmount, 0);
    };

    const generateHeaderSummary = (
        transferTxnsToBlend, 
        isBlendedTable, 
        selectedWallets, 
        savedTableData, 
    ) => {
        if (!isBlendedTable) {
            return (
                <Box mb={2}>
                    <div>Total Contributions Amount: {totalContributionsAmount && formatAmountDisplay(totalContributionsAmount)}</div>
                    <div>Total Contributions: {formatChainMap(aggregatedContributionsChainMap)}</div>
                    <div>Total Refunds Amount: {totalRefundsAmount && formatAmountDisplay(totalRefundsAmount)}</div>
                    <div>Total Refunds: {formatChainMap(aggregatedRefundsChainMap)}</div>
                    <div>Total Net Amount: {totalNetAmount && formatAmountDisplay(totalNetAmount)}</div>
                    <div>Total Transactions: {formatChainMap(aggregatedTxns)}</div>
                </Box>
            );
        } else {
            return (
                <>
                    <Box mb={2} display="flex" alignItems="center">
                        <Button variant="outlined">Action</Button>
                        <strong>Main Wallet:</strong> 
                        {`${selectedWallets.map(wallet => formatWalletName(wallet.name)).join(', ')} (${selectedWallets.length} wallets)`}
                        <span>{`${Object.keys(transferTxnsToBlend).length} Transfer(s)`} (total: {calculateTotalAmount(transferTxnsToBlend)} from {savedTableData.length} investors)</span>
                    </Box>
                    {Object.entries(transferTxnsToBlend).map(([id, table], index) => (
                        <Box key={id} mb={2} display="flex" alignItems="center">
                            <Button variant="outlined">Action</Button>
                            <strong>Blend Wallet # {index + 1}:</strong> 
                            {`${table.walletName}: ${table.txnsToBlend.length} Transfer(s)`} (total: {formatAmountDisplay(table.totalAmount)} from {savedTableData.length} investors) /n
                        </Box>
                    ))}
                </>
            );
        }
    };
    
    return {
        isBlendedTable,
        generateHeaderSummary,
    };
}

export default BlendUX;