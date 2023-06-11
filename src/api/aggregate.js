import { getERC20TxnsArb } from "./arb";
import { getERC20TxnsBsc } from "./bsc";
import { getERC20TxnsEth } from "./eth";

export const getAggregateERC20Txns = async (walletAddress, contractAddresses) => {
    const { stableArb, stableEth, stableEth2, stableBsc } = contractAddresses;
    try {
        const [data1, data2, data3, data4] = await Promise.all([
            getERC20TxnsArb(walletAddress, stableArb),
            getERC20TxnsEth(walletAddress, stableEth),
            getERC20TxnsEth(walletAddress, stableEth2),
            getERC20TxnsBsc(walletAddress, stableBsc)
        ]);

        // Append the chain property to each transaction object.
        const d1 = data1.map(txn => ({ ...txn, chain: 'arb' }));
        const d2 = data2.map(txn => ({ ...txn, chain: 'eth' }));
        const d3 = data3.map(txn => ({ ...txn, chain: 'eth' }));
        const d4 = data4.map(txn => ({ ...txn, chain: 'bsc' }));

        return [...d1, ...d2, ...d3, ...d4];
    } catch (error) {
        console.error('Error fetching aggregate transactions:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
};