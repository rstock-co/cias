import { convertTime } from "./datetime";
import { getNameByAddress } from "../../lookup/wallets";

export const filterTxns = (txns, walletAddress, type) => {
    if (!type) {
        return txns.filter(txn => txn.value !== "0");
    }
    return txns
        .filter(txn =>
            txn.hasOwnProperty(type) && txn[type] && txn[type].toLowerCase() === walletAddress.toLowerCase() &&
            txn.value !== "0"
        );
}


export const formatAmount = (value) => {
    return value.toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

const formatTxnLink = (hash) => (
    <a href={`https://arbiscan.io/tx/${hash}`} target="_blank" rel="noopener noreferrer">
        Txn
    </a>
);

export const getWalletType = (txn, selectedWalletAddress) => {
    if (txn.from.toLowerCase() === selectedWalletAddress.toLowerCase()) { // 'Out' transaction
        return getNameByAddress(txn.to);
    } else if (txn.to.toLowerCase() === selectedWalletAddress.toLowerCase()) { // 'In' transaction
        return getNameByAddress(txn.from);
    }
    return 'Unknown';
}


export const generateTableData = (txn, id, selectedWallet) => ({
    id,
    chain: txn.chain,
    dateTime: convertTime(txn.timeStamp, 'America/Denver'),
    txn: formatTxnLink(txn.hash),
    from: txn.from,
    to: txn.to,
    walletType: getWalletType(txn, selectedWallet),
    inout: txn.from.toLowerCase() === selectedWallet.toLowerCase() ? 'Out' : 'In',
    amount: txn.chain === 'bsc' ? txn.value / 1000000000000000000 : txn.value / 1000000,  // Leave as a number
    currency: txn.tokenSymbol,
});

export const generateAllocationTable = (contributorTableData) => {
    const memberMap = contributorTableData.reduce((map, { contributor, amount }) => {
        const existingData = map.get(contributor) || { amount: 0, contributions: 0 };
        map.set(contributor, {
            amount: existingData.amount + Number(amount), // Convert amount to number before adding
            contributions: existingData.contributions + 1,
        });
        return map;
    }, new Map());

    return Array.from(memberMap, ([contributor, { amount, contributions }]) => ({
        contributor,
        amount, // amount is still a number
        contributions,
    }));
};


