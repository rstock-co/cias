import { BSC_API_KEY } from '../lib/data';
import { txnRequestsBuilder as createRequests } from './createRequests';
import { getTodaysDate } from '../lib/functions/time';

const BSC = {
    apiUri: 'https://api.bscscan.com/api',
    apiKey: BSC_API_KEY,
    chain: 'bsc',
    txnDateRange: {
        startDate: '2023-01-01',
        endDate: getTodaysDate()
    },
    conversionCurrency: 'usd',
    currencyName: 'bnb',
    currencyDisplayName: 'BNB',
    endblock: '99999999'
}


export const { normalTxns: getNormalTxnsBsc, erc20Txns: getERC20TxnsBsc, getPrices: getBNBPrices } = createRequests(BSC);
