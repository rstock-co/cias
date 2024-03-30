import { BSC_API_KEY, historicalPrices } from '../lib/data';
import { getLastDateFromData, getTodaysDate } from '../lib/functions/time';
import { txnRequestsBuilder as createRequests } from './createRequests';

const BSC = {
    apiUri: 'https://api.bscscan.com/api',
    apiKey: BSC_API_KEY,
    chain: 'bsc',
    txnDateRange: {
        startDate: getLastDateFromData(historicalPrices.bnb),
        endDate: getTodaysDate()
    },
    conversionCurrency: 'usd',
    currencyName: 'bnb',
    currencyDisplayName: 'BNB',
    endblock: '99999999'
}


export const { normalTxns: getNormalTxnsBsc, erc20Txns: getERC20TxnsBsc, getPrices: getBNBPrices } = createRequests(BSC);
