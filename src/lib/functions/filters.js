export const filterByDateRange = (start, end, timestamp, useOffset) => {
    const mstOffsetMillis = useOffset ? 7 * 60 * 60 * 1000 : 0;  // Offset in milliseconds for 7 hours (MST)
    const startDate = new Date(new Date(start).getTime() + mstOffsetMillis).getTime();
    const endDate = new Date(new Date(end).getTime() + mstOffsetMillis).getTime();

    return timestamp >= startDate && timestamp <= endDate;
};

export const filterTxns = (txns, { filterWallet, chain, dateRange, direction, move, type }) => {
    // If initial render, return all txns (check if all filter conditions are not set)
    if (type === '' && filterWallet === '' && chain === '' && (dateRange.startDate === '' || dateRange.endDate === '') && direction === '' && move === '') {
        return txns.filter(txn => txn.amount !== 0).sort((a, b) => b.timestamp - a.timestamp);
    }

    console.log("filtering txns");
    console.log("filterWallet:", filterWallet);
    console.log("chain:", chain);
    console.log("dateRange:", dateRange);
    console.log("direction:", direction);
    console.log("move:", move);
    console.log("type:", type);

    return txns.filter(txn => {
        let matchesFilterWallet = true;
        let matchesChain = true;
        let matchesDateRange = true;
        let matchesDirection = true;
        let matchesMove = true;
        let matchesType = true;

        // (0) filter out transactions where the amount is zero
        if (txn.amount === 0) return false;

        // (1) filter by filterWallet
        if (filterWallet !== '') {
            matchesFilterWallet = txn.from === filterWallet || txn.to === filterWallet;
        }

        // (2) filter by chain
        if (chain) {
            matchesChain = txn.chain === chain;
        }

        // (3) filter by date picker date range
        if (dateRange && dateRange.startDate && dateRange.endDate) {
            matchesDateRange = filterByDateRange(dateRange.startDate, dateRange.endDate, txn.timestamp, true);
        }

        // (4) filter by direction
        if (direction) {
            matchesDirection = txn.flow.toLowerCase() === direction.toLowerCase();
        }

        // (5) filter by move date range
        if (move) {
            matchesMove = txn.moveName === move;
        }

        // (6) filter by type (description)
        if (type) {
            matchesType = type === "Member" ? txn.walletDescription.startsWith("Member") : txn.walletDescription === type;
        }

        return matchesFilterWallet && matchesChain && matchesDateRange && matchesDirection && matchesMove && matchesType; 
    }).sort((a, b) => b.timestamp - a.timestamp); // sort by timestamp
};