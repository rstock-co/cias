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
        // Set of transaction hashes from tableData
        const txnHashes = new Set(tableData.map(txn => txn.hash));

        // Set of matching table IDs from transferTxnsToBlend
        const matchingTableIds = new Set(
            Object.entries(transferTxnsToBlend)
                .filter(([txnHash]) => txnHashes.has(txnHash))
                .map(([, txnInfo]) => txnInfo.tableID)
        );

        // Filter savedTables to include only those present in matchingTableIds
        const filteredTableIds = savedTables
            .filter(table => matchingTableIds.has(table.id))
            .map(table => table.id);

        setBlendedTableList(filteredTableIds);
    }, [transferTxnsToBlend, savedTables, tableData]);

    return { blendedTableList };
}

export default BlendUX;

