import { ETH_API_KEY } from '../lib/data';
import { txnRequestsBuilder as createRequests } from './createRequests';

const ETH = {
    apiUri: 'https://api.etherscan.io/api',
    apiKey: ETH_API_KEY,
    chain: 'eth',
    txnDateRange: {
        startDate: '2023-01-01',
        endDate: '2023-12-31'
    },
    conversionCurrency: 'usd',
    currencyName: 'eth',
    currencyDisplayName: 'Ethereum'
};

export const { normalTxns: getNormalTxnsEth, erc20Txns: getERC20TxnsEth, getPrices: getEtheriumPrices } = createRequests(ETH);
