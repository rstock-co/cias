import { BASE_API_KEY } from '../lib/data';
import { txnRequestsBuilder as createRequests } from './createRequests';

export const BASE = {
    apiUri: 'https://api.basescan.org/api',
    apiKey: BASE_API_KEY,
    chain: 'base',
    conversionCurrency: 'usd',
    currencyName: 'eth',
    currencyDisplayName: 'Base',
    endblock: 'latest'
};

export const { normalTxns: getNormalTxnsBase, erc20Txns: getERC20TxnsBase } = createRequests(ARB);

