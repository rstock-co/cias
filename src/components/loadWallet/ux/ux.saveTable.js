import { useState } from 'react';

const SaveTableUX = () => {
    // DIALOG BOX STATES
    const [savedTables, setSavedTables] = useState([]);

    const saveTableData = (newData) => {
        setSavedTables(prevTables => {
            // Determine the next table ID based on the number of existing tables
            const nextTableId = prevTables.length + 1;

            const walletNames = newData.selectedWallets.map(wallet => wallet.name);
            const walletAddresses = newData.selectedWallets.map(wallet => wallet.address);

            // Create a new table object with the required structure
            const newTable = {
                id: nextTableId,
                selectedWallets: newData.selectedWallets, 
                walletNames,
                walletAddresses,
                moveName: newData.moveName || '',
                tableData: newData.tableData || '',
                numContributors: newData.numContributors || '',
                totalContributions: newData.totalContributions || '',
            };

            // Add the new table object to the array of saved tables
            return [...prevTables, newTable];
        });
    };

    return {
        savedTables,
        saveTableData
    }
}

export default SaveTableUX;
