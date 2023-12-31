import { useState, useEffect } from 'react';
import { generateTableWalletsIdentifier } from '../../../lib/functions/wallets';

const SaveTableUX = ({selectedWallets}) => {

    const [savedTables, setSavedTables] = useState([]);
    const [transferTxnsToBlend, setTransferTxnsToBlend] = useState({});
    const [isBlended, setIsBlended] = useState(false);
    const [saveTableSnackbarOpen, setSaveTableSnackbarOpen] = useState(false);
    const [saveTableSnackbarMessage, setSaveTableSnackbarMessage] = useState("");
    const [savedTableId, setSavedTableId] = useState(null);

    const saveTablesToLocalStorage = (savedTables) => {
        const data = JSON.stringify(savedTables);
        localStorage.setItem('savedTables', data);
    };

    const loadTablesFromLocalStorage = () => {
        const data = localStorage.getItem('savedTables');
        if (data) return JSON.parse(data);
        return []; 
    };

    const findSavedTableId = (existingTables, newWallets) => {
        const newTableIdentifier = generateTableWalletsIdentifier(newWallets);
    
        const foundTable = existingTables.find(table => {
            const existingTableIdentifier = generateTableWalletsIdentifier(table.selectedWallets);
    
            return newTableIdentifier === existingTableIdentifier;
        });
    
        return foundTable ? foundTable.id : null;
    };
    
    useEffect(() => {
        // Load tables from local storage
        const loadedTables = loadTablesFromLocalStorage();
        setSavedTables(loadedTables);
    }, []);
    
    useEffect(() => {
        const newSavedTableId = findSavedTableId(savedTables, selectedWallets);
        setSavedTableId(newSavedTableId);
    }, [savedTables, selectedWallets]);
    
    // Save tables to local storage whenever they change
    useEffect(() => {
        saveTablesToLocalStorage(savedTables);
    }, [savedTables]);
    
    const handleToggleChip = (savedTableID, txnHash, isBlended, txnAmount, txnTimestamp, txnChain) => {
        setTransferTxnsToBlend(prevTxnsToBlend => {
            const newTxnsToBlend = { ...prevTxnsToBlend };
    
            if (isBlended) {
                // Add or update the transaction hash with its table ID, amount, and timestamp
                newTxnsToBlend[txnHash] = { 
                    tableID: savedTableID, 
                    amount: txnAmount, 
                    timestamp: txnTimestamp,
                    chain: txnChain
                };
            } else {
                // Remove the transaction hash if it exists
                delete newTxnsToBlend[txnHash];
            }
    
            return newTxnsToBlend;
        });
    };
      
    
    const isTxnBlended = (savedTableID, txnHash) => {
        const txnInfo = transferTxnsToBlend[txnHash];
        return txnInfo ? txnInfo.tableID === savedTableID : false;
    };

    // if the wallet description starts with "Transfer from", then it could have a blend chip rendered beside it
    const getSavedTableIDFromDescription = (walletDescription, savedTables) => {
        if (!walletDescription.startsWith("Transfer from ")) {
            return null;
        }
    
        const transferTarget = walletDescription.substring("Transfer from ".length);
    
        for (let table of savedTables) {
            for (let wallet of table.selectedWallets) {
                if (wallet.name === transferTarget) {
                    return table.id; // Return the ID of the matching table
                }
            }
        }
    
        return null; // Return null if no matching table is found
    };
    
    const saveTableData = (newData) => {
        setSavedTables(prevTables => {
            // Save new table
            const nextTableId = prevTables.length + 1;
            const newTable = { id: nextTableId, ...newData };
    
            setSaveTableSnackbarMessage(`Table # ${nextTableId} saved`);
            setSaveTableSnackbarOpen(true);
    
            return [...prevTables, newTable];
        });
    };

    const deleteTableData = (tableId) => {
        setSavedTables(prevTables => {
            // Filter out the table with the specified ID
            const updatedTables = prevTables.filter(table => table.id !== tableId);

            setSaveTableSnackbarMessage(`Table # ${tableId} deleted`);
            setSaveTableSnackbarOpen(true);
    
            return updatedTables;
        });
    };
    
    const handleCloseSaveTableSnackbar = () => {
        setSaveTableSnackbarOpen(false);
    };
    
    return {
        savedTables,
        saveTableData,
        setSavedTables,
        deleteTableData,
        savedTableId,
        handleToggleChip,
        transferTxnsToBlend,
        isTxnBlended,
        isBlended,
        setIsBlended,
        getSavedTableIDFromDescription,

        saveTableSnackbarMessage,
        saveTableSnackbarOpen,
        handleCloseSaveTableSnackbar
    }
}

export default SaveTableUX;
