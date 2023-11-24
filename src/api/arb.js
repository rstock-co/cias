import { ARB_API_KEY } from '../lib/data';
import { getERC20Transactions, getNormalTransactions } from './functions';

export const getNormalTxnsArb = async walletAddress => {
    return getNormalTransactions(walletAddress, "https://api.arbiscan.io/api", ARB_API_KEY, 'arb');
};

// contractAddress is optional, if passed, txns will be filtered by the token (ie. Vela)
export const getERC20TxnsArb = async (walletAddress, contractAddress) => {
    return getERC20Transactions(walletAddress, contractAddress, "https://api.arbiscan.io/api", ARB_API_KEY, 'arb');
};