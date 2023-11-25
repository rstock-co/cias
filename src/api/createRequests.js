import { getERC20Transactions, getNormalTransactions } from './transactions';
import { fetchHistoricalPriceData } from './price';

const createGetNormalTxns = ({ apiUri, apiKey, chain, endblock }) => async walletAddress => getNormalTransactions(walletAddress, { apiUri, apiKey, chain, endblock });

const createGetERC20Txns = ({ apiUri, apiKey, chain, endblock }) => async (walletAddress, contractAddress) => getERC20Transactions(walletAddress, { apiUri, apiKey, chain, endblock }, contractAddress);


const createGetPrices = ({ conversionCurrency, currencyName, currencyDisplayName, txnDateRange }) => async () => {
    try {
        const prices = await fetchHistoricalPriceData(currencyName, conversionCurrency, txnDateRange);
        return prices;
    } catch (error) {
        console.error(`Error fetching ${currencyDisplayName} prices:`, error);
        throw error; // Rethrow the error for handling in the component
    }
};

export const txnRequestsBuilder = ({ apiUri, apiKey, chain, endblock, txnDateRange, conversionCurrency, currencyName, currencyDisplayName }) => ({
    normalTxns: createGetNormalTxns({ apiUri, apiKey, chain, endblock }),
    erc20Txns: createGetERC20Txns({ apiUri, apiKey, chain, endblock }),
    getPrices: createGetPrices({ conversionCurrency, currencyName, currencyDisplayName, txnDateRange })
});

