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
        if (data) {
            return JSON.parse(data);
        }
        return []; 
    };

    const findSavedTableId = (existingTables, newWallets) => {
        const newTableIdentifier = generateTableWalletsIdentifier(newWallets);
        console.log("New Table Identifier:", newTableIdentifier);
    
        const foundTable = existingTables.find(table => {
            const existingTableIdentifier = generateTableWalletsIdentifier(table.selectedWallets);
            console.log("Existing Table Identifier:", existingTableIdentifier);
    
            return newTableIdentifier === existingTableIdentifier;
        });
    
        if (foundTable) {
            console.log("Found matching table with ID:", foundTable.id);
        } else {
            console.log("No matching table found");
        }
    
        return foundTable ? foundTable.id : null;
    };
    

    useEffect(() => {
        // Load tables from local storage
        const loadedTables = loadTablesFromLocalStorage();
        setSavedTables(loadedTables);
    }, []);
    
    useEffect(() => {
        console.log("findSavedTableId called from useEffect...")
        const newSavedTableId = findSavedTableId(savedTables, selectedWallets);
        console.log("Saved Table ID from useEffect:", newSavedTableId);
        setSavedTableId(newSavedTableId);
    }, [savedTables, selectedWallets]);
    

    // DEBUGGING, remove later
    useEffect(() => {
        console.log("Saved Table ID updated in state:", savedTableId);
    }, [savedTableId]);
    

    // Save tables to local storage whenever they change
    useEffect(() => {
        saveTablesToLocalStorage(savedTables);
    }, [savedTables]);
    
    const handleToggleChip = (savedTableID, txnHash, isBlended, txnAmount) => {
        setTransferTxnsToBlend(prevTxnsToBlend => {
            let tableTxns = prevTxnsToBlend[savedTableID];
    
            if (!tableTxns) {
                // If this is the first transaction to be blended for this table, initialize it
                tableTxns = {
                    txnsToBlend: [],
                    totalAmount: 0,
                };
            }
    
            if (isBlended) {
                if (!tableTxns.txnsToBlend.includes(txnHash)) {
                    tableTxns.txnsToBlend.push(txnHash);
                    tableTxns.totalAmount += txnAmount;
                }
            } else {
                if (tableTxns.txnsToBlend.includes(txnHash)) {
                    tableTxns.txnsToBlend = tableTxns.txnsToBlend.filter(id => id !== txnHash);
                    tableTxns.totalAmount -= txnAmount;
                }
            }
    
            return {
                ...prevTxnsToBlend,
                [savedTableID]: tableTxns
            };
        });
    };    
    
    const isTxnBlended = (savedTableID, txnHash) => {
        const tableTxns = transferTxnsToBlend[savedTableID];
        return tableTxns ? tableTxns.txnsToBlend.includes(txnHash) : false;
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
