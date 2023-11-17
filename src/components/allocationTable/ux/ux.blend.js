import { formatAmountDisplay, formatChainMap, formatWalletName } from "../../../lib/functions/format";
import { Box, Button } from "@mui/material";

const BlendUX = ({ 
    transferTxnsToBlend,  
    savedTables,
    tableData,

    totalContributionsAmount,
    aggregatedContributionsChainMap,
    totalRefundsAmount,
    aggregatedRefundsChainMap,
    totalNetAmount,
    aggregatedTxns
} = {}) => {   

    const checkBlendedTable = () => {
        // Check if transferTxnsToBlend has any entries
        if (!transferTxnsToBlend || Object.keys(transferTxnsToBlend).length === 0) {
            return false;
        }
    
        // Flatten all txnsToBlend into a single array
        const allBlendedTxnIds = Object.values(transferTxnsToBlend)
                                       .flatMap(table => table.txnsToBlend);
    
        // Check if any transaction hash in tableData matches with the allBlendedTxnIds and starts with "Transfer to"
        return tableData.some(txn => allBlendedTxnIds.includes(txn.hash) && txn.walletDescription.startsWith("Transfer from"));
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
                    <Box mb={2} display="flex" flexDirection="column">
                        <Box mb={1} display="flex" alignItems="center">
                            <Button variant="outlined">Action</Button>
                            <strong>Main Wallet: </strong> 
                            {`${selectedWallets.map(wallet => formatWalletName(wallet.name)).join(', ')} (${selectedWallets.length} wallets)`}
                            <span>{`${Object.keys(transferTxnsToBlend).length} Transfer(s)`} (total: {calculateTotalAmount(transferTxnsToBlend)} from {savedTableData.length} investors)</span>
                        </Box>
                        {Object.entries(transferTxnsToBlend).map(([id, table], index) => {
                            const matchingTable = savedTables.find(t => t.id.toString() === id);
                            const walletNames = matchingTable && matchingTable.selectedWallets 
                                                ? matchingTable.selectedWallets.map(wallet => formatWalletName(wallet.name)).join(', ') 
                                                : 'Unknown Wallet';

                            return (
                                <Box key={id} mb={1} display="flex" alignItems="center">
                                    <Button variant="outlined">Action</Button>
                                    <strong>Blend Wallet # {index + 1}: </strong> 
                                    {`${walletNames}: ${table.txnsToBlend.length} Transfer(s)`} (total: {formatAmountDisplay(table.totalAmount)} from {savedTableData.length} investors)
                                </Box>
                            );
                        })}
                    </Box>
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