import { useState, useEffect } from 'react';

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

    const saveTablesToLocalStorage = (savedTables) => {
        const data = JSON.stringify(savedTables);
        localStorage.setItem('savedTables', data);
    };

    const loadTablesFromLocalStorage = () => {
        const data = localStorage.getItem('savedTables');
        if (data) {
            return JSON.parse(data);
        }
        return []; // Return an empty array if there's no data
    };

    // Load tables from local storage when the component mounts
    useEffect(() => {
        const loadedTables = loadTablesFromLocalStorage();
        setSavedTables(loadedTables);
    }, []);

    // Save tables to local storage whenever they change
    useEffect(() => {
        saveTablesToLocalStorage(savedTables);
    }, [savedTables]);

    // if the wallet description starts with "Transfer from", then it could have a blend chip rendered beside it
    const shouldDisplayChip = (walletDescription, savedTables) => {
        if (!walletDescription.startsWith("Transfer from ")) {
            return false;
        }
    
        // Extracting the wallet name from the description
        const transferTarget = walletDescription.substring("Transfer from ".length);
        console.log("transferTarget: ", transferTarget)
    
        return savedTables.some(table => 
            table.walletNames.includes(transferTarget)
        );
    }
       

    return {
        savedTables,
        saveTableData,
        shouldDisplayChip
    }
}

export default SaveTableUX;
