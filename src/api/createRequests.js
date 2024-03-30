import { getERC20Transactions, getNormalTransactions } from './transactions';
import { fetchHistoricalPriceData } from './price';

const createGetNormalTxns = ({ apiUri, apiKey, chain, endblock }) => async walletAddress => getNormalTransactions(walletAddress, { apiUri, apiKey, chain, endblock });

const createGetERC20Txns = ({ apiUri, apiKey, chain, endblock }) => async (walletAddress, contractAddress) => getERC20Transactions(walletAddress, { apiUri, apiKey, chain, endblock }, contractAddress);


const createGetPrices = ({ conversionCurrency, currencyName, currencyDisplayName, txnDateRange }) => async () => {
    // Check if the start date is the same as the end date (today), indicating the data is up-to-date
    if (txnDateRange.startDate === txnDateRange.endDate) {
        console.log(`${currencyDisplayName} prices are already up-to-date.`);
        return; 
    }

    try {
        // Data is outdated, proceed with fetching new price data
        const prices = await fetchHistoricalPriceData(currencyName, conversionCurrency, txnDateRange);
        return prices;
    } catch (error) {
        console.error(`Error fetching ${currencyDisplayName} prices:`, error);
        throw error; // Rethrow the error for handling elsewhere
    }
};

export const txnRequestsBuilder = ({ apiUri, apiKey, chain, endblock, txnDateRange, conversionCurrency, currencyName, currencyDisplayName }) => ({
    normalTxns: createGetNormalTxns({ apiUri, apiKey, chain, endblock }),
    erc20Txns: createGetERC20Txns({ apiUri, apiKey, chain, endblock }),
    getPrices: createGetPrices({ conversionCurrency, currencyName, currencyDisplayName, txnDateRange })
});

