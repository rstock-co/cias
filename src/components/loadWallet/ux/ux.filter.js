import { useEffect, useState } from 'react';
import { filterTxns, generateTableData } from '../../../lib/functions/wallets';
import { curry } from '../../../lib/functions/fp';

const FilterUX = ({
    txns,
    setTableData,
    selectedWallets,

} = {}) => {
    const [filters, setFilters] = useState({
        type: "",
        chain: "",
        filterWallet: '',
        dateRange: { startDate: "", endDate: "" },
        direction: "",
        move: "",
    });

    const handleValueChange = curry((filterName, value) =>
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: value
        }))
    );

    const handleEventChange = curry((filterName, event) =>
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
        const handler = handleValueChange('dateRange');
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
        console.log('useEffect triggered');
        console.log('Current filters:', filters);
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
        handleValueChange,
        handleEventChange,
        handleDateChange,
        handleClearFilters,
        isStartDateDefault,
        isEndDateDefault
    };
};

export default FilterUX;
