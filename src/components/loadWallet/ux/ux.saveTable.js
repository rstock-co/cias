import { useState, useEffect } from 'react';

const SaveTableUX = () => {
    // DIALOG BOX STATES
    const [savedTables, setSavedTables] = useState([]);
    const [transferTxnsToBlend, setTransferTxnsToBlend] = useState([]);
    const [isBlended, setIsBlended] = useState(false);

    const handleToggleChip = (savedTableID, txnId, isBlended) => {
        setTransferTxnsToBlend(prevTxnsToBlend => {
          // Find the table object or initialize it
          const tableTxns = prevTxnsToBlend.find(item => item.savedTableID === savedTableID) || { savedTableID, txnsToBlend: [] };
      
          if (isBlended) {
            // Add the transaction ID to the array if it's not already there
            tableTxns.txnsToBlend = tableTxns.txnsToBlend.includes(txnId) ? tableTxns.txnsToBlend : [...tableTxns.txnsToBlend, txnId];
          } else {
            // Remove the transaction ID from the array
            tableTxns.txnsToBlend = tableTxns.txnsToBlend.filter(id => id !== txnId);
          }
      
          // Update the state with the modified table transactions or add a new table object
          return prevTxnsToBlend.some(item => item.savedTableID === savedTableID) ?
                 prevTxnsToBlend.map(item => item.savedTableID === savedTableID ? tableTxns : item) :
                 [...prevTxnsToBlend, tableTxns];
        });
    };

    const isTxnBlended = (savedTableID, txnId) => {
        const tableTxns = transferTxnsToBlend.find(item => item.savedTableID === savedTableID);
        return tableTxns ? tableTxns.txnsToBlend.includes(txnId) : false;
    };
      
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
    const getSavedTableIDFromDescription = (walletDescription, savedTables) => {
        if (!walletDescription.startsWith("Transfer from ")) {
            return null;
        }
    
        const transferTarget = walletDescription.substring("Transfer from ".length);
        const matchingTable = savedTables.find(table => table.walletNames.includes(transferTarget));
        return matchingTable ? matchingTable.id : null;
    };
    
    return {
        savedTables,
        saveTableData,
        handleToggleChip,
        transferTxnsToBlend,
        isTxnBlended,
        isBlended,
        setIsBlended,
        getSavedTableIDFromDescription,
    }
}

export default SaveTableUX;
