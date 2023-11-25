import { BSC_API_KEY } from '../lib/data';
import { getERC20Transactions, getNormalTransactions } from './transactions';
import { fetchHistoricalPriceData } from './price';

export const getNormalTxnsBsc = async walletAddress => getNormalTransactions(walletAddress, "https://api.bscscan.com/api", BSC_API_KEY, 'bsc');

// contractAddress is optional, if passed, txns will be filtered by the token (ie. Vela)
export const getERC20TxnsBsc = async (walletAddress, contractAddress) => getERC20Transactions(walletAddress, contractAddress, "https://api.bscscan.com/api", BSC_API_KEY, 'bsc');

// HISTORICAL PRICE DATA

const bnbDateRange = {
    startDate: '2023-01-01',
    endDate: '2023-12-31'
}

const bnbConversionCurrency = 'usd';

export const getBNBPrices = async () => {
    try {
        const bnbPrices = await fetchHistoricalPriceData('bnb', bnbConversionCurrency, bnbDateRange);
        return bnbPrices;
    } catch (error) {
        console.error('Error fetching BNB prices:', error);
        throw error; // Rethrow the error for handling in the component
    }
};
