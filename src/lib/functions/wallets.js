import { convertTime } from "./datetime";
import { getNameByAddress } from "../../lookup/wallets";
import { checkMoveType } from "./datetime";

export const filterTxns = (txns, { type, filterWallet, chain, dateRange, direction }) => {
    // If initial render, return all txns (check if all filter conditions are not set)
    if (type === '' && filterWallet === '' && chain === '' && (dateRange.startDate === '' || dateRange.endDate === '') && type === '' && direction === '') {
        return txns.filter(txn => txn.amount !== 0).sort((a, b) => b.timestamp - a.timestamp);
    }

    return txns.filter(txn => {
        let matchesFilterWallet = true;
        let matchesChain = true;
        let matchesDateRange = true;
        let matchesDirection = true;
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

        // (3) filter by date range
        if (dateRange && dateRange.startDate && dateRange.endDate) {
            const mstOffsetMillis = 7 * 60 * 60 * 1000;  // Offset in milliseconds for 7 hours

            // Create new Date objects in UTC, subtract offset to convert to MST, then get time in milliseconds
            const startDate = new Date(new Date(dateRange.startDate).getTime() + mstOffsetMillis).getTime();
            const endDate = new Date(new Date(dateRange.endDate).getTime() + mstOffsetMillis).getTime();

            matchesDateRange = txn.timestamp >= startDate && txn.timestamp <= endDate;
        }

        // (4) filter by direction
        if (direction) {
            matchesDirection = txn.inout.toLowerCase() === direction.toLowerCase();
        }

        // (5) filter by type
        if (type) {
            matchesType = txn.walletType === type;
        }

        return matchesFilterWallet && matchesChain && matchesDateRange && matchesDirection && matchesType;
    }).sort((a, b) => b.timestamp - a.timestamp); // sort by timestamp
};


export const getUniqueWallets = txns => {
    return Array.from(
        new Set(txns.flatMap(txn => [txn.to, txn.from]))
    ).filter(wallet => wallet);
};

export const getUniqueTypes = (tableData) => {
    const types = tableData.map(row => row.walletType);
    return [...new Set(types)].filter(type => type);
};


export const formatAmount = (chain, value) => chain === 'bsc' ? value / 1e18 : value / 1e6;

export const formatAmountDisplay = (value) => {
    return value.toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

// need to make this function mulit-chain
const formatTxnLink = (hash) => (
    <a href={`https://arbiscan.io/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="txnLink">
        Txn
    </a>
);

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

export const generateTableData = (txn, id, selectedWallets) => {
    const selectedWalletsLowercase = selectedWallets.map(address => address.toLowerCase());
    const amount = formatAmount(txn.chain, txn.value);
    const walletType = getWalletType(txn, selectedWallets);
    const timestamp = parseInt(txn.timeStamp) * 1000;

    let type = walletType;
    if (txn.from === '0xb79E768bEF0Ca0a34E53c3FE2ac26E600ACf8ccA' && txn.to === '0xf534fe3c6061d61458c3f6ca29b2d5ba7855e95d') {
        type = checkMoveType(walletType, timestamp);
    }

    return {
        id,
        chain: txn.chain,
        timestamp,
        dateTime: convertTime(timestamp, 'America/Denver'),
        txn: formatTxnLink(txn.hash),
        from: txn.from,
        to: txn.to,
        walletType: type,
        inout: txn.from && selectedWalletsLowercase.includes(txn.from.toLowerCase()) ? 'Out' : 'In',
        amount,
        amountDisplay: formatAmountDisplay(amount),
        currency: txn.tokenSymbol,
    }
};

export const generateAllocationTableData = (tableData, selectedWallet) => {
    if (!selectedWallet || !selectedWallet.address) {
        return [];
    }

    const memberMap = tableData.reduce((map, row) => {
        const { from, to, walletType, amount } = row;
        if (walletType !== 'Member') return map;

        const uniqueMemberWallet = from?.toLowerCase();
        if (uniqueMemberWallet && uniqueMemberWallet !== selectedWallet.address.toLowerCase()) {
            const existingData = map.get(uniqueMemberWallet) || { amount: 0, contributions: 0, refunds: 0, contributionsAmount: 0, refundsAmount: 0 };
            map.set(uniqueMemberWallet, {
                amount: existingData.amount + Number(amount),
                contributions: existingData.contributions + 1,
                refunds: existingData.refunds,
                contributionsAmount: existingData.contributionsAmount + Number(amount),
                refundsAmount: existingData.refundsAmount
            });
        }

        const refundMemberWallet = to?.toLowerCase();
        if (refundMemberWallet && refundMemberWallet !== uniqueMemberWallet && refundMemberWallet !== selectedWallet.address.toLowerCase()) {
            const existingData = map.get(refundMemberWallet) || { amount: 0, contributions: 0, refunds: 0, contributionsAmount: 0, refundsAmount: 0 };
            map.set(refundMemberWallet, {
                amount: existingData.amount - Number(amount),
                contributions: existingData.contributions,
                refunds: existingData.refunds + 1,
                contributionsAmount: existingData.contributionsAmount,
                refundsAmount: existingData.refundsAmount + Number(amount)
            });
        }

        return map;
    }, new Map());

    const allocationTableData = Array.from(memberMap, ([uniqueMemberWallet, { amount, contributions, refunds, contributionsAmount, refundsAmount }]) => ({
        uniqueMemberWallet,
        amount,
        contributions,
        refunds,
        net: contributions - refunds,
        contributionsAmount,
        refundsAmount,
        netAmount: contributionsAmount - refundsAmount
    }));

    return allocationTableData;
};