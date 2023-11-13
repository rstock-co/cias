import { useEffect, useState } from 'react';
import { generateTableData } from '../data';
import { filterTxns } from '../../../lib/functions/filters';
import { curry } from '../../../lib/functions/fp';

const FilterUX = ({
    txns,
    setTableData,
    selectedWallets,

} = {}) => {
    const [filters, setFilters] = useState({
        filterWallet: '',
        chain: "",
        dateRange: { startDate: "", endDate: "" },
        direction: "",
        move: "",
        type: "",
    });

    const handleFilterValueChange = curry((filterName, value) => {
        console.log("filterName:", filterName, "value:", value);
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: value
        }))
    });

    const handleFilterChange = curry((filterName, event) =>
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: event.target.value
        }))
    );

    const [isStartDateDefault, setIsStartDateDefault] = useState(true);
    const [isEndDateDefault, setIsEndDateDefault] = useState(true);

    const handleDateChange = (newValue) => {
        const formattedStartDate = newValue[0]?.format('YYYY-MM-DD') || '';
        const formattedEndDate = newValue[1]?.format('YYYY-MM-DD') || '';
        const handler = handleFilterValueChange('dateRange');
        handler({
            startDate: formattedStartDate,
            endDate: formattedEndDate
        });

        setIsStartDateDefault(newValue[0] ? false : true);
        setIsEndDateDefault(newValue[1] ? false : true);
    };

    const handleClearFilters = () => {

        setFilters({
            type: "",
            chain: "",
            filterWallet: '',
            dateRange: { startDate: "", endDate: "" },
            direction: "",
            move: ""
        });
        setIsStartDateDefault(true);
        setIsEndDateDefault(true);
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

    return {
        filters,
        handleFilterValueChange,
        handleFilterChange,
        handleDateChange,
        handleClearFilters,
        isStartDateDefault,
        isEndDateDefault
    };
};

export default FilterUX;
