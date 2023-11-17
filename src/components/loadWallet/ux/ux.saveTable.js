import { useState, useEffect } from 'react';
import { generateTableWalletsIdentifier } from '../../../lib/functions/wallets';

const SaveTableUX = ({selectedWallets}) => {

    const [savedTables, setSavedTables] = useState([]);
    const [transferTxnsToBlend, setTransferTxnsToBlend] = useState({});
    const [isBlended, setIsBlended] = useState(false);
    const [saveTableSnackbarOpen, setSaveTableSnackbarOpen] = useState(false);
    const [saveTableSnackbarMessage, setSaveTableSnackbarMessage] = useState("");

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

     // Load tables from local storage when the component mounts
    useEffect(() => {
        const loadedTables = loadTablesFromLocalStorage();
        setSavedTables(loadedTables);
    }, []);

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
            // Generate the identifier for the new table's wallets
            const newTableWalletsIdentifier = generateTableWalletsIdentifier(newData.selectedWallets);
    
            // Check if a table with the same wallets already exists
            const existingTableIndex = prevTables.findIndex(table => {
                const tableWalletsIdentifier = generateTableWalletsIdentifier(table.selectedWallets);
                return newTableWalletsIdentifier === tableWalletsIdentifier;
            });
    
            if (existingTableIndex !== -1) {
                // Table already exists
                setSaveTableSnackbarMessage(`Table not saved, was saved as Table # ${existingTableIndex + 1} already`);
                setSaveTableSnackbarOpen(true);
                return prevTables;
            }
    
            // Save new table
            const nextTableId = prevTables.length + 1;
            const newTable = { id: nextTableId, ...newData };
    
            setSaveTableSnackbarMessage(`Table # ${nextTableId} saved`);
            setSaveTableSnackbarOpen(true);
    
            return [...prevTables, newTable];
        });
    };
    
    const handleCloseSaveTableSnackbar = () => {
        setSaveTableSnackbarOpen(false);
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

        saveTableSnackbarMessage,
        saveTableSnackbarOpen,
        handleCloseSaveTableSnackbar
    }
}

export default SaveTableUX;
