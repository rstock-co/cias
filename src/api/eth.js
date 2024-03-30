import { ETH_API_KEY, historicalPrices } from '../lib/data';
import { getLastDateFromData, getTodaysDate } from '../lib/functions/time';
import { txnRequestsBuilder as createRequests } from './createRequests';

const today = getTodaysDate();
console.log('today:', today);

const ETH = {
    apiUri: 'https://api.etherscan.io/api',
    apiKey: ETH_API_KEY,
    chain: 'eth',
    txnDateRange: {
        startDate: getLastDateFromData(historicalPrices.eth),
        endDate: getTodaysDate()
    },
    conversionCurrency: 'usd',
    currencyName: 'eth',
    currencyDisplayName: 'Ethereum',
    endblock: '99999999'
};

export const { normalTxns: getNormalTxnsEth, erc20Txns: getERC20TxnsEth, getPrices: getEtheriumPrices } = createRequests(ETH);
