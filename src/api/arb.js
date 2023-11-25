import { ARB_API_KEY } from '../lib/data';
import { txnRequestsBuilder as createRequests } from './createRequests';

export const ARB = {
    apiUri: 'https://api.arbiscan.io/api',
    apiKey: ARB_API_KEY,
    chain: 'arb',
    conversionCurrency: 'usd',
    currencyName: 'eth',
    currencyDisplayName: 'Ethereum',
    endblock: 'latest'
};

export const { normalTxns: getNormalTxnsArb, erc20Txns: getERC20TxnsArb } = createRequests(ARB);

