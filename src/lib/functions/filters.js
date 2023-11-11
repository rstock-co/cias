import { moves } from "../data/moves";

export const filterByDateRange = (start, end, txn, useOffset) => {
    const mstOffsetMillis = useOffset ? 7 * 60 * 60 * 1000 : 0;  // Offset in milliseconds for 7 hours (MST)
    const startDate = new Date(new Date(start).getTime() + mstOffsetMillis).getTime();
    const endDate = new Date(new Date(end).getTime() + mstOffsetMillis).getTime();

    return txn.timestamp >= startDate && txn.timestamp <= endDate;
};

export const filterTxns = (txns, { description, filterWallet, chain, dateRange, direction, move }) => {
    // If initial render, return all txns (check if all filter conditions are not set)
    if (description === '' && filterWallet === '' && chain === '' && (dateRange.startDate === '' || dateRange.endDate === '') && direction === '' && move === '') {
        return txns.filter(txn => txn.amount !== 0).sort((a, b) => b.timestamp - a.timestamp);
    }

    return txns.filter(txn => {
        let matchesFilterWallet = true;
        let matchesChain = true;
        let matchesDateRange = true;
        let matchesDirection = true;
        let matchesMove = true;
        let matchesDescription = true;

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
            matchesDateRange = filterByDateRange(dateRange.startDate, dateRange.endDate, txn, true);
        }

        // (4) filter by direction
        if (direction) {
            matchesDirection = txn.inout.toLowerCase() === direction.toLowerCase();
        }

        // (5) filter by move date range
        if (move) {
            const targetMove = moves.find(m => m.moveName === move);
            if (targetMove && targetMove.contributionOpen && targetMove.contributionClose) {
                matchesMove = filterByDateRange(targetMove.contributionOpen, targetMove.contributionClose, txn, false);
            } else { 
                matchesMove = false
            }; 
        }

        // (6) filter by description
        if (description) {
            matchesDescription = description === "Member" ? txn.walletDescription.startsWith(description) : txn.walletDescription === description;
        }

        return matchesFilterWallet && matchesChain && matchesDateRange && matchesDirection && matchesDescription && matchesMove;
    }).sort((a, b) => b.timestamp - a.timestamp); // sort by timestamp
};