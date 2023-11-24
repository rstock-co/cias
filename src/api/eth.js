import { ETH_API_KEY } from '../lib/data';
import { getERC20Transactions, getNormalTransactions } from './functions';

export const getNormalTxnsEth = async walletAddress => {
    return getNormalTransactions(walletAddress, "https://api.etherscan.io/api", ETH_API_KEY, 'eth');
};

// contractAddress is optional, if passed, txns will be filtered by the token (ie. Vela)
export const getERC20TxnsEth = async (walletAddress, contractAddress) => {
    return getERC20Transactions(walletAddress, contractAddress, "https://api.etherscan.io/api", ETH_API_KEY, 'eth');
};