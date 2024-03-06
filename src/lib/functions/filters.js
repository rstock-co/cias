const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const utc = require('dayjs/plugin/utc'); // UTC plugin is required for timezone plugin to work
const timezone = require('dayjs/plugin/timezone');

// Extend dayjs with the plugins
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

// Set the timezone to Mountain Standard Time
dayjs.tz.setDefault("America/Denver");

export const filterByDateRange = (start, end, timestamp) => { // useOffset

    const startDate = dayjs.tz(start, 'YYYY-MM-DD hh:mm a', "America/Denver").valueOf();
    const endDate = dayjs.tz(end, 'YYYY-MM-DD hh:mm a', "America/Denver").valueOf();

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