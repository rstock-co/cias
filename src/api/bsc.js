import { BSC_API_KEY } from '../lib/data';
import { txnRequestsBuilder as createRequests } from './createRequests';

const BSC = {
    apiUri: 'https://api.bscscan.com/api',
    apiKey: BSC_API_KEY,
    chain: 'bsc',
    txnDateRange: {
        startDate: '2023-01-01',
        endDate: '2023-12-31'
    },
    conversionCurrency: 'usd',
    currencyName: 'bnb',
    currencyDisplayName: 'BNB',
}


export const { normalTxns: getNormalTxnsBsc, erc20Txns: getERC20TxnsBsc, getPrices: getBNBPrices } = createRequests(BSC);
