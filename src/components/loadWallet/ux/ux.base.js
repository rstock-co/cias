import { getWalletAddress } from '../../../lib/functions/wallets';
import { useState } from 'react';

const BaseUX = ({
    txns,
    setTxns,
    setSelectedWallets,
} = {}) => {

    // TABLE DATA
    const [tableData, setTableData] = useState([]);

    const handleSelectedWalletChange = event => {
        const { target: { value } } = event;
        const walletNames = typeof value === 'string' ? value.split(',') : value;
        const walletAddresses = walletNames.map(name => getWalletAddress(name));
        const selectedWallets = walletNames.map((name, i) => ({
            name,
            address: walletAddresses[i]
        }));
    
        // This function filters the transactions by wallet addresses
        const filterByWalletAddresses = (addresses, data) =>
            data.filter(item =>
                addresses.includes(item.from.toLowerCase()) ||
                addresses.includes(item.to.toLowerCase()));
    
        // Apply the filter to the current transactions and table data
        const newTxns = filterByWalletAddresses(walletAddresses, txns);
        const newTableData = filterByWalletAddresses(walletAddresses, tableData);
    
        // Update the states with the new filtered data and selected wallets
        setTxns(newTxns);
        setTableData(newTableData);
        setSelectedWallets(selectedWallets);
    };

    const handleMultiSelectWalletChange = (walletNames, reason) => {
        console.log('reason', reason)
        const walletAddresses = walletNames.map(name => getWalletAddress(name));
        const selectedWallets = walletNames.map((name, i) => ({
            name,
            address: walletAddresses[i]
        }));
    
        // This function filters the transactions by wallet addresses
        const filterByWalletAddresses = (addresses, data) =>
            data.filter(item =>
                addresses.includes(item.from.toLowerCase()) ||
                addresses.includes(item.to.toLowerCase()));
    
        // Apply the filter to the current transactions and table data
        const newTxns = filterByWalletAddresses(walletAddresses, txns);
        const newTableData = filterByWalletAddresses(walletAddresses, tableData);
    
        // Update the states with the new filtered data and selected wallets
        setTxns(newTxns);
        setTableData(newTableData);
        setSelectedWallets(selectedWallets);
    };
    
    return {
        tableData,
        setTableData,
        handleSelectedWalletChange,
        handleMultiSelectWalletChange
    }
}

export default BaseUX;

