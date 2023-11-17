import { formatAmountDisplay, formatWalletName } from "../../../lib/functions/format";
import { Box, Button } from "@mui/material";

const BlendUX = () => {   

    const calculateTotalAmount = (transferTxnsToBlend) => {
        return Object.values(transferTxnsToBlend).reduce((acc, table) => acc + table.totalAmount, 0);
    };

    const generateHeaderSummary = (transferTxnsToBlend, selectedWallets, savedTables) => (
        <>
            <Box mb={2} display="flex" flexDirection="column">
                <Box mb={1} display="flex" alignItems="center">
                    <Button variant="outlined">Action</Button>
                    <strong>Main Wallet: </strong> 
                    {selectedWallets && Array.isArray(selectedWallets) && selectedWallets.length > 0
                        ? `${selectedWallets.map(wallet => formatWalletName(wallet.name)).join(', ')} (${selectedWallets.length} wallets)`
                        : 'No wallets selected'}
                    <span>{`${Object.keys(transferTxnsToBlend).length} Transfer(s)`} (total: {calculateTotalAmount(transferTxnsToBlend)})</span>
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
                            {`${walletNames}: ${table.txnsToBlend.length} Transfer(s)`} (total: {formatAmountDisplay(table.totalAmount)} from {matchingTable.numContributors} investors)
                        </Box>
                    );
                })}
            </Box>
        </>
    );
    
    return {
        generateHeaderSummary,
    };
}

export default BlendUX;