export const filterByDateRange = (start, end, timestamp, useOffset) => {
    const mstOffsetMillis = useOffset ? 7 * 60 * 60 * 1000 : 0;  // Offset in milliseconds for 7 hours (MST)
    const startDate = new Date(new Date(start).getTime() + mstOffsetMillis).getTime();
    const endDate = new Date(new Date(end).getTime() + mstOffsetMillis).getTime();

    return timestamp >= startDate && timestamp <= endDate;
};

const filters = {
    filterWallet: (txn, filterWallet) => filterWallet === '' || txn.from === filterWallet || txn.to === filterWallet,
    chain: (txn, chain) => !chain || txn.chain === chain,
    dateRange: (txn, dateRange) => !dateRange || !dateRange.startDate || !dateRange.endDate || filterByDateRange(dateRange.startDate, dateRange.endDate, txn.timestamp, true),
    direction: (txn, direction) => !direction || txn.flow.toLowerCase() === direction.toLowerCase(),
    move: (txn, move) => !move || txn.moveName === move,
    type: (txn, type) => !type || (type === "Member" ? txn.walletDescription.startsWith("Member") : txn.walletDescription === type),
};

const removeZerosAndSort = (txns) => txns.filter(txn => txn.amount !== 0).sort((a, b) => b.timestamp - a.timestamp);

const noFilterIsApplied = (filterOptions) => 
    Object.values(filterOptions).every(option => {
        if (option === null || option === undefined || option === '') return true;
        if (typeof option === 'object' && option.startDate === '' && option.endDate === '') return true;
        return false;
    });

const executeFilter = (txn, filterOptions) => 
    Object.keys(filters).every(filterKey => {
        const filterFunction = filters[filterKey];
        return filterFunction(txn, filterOptions[filterKey]);
    });

export const filterTxns = (txns, filterOptions) => {

    if (noFilterIsApplied(filterOptions)) return removeZerosAndSort(txns);
    
    return txns.filter(txn => {
        if (txn.amount === 0) return false; 

        return executeFilter(txn, filterOptions)}).sort((a, b) => b.timestamp - a.timestamp);
};