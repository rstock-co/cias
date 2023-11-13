import { getMoveAttribute } from "../../lib/functions/wallets";

export const generateMemberSummaryTableData = (tableData, memberWallet) => {

    return Object.entries(tableData
        .filter(move => move.from === memberWallet.toLowerCase() || move.to === memberWallet.toLowerCase())
        .reduce((summary, txn) => {
            const { moveName, flow, amount } = txn;
            const moveKey = moveName || 'Other Moves';
            const token = getMoveAttribute(moveName, ["token"])?.token;

            if (!summary[moveKey]) {
                summary[moveKey] = { moveName: moveKey, token, contributionsCount: 0, contributionsTotal: 0, refundsCount: 0, refundsTotal: 0, transactionsCount: 0, netTotal: 0 };
            }

            summary[moveKey][flow === 'In' ? 'contributionsCount' : 'refundsCount'] += 1;
            summary[moveKey][flow === 'In' ? 'contributionsTotal' : 'refundsTotal'] += amount;
            summary[moveKey].netTotal = summary[moveKey].contributionsTotal - summary[moveKey].refundsTotal;

            return summary;
        }, {}))
        .map(entry => ({
            ...entry[1], // spread the values of the summary object
            moveName: entry[0] // override the moveName as key
        }));
};