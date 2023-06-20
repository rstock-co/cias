import { useState } from 'react';
import { getAddressByName } from '../../lookup/wallets';

const BaseUX = ({
    txns,
    setTxns,
    setSelectedWallets,
    fetchTransactions,
    arbStatus,
    ethStatus,
    bscStatus,
    setArbStatus,
    setEthStatus,
    setBscStatus
} = {}) => {

    // TABLE DATA
    const [tableData, setTableData] = useState([]);

    const handleSelectedWalletChange = event => {
        const { target: { value } } = event;
        const walletNames = typeof value === 'string' ? value.split(',') : value;

        const walletAddresses = walletNames.map(name => getAddressByName(name).toLowerCase());

        const selectedWallets = walletNames.map((name, i) => ({
            name,
            address: walletAddresses[i]
        }));

        const filterByWalletAddresses = (addresses, data) => {
            return data.filter(item => {
                return addresses.includes(item.from.toLowerCase()) ||
                    addresses.includes(item.to.toLowerCase());
            });
        }

        const newTxns = filterByWalletAddresses(walletAddresses, txns);
        const newTableData = filterByWalletAddresses(walletAddresses, tableData);

        const walletsToFetch = selectedWallets.filter(wallet => {
            const isAddressFetched = newTxns.some(txn => txn.to.toLowerCase() === wallet.address.toLowerCase());
            return !isAddressFetched;
        });

        // avoid api call if a wallet is deselected from the multi-select box
        if (walletsToFetch.length > 0) {
            setArbStatus({ ...arbStatus, loading: true });
            setEthStatus({ ...ethStatus, loading: true });
            setBscStatus({ ...bscStatus, loading: true });

            fetchTransactions(walletsToFetch);
        }

        setTxns(newTxns);
        setTableData(newTableData);
        setSelectedWallets(selectedWallets);
    };

    console.log("All Txns: ", txns)
    console.log("Table data: ", tableData);

    return {
        tableData,
        setTableData,
        handleSelectedWalletChange,
    }
}

export default BaseUX;
