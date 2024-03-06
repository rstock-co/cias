import { useEffect, useState } from 'react';
import { generateTableData } from '../data';
import { ignoreWallets } from '../../../lib/data/wallets';
import { filterTxns } from '../../../lib/functions/filters';
import { curry } from '../../../lib/functions/fp';

const FilterUX = ({
    txns,
    setTableData,
    selectedWallets,
    historicalBNBPrices,
    historicalETHPrices,

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

    const [isStartDateComplete, setIsStartDateComplete] = useState(false);
    const [isEndDateComplete, setIsEndDateComplete] = useState(false);

    const handleDateChange = (newValue) => {
        const dateFormatRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2} (am|pm)$/;

        // Format the start and end dates
        const formattedStartDate = newValue[0]?.format('YYYY-MM-DD hh:mm a') || '';
        const formattedEndDate = newValue[1]?.format('YYYY-MM-DD hh:mm a') || '';

        // Check if the formatted dates match the 'YYYY-MM-DD hh:mm a' format
        const isStartDateFormatValid = dateFormatRegex.test(formattedStartDate);
        const isEndDateFormatValid = dateFormatRegex.test(formattedEndDate);

        const handler = handleFilterValueChange('dateRange');
        handler({
            startDate: formattedStartDate,
            endDate: formattedEndDate
        });

        setIsStartDateComplete(isStartDateFormatValid);
        setIsEndDateComplete(isEndDateFormatValid);
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
        setIsStartDateComplete(false);
        setIsEndDateComplete(false);
    };

    useEffect(() => {
        if (txns && txns.length > 0 && selectedWallets && selectedWallets.length > 0) {
            const selectedWalletAddresses = selectedWallets.map(wallet => wallet.address.toLowerCase());
            
            // Start by filtering transactions that are not from ignored wallets
            let filteredTableData = txns
                .filter(txn => !ignoreWallets.some(wallet => 
                    wallet.address.toLowerCase() === txn.from.toLowerCase() || 
                    wallet.address.toLowerCase() === txn.to.toLowerCase()
                ))
                .map((txn, index) => generateTableData(txn, index, selectedWalletAddresses, historicalBNBPrices, historicalETHPrices))
                .filter(row => row !== null); // Filter out null values
    
            // Now, apply the date range filter only if both dates are complete
            if (isStartDateComplete && isEndDateComplete) {
                filteredTableData = filterTxns(filteredTableData, filters);
            } else {
                // Apply all filters except for the dateRange
                // This assumes filterTxns can somehow ignore dateRange filtering
                // or you adjust filterTxns logic to conditionally apply dateRange based on isStartDateComplete and isEndDateComplete
                const filtersWithoutDateRange = {...filters, dateRange: {startDate: "", endDate: ""}};
                filteredTableData = filterTxns(filteredTableData, filtersWithoutDateRange);
            }
            
            setTableData(filteredTableData);
        }
    }, [txns, selectedWallets, filters, isStartDateComplete, isEndDateComplete]);    
    
    return {
        filters,
        handleFilterValueChange,
        handleFilterChange,
        handleDateChange,
        handleClearFilters,
        isStartDateComplete,
        isEndDateComplete
    };
};

export default FilterUX;
