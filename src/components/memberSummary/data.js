import { getMoveAttribute, getWalletName } from "../../lib/functions/wallets";
import { format } from 'date-fns';
import { memberWallets } from "../../lib/data/wallets";
import { roundToNearest5Minutes } from '../../lib/functions/time';

export const initialTotals = () => ({
    totalContributionsCount: 0,
    totalRefundsCount: 0,
    totalContributionsAmount: 0,
    totalRefundsAmount: 0,
    totalNetAmount: 0,
    totalTransactionsCount: 0
});

export const generateMemberSummaryTableData = (tableData, memberWallet) => {
    const memberName = getWalletName(memberWallets, memberWallet) || memberWallet;

    const memberData = Object.entries(tableData
        .filter(move => move.from === memberWallet || move.to === memberWallet)
        .reduce((summary, txn) => {
            const { moveName, flow, amount } = txn;
            const moveKey = moveName || 'Other Moves';
            const token = getMoveAttribute(moveName, ["token"])?.token;

            if (!summary[moveKey]) {
                summary[moveKey] = { 
                    moveName: moveKey, 
                    token, 
                    contributionsCount: 0, contributionsTotal: 0, refundsCount: 0, refundsTotal: 0, transactionsCount: 0, netTotal: 0, 
                };
            }

            summary[moveKey][flow === 'In' ? 'contributionsCount' : 'refundsCount'] += 1;
            summary[moveKey][flow === 'In' ? 'contributionsTotal' : 'refundsTotal'] += amount;
            summary[moveKey].transactionsCount += 1;
            summary[moveKey].netTotal = summary[moveKey].contributionsTotal - summary[moveKey].refundsTotal;

            return summary;
        }, {}))
        .map(entry => ({
            ...entry[1], // spread the values of the summary object
            moveName: entry[0] // override the moveName as key
        }));
    return [memberName, ...memberData];
};

export const calculateTotals = (summaryTableData) => summaryTableData.reduce((totals, entry) => {
        totals.totalContributionsCount += entry.contributionsCount;
        totals.totalRefundsCount += entry.refundsCount;
        totals.totalContributionsAmount += entry.contributionsTotal;
        totals.totalRefundsAmount += entry.refundsTotal;
        totals.totalTransactionsCount += entry.contributionsCount + entry.refundsCount;
        totals.totalNetAmount += entry.netTotal;

        return totals;
    }, initialTotals());

export const generatedDate = () => {
    const now = new Date();
    const currentDate = format(now, "MMMM d, yyyy");
    const currentTime = format(roundToNearest5Minutes(now), "'@' h:mm aaaa 'MST'");
    return (
        <>
            {currentDate}
            <br />
            {currentTime}
        </>
    );
}
