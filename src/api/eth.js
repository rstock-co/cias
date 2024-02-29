import { ETH_API_KEY } from '../lib/data';
import { txnRequestsBuilder as createRequests } from './createRequests';
import { getTodaysDate } from '../lib/functions/time';

const ETH = {
    apiUri: 'https://api.etherscan.io/api',
    apiKey: ETH_API_KEY,
    chain: 'eth',
    txnDateRange: {
        startDate: '2023-01-01',
        endDate: getTodaysDate()
    },
    conversionCurrency: 'usd',
    currencyName: 'eth',
    currencyDisplayName: 'Ethereum',
    endblock: '99999999'
};

export const { normalTxns: getNormalTxnsEth, erc20Txns: getERC20TxnsEth, getPrices: getEtheriumPrices } = createRequests(ETH);
