import { useEffect, useState } from 'react';
import { filterTxns, generateTableData } from '../../../lib/functions/wallets';

const FilterUX = ({
    txns,
    tableData,
    setTableData,
    selectedWallets,

} = {}) => {
    const [filters, setFilters] = useState({
        type: "",
        chain: "",
        filterWallet: '',
        dateRange: { startDate: "", endDate: "" },
        direction: "",
    });

    const handleFilterChange = (filterName, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: value
        }));
    };

    useEffect(() => {
        if (txns && txns.length > 0 && selectedWallets && selectedWallets.length > 0) {
            const selectedWalletAddresses = selectedWallets.map(wallet => wallet.address);
            const tableData = txns.map((txn, index) => generateTableData(txn, index, selectedWalletAddresses));

            const filteredTxns = filterTxns(tableData, filters);
            setTableData(filteredTxns);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [txns, selectedWallets, filters]);

    console.log("All Txns: ", txns);
    console.log("Table data: ", tableData);

    return {
        filters,
        handleFilterChange
    };
};

export default FilterUX;
