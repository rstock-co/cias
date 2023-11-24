import { BSC_API_KEY } from '../lib/data';
import { getERC20Transactions, getNormalTransactions } from './functions';

export const getNormalTxnsBsc = async walletAddress => {
    return getNormalTransactions(walletAddress, "https://api.bscscan.com/api", BSC_API_KEY, 'bsc');
};

// contractAddress is optional, if passed, txns will be filtered by the token (ie. Vela)
export const getERC20TxnsBsc = async (walletAddress, contractAddress) => {
    return getERC20Transactions(walletAddress, contractAddress, "https://api.bscscan.com/api", BSC_API_KEY, 'bsc');
};