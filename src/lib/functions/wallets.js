import { moves } from "../data/moves";
import { allWallets as wallets, memberWallets, INVESTMENT_WALLET } from "../data/wallets";
import { filterByDateRange } from "./filters";

export const getUniqueWallets = txns => {
    return Array.from(
        new Set(txns.flatMap(txn => [txn.to, txn.from]))
    ).filter(wallet => wallet);
};

export const getUniqueTypes = (tableData) => {
    const types = tableData.map(row => {
        return row.walletDescription.startsWith("Member") ? "Member" : row.walletDescription;
    });
    // Create a set to get unique values, then convert it back to an array
    return [...new Set(types)].filter(type => type);
};

export const isPoolInvestmentsWallet = (selectedWallets) => 
    selectedWallets.length === 1 && selectedWallets[0].address === INVESTMENT_WALLET;

export const getWalletAddress = walletName => {
    const wallet = wallets.find(wallet => wallet.name === walletName);
    return wallet ? wallet.address : null;
}

export const getWalletName = (walletAddresses, walletAddress) => {
    const wallet = walletAddresses.find(wallet => wallet.address === walletAddress);
    return wallet && wallet.name;
};

export const searchWalletName = walletAddress => 
    getWalletName(wallets, walletAddress) ||
    getWalletName(memberWallets, walletAddress) ||
    'Member';

// MOVES

export const getMoveName = (timestamp) => {
    for (const move of moves) {
        if (!move.contributionWallet || move.contributionWallet.toLowerCase() !== INVESTMENT_WALLET) continue;
        if (!move.contributionOpen || !move.contributionClose) continue;

        const openTime = new Date(move.contributionOpen).getTime();
        const closeTime = new Date(move.contributionClose).getTime();

        const matchesMove = filterByDateRange(openTime, closeTime, timestamp, false);
        if (matchesMove) return move.moveName;
    }

    return 'Unknown';
};

export const getMoveAttribute = (moveName, attributeKeys) => {
    const move = moves.find(m => m.moveName === moveName);
    if (!move) return null; 

    const result = {};
    for (const key of attributeKeys) {
        result[key] = move[key];
    }
    return result;
};

export const generateTableWalletsIdentifier = (wallets) => {
    return wallets.map(wallet => `${wallet.name}-${wallet.address}`)
                  .sort()
                  .join(',');
};

export const sumObjectValues = obj => Object.values(obj).reduce((a, b) => a + b, 0);
