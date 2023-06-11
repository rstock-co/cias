import { convertTime } from "./datetime";
import { getNameByAddress } from "../../lookup/wallets";
import { checkMoveType } from "./datetime";

export const filterTxns = (txns, { type, filterWallet, chain, dateRange, direction }) => {

    console.log("==========")
    console.log("type: ", type)
    console.log("filterWallet: ", filterWallet)
    console.log("chain: ", chain)
    console.log("dateRange: ", dateRange)
    console.log("direction: ", direction)

    // If initial render, return all txns (check if all filter conditions are not set)
    if (type === '' && filterWallet === '' && chain === '' && (dateRange.startDate === '' || dateRange.endDate === '') && type === '' && direction === '') return txns.filter(txn => txn.amount !== 0);

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

            console.log("txn timestamp: ", txn.timeStamp)
            console.log("start timestamp: ", startDate)
            console.log("end timestamp: ", endDate)

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

        console.log("==========")
        console.log("matchesFilterWallet: ", matchesFilterWallet)
        console.log("matchesChain: ", matchesChain)
        console.log("matchesDateRange: ", matchesDateRange)
        console.log("matchesDirection: ", matchesDirection)
        console.log("matchesType: ", matchesType)

        return matchesFilterWallet && matchesChain && matchesDateRange && matchesDirection && matchesType;
    });
};

// export const filterTxns = (txns, walletAddress, type) => {
//     if (!type) {
//         return txns.filter(txn => txn.value !== "0");
//     }
//     return txns
//         .filter(txn =>
//             txn.hasOwnProperty(type) && txn[type] && txn[type].toLowerCase() === walletAddress.toLowerCase() &&
//             txn.value !== "0"
//         );
// }

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


export const generateTableData = (txn, id, selectedWallet) => {
    const amount = formatAmount(txn.chain, txn.value);
    const walletType = getWalletType(txn, selectedWallet);
    const timestamp = parseInt(txn.timeStamp) * 1000;

    let type = walletType;
    if (selectedWallet === '0xb79E768bEF0Ca0a34E53c3FE2ac26E600ACf8ccA' && txn.to === '0xf534fe3c6061d61458c3f6ca29b2d5ba7855e95d') {
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
        inout: txn.from.toLowerCase() === selectedWallet.toLowerCase() ? 'Out' : 'In',
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
        console.log('Processing row: ', row); // Log the entire row being processed
        console.log('Amount for this row: ', amount); // Log the amount being processed
        if (walletType !== 'Member') return map;

        const uniqueMemberWallet = from?.toLowerCase();

        if (uniqueMemberWallet && uniqueMemberWallet !== selectedWallet.address.toLowerCase()) {
            const existingData = map.get(uniqueMemberWallet) || { amount: 0, contributions: 0, refunds: 0, contributionsAmount: 0, refundsAmount: 0 };
            console.log('Existing data for this member wallet: ', existingData); // Log the existing data before it is updated
            map.set(uniqueMemberWallet, {
                amount: existingData.amount + Number(amount),
                contributions: existingData.contributions + 1,
                refunds: existingData.refunds,
                contributionsAmount: existingData.contributionsAmount + Number(amount),
                refundsAmount: existingData.refundsAmount
            });
            console.log('Updated data for this member wallet: ', map.get(uniqueMemberWallet)); // Log the updated data
        }

        const refundMemberWallet = to?.toLowerCase();
        if (refundMemberWallet && refundMemberWallet !== uniqueMemberWallet && refundMemberWallet !== selectedWallet.address.toLowerCase()) {
            const existingData = map.get(refundMemberWallet) || { amount: 0, contributions: 0, refunds: 0, contributionsAmount: 0, refundsAmount: 0 };
            console.log('Existing data for this member wallet: ', existingData);
            map.set(refundMemberWallet, {
                amount: existingData.amount - Number(amount),
                contributions: existingData.contributions,
                refunds: existingData.refunds + 1,
                contributionsAmount: existingData.contributionsAmount,
                refundsAmount: existingData.refundsAmount + Number(amount)
            });
            console.log('Updated data for this member wallet: ', map.get(refundMemberWallet));
        }

        return map;
    }, new Map());

    console.log('Final Member Map:', memberMap);

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

    console.log('Final Allocation Table Data:', allocationTableData);

    return allocationTableData;
};




