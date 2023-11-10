import { getNameByAddress } from "../data/wallets";
import { moves } from "../data/moves";

export const getUniqueWallets = txns => {
    return Array.from(
        new Set(txns.flatMap(txn => [txn.to, txn.from]))
    ).filter(wallet => wallet);
};

export const getUniqueTypes = (tableData) => {
    const types = tableData.map(row => {
        // If the walletType starts with "Member", treat it as "Member"
        return row.walletType.startsWith("Member") ? "Member" : row.walletType;
    });
    // Create a set to get unique values, then convert it back to an array
    return [...new Set(types)].filter(type => type);
};

export const getWalletType = (txn, selectedWalletAddresses) => {
    const fromAddress = txn.from.toLowerCase();
    const toAddress = txn.to.toLowerCase();

    const selectedWalletsLowercase = selectedWalletAddresses.map(address => address.toLowerCase());

    if (selectedWalletsLowercase.includes(fromAddress)) {
        return getNameByAddress(txn.to);
    } else if (selectedWalletsLowercase.includes(toAddress)) {
        return getNameByAddress(txn.from);
    }

    return 'Unknown';
};

export const getVCMoveName = (walletType, unixTime) => {
    for (const move of moves) {
        const openTime = new Date(move.contributionOpen).getTime();
        const closeTime = new Date(move.contributionClose).getTime();

        if (unixTime >= openTime && unixTime <= closeTime && move.contributionWallet && typeof move.contributionWallet === 'string' && move.contributionWallet.toLowerCase() === '0xb79e768bef0ca0a34e53c3fe2ac26e600acf8cca'.toLowerCase()) {
            return move.moveName;
        }
    }

    return walletType;
};

export const isPoolInvestmentsWallet = (selectedWallets) => 
    selectedWallets.length === 1 && selectedWallets[0].address.toLowerCase() === "0xb79e768bef0ca0a34e53c3fe2ac26e600acf8cca".toLowerCase();




