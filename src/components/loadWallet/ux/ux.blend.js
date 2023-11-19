import { useState, useEffect } from 'react';

const BlendUX = ({ transferTxnsToBlend, savedTables } = {}) => {   
    const [blendedTableList, setBlendedTableList] = useState([]);

    useEffect(() => {
        // Prepare a set to hold matching savedTable IDs
        let matchingTableIds = new Set();
    
        // Iterate through each transaction in transferTxnsToBlend
        Object.entries(transferTxnsToBlend).forEach(([txnHash, txnInfo]) => {
            // Check if the savedTable matches the transaction's table ID
            if (savedTables.some(table => table.id === txnInfo.tableID)) {
                matchingTableIds.add(txnInfo.tableID);
            }
        });
    
        // Update the state with the array of matching table IDs
        setBlendedTableList(Array.from(matchingTableIds));
    }, [transferTxnsToBlend, savedTables]); // Dependencies for useEffect

    return {
        blendedTableList
    };
}

export default BlendUX;
