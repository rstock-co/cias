import { ETH_API_KEY } from '../lib/data';
import { getERC20Transactions, getNormalTransactions } from './transactions';
import { fetchHistoricalPriceData } from './price';

export const getNormalTxnsEth = async walletAddress => getNormalTransactions(walletAddress, "https://api.etherscan.io/api", ETH_API_KEY, 'eth');

// contractAddress is optional, if passed, txns will be filtered by the token (ie. Vela)
export const getERC20TxnsEth = async (walletAddress, contractAddress) => getERC20Transactions(walletAddress, contractAddress, "https://api.etherscan.io/api", ETH_API_KEY, 'eth');

// HISTORICAL PRICE DATA

export const ethDateRange = {
    startDate: '2023-01-01',
    endDate: '2023-12-31'
};

const ethConversionCurrency = 'usd';

export const getEtheriumPrices = async () => {
    try {
        const ethPrices = await fetchHistoricalPriceData('eth', ethConversionCurrency, ethDateRange);
        return ethPrices;
    } catch (error) {
        console.error('Error fetching Ethereum prices:', error);
        throw error; // Rethrow the error for handling in the component
    }
};

