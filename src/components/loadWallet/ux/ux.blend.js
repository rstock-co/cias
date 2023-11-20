import { useState, useEffect } from 'react';

const BlendUX = ({ transferTxnsToBlend, savedTables, tableData } = {}) => {   
    const [blendedTableList, setBlendedTableList] = useState([]);

/**
 *  This is the logic for the blended table list, which determines whether 
 *  the Generate Allocations button will open the blended table or the regular table.
 * 
 *  1. Create a set txnHashes containing all transaction hashes from tableData.
 *  2. Use filter and map to extract tableID from transferTxnsToBlend where the transaction hash is in txnHashes.
 *  3. Filter savedTables based on whether their IDs are in the list of matching tableIDs from transferTxnsToBlend, and convert the result into a set to ensure uniqueness.
 *  4. Update the blendedTableList state with the resulting set.
 */

    useEffect(() => {
        const txnHashes = new Set(tableData.map(txn => txn.hash));
        const matchingTableIds = Object.entries(transferTxnsToBlend)
            .filter(([txnHash, txnInfo]) => txnHashes.has(txnHash))
            .map(([_, txnInfo]) => txnInfo.tableID);

        const filteredTableIds = new Set(
            savedTables
                .filter(table => matchingTableIds.includes(table.id))
                .map(table => table.id)
        );

        setBlendedTableList(Array.from(filteredTableIds));
    }, [transferTxnsToBlend, savedTables, tableData]);

    return { blendedTableList };
}

export default BlendUX;

