import { useState, useEffect } from 'react';

const SaveTableUX = () => {

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
    
    const handleToggleChip = (savedTableID, txnId, isBlended, txnAmount) => {
        setTransferTxnsToBlend(prevTxnsToBlend => {
            // Clone the previous state
            const updatedTxnsToBlend = {...prevTxnsToBlend};
    
            // Initialize if not present
            if (!updatedTxnsToBlend[savedTableID]) {
                updatedTxnsToBlend[savedTableID] = { txnsToBlend: [], totalAmount: 0 };
            }
    
            const tableTxns = updatedTxnsToBlend[savedTableID];
    
            if (isBlended) {
                if (!tableTxns.txnsToBlend.includes(txnId)) {
                    tableTxns.txnsToBlend.push(txnId);
                    tableTxns.totalAmount += txnAmount;
                }
            } else {
                if (tableTxns.txnsToBlend.includes(txnId)) {
                    tableTxns.txnsToBlend = tableTxns.txnsToBlend.filter(id => id !== txnId);
                    tableTxns.totalAmount -= txnAmount;
                }
            }
    
            return updatedTxnsToBlend;
        });
    };
    
    const isTxnBlended = (savedTableID, txnId) => {
        const tableTxns = transferTxnsToBlend[savedTableID];
        return tableTxns ? tableTxns.txnsToBlend.includes(txnId) : false;
    };

    // if the wallet description starts with "Transfer from", then it could have a blend chip rendered beside it
    const getSavedTableIDFromDescription = (walletDescription, savedTables) => {
        if (!walletDescription.startsWith("Transfer from ")) {
            return null;
        }
    
        const transferTarget = walletDescription.substring("Transfer from ".length);
        const matchingTable = savedTables.find(table => table.walletNames.includes(transferTarget));
        return matchingTable ? matchingTable.id : null;
    };

    const saveTableData = (newData) => {
        setSavedTables(prevTables => {
            const walletNames = newData.selectedWallets.map(wallet => wallet.name);
            const walletAddresses = newData.selectedWallets.map(wallet => wallet.address);
    
            const newTableIdentifier = `${walletNames.join(',')}-${walletAddresses.join(',')}-${newData.moveName}`;
            const existingTableIndex = prevTables.findIndex(table => {
                const existingTableIdentifier = `${table.walletNames.join(',')}-${table.walletAddresses.join(',')}-${table.moveName}`;
                return newTableIdentifier === existingTableIdentifier;
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
        saveTableSnackbarOpen
    }
}

export default SaveTableUX;
