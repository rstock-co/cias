const BlendUX = ({ 
    transferTxnsToBlend,  
    tableData,
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

    return {
        isBlendedTable,
    };
}

export default BlendUX;