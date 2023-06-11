import { convertTime } from "./datetime";
import { wallets } from "../../lookup/wallets";

export const filterIncomming = (txns, walletAddress) => {
    return txns.filter(txn => txn.to.toLowerCase() === walletAddress.toLowerCase());
}

export const filterOutgoing = (txns, walletAddress) => {
    return txns.filter(txn => txn.from.toLowerCase() === walletAddress.toLowerCase());
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

const getWalletType = (address) => {
    const matchedWallets = wallets.filter((wallet) => wallet.address === address);
    return matchedWallets.length > 0 ? matchedWallets[0].name : "Member";
};

export const generateContributorTableData = (txn, id) => ({
    id,
    dateTime: convertTime(txn.timeStamp, 'America/Denver'),
    txn: formatTxnLink(txn.hash),
    contributor: txn.from,
    walletType: getWalletType(txn.from),
    amount: txn.value / 1000000,  // Leave as a number
    currency: txn.tokenSymbol,
});

export const generateRecieverTableData = (txn, id) => ({
    id,
    dateTime: convertTime(txn.timeStamp, 'America/Denver'),
    txn: formatTxnLink(txn.hash),
    reciever: txn.to,
    walletType: getWalletType(txn.to),
    amount: txn.value / 1000000,
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


