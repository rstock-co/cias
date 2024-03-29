import { noOp, tap } from "../lib/functions/fp";
import axios from "axios";
import { searchWalletName } from "../lib/functions/wallets";

// API CALLS
//
const createRequestConfig = (walletAddress, action, { apiKey, endblock}) => ({
    params: {
        module: 'account',
        action,
        address: walletAddress,
        startblock: '0',
        endblock,
        page: '1',
        offset: '1000',
        sort: 'asc',
        apikey: apiKey,
    },
});

const normalTxns = {
    fetchType: 'normal',
    action: 'txlist'
};

const ercTxns = {
    fetchType: 'erc20',
    action: 'tokentx'
};


const getTxns = async (walletAddress, 
    { apiUri, apiKey, chain, endblock } = {}, 
    txnType = normalTxns, 
    enrichConfig = noOp) => 
{
    const requestConfig = enrichConfig(createRequestConfig(walletAddress, txnType.action, { apiKey, endblock }));

    try {
        const response = await axios.get(apiUri, requestConfig);

        // DEBUGGING LOG
        console.log(`API response for wallet ${walletAddress} on chain ${chain.toUpperCase()}:`, response.data);

         // Check if the result property exists and is an array before proceeding
        if (response.data.result && Array.isArray(response.data.result)) {
            return response.data.result.map(txn => ({
                ...txn,
                chain,
                fetchType: txnType.fetchType
            }));
        } else {
            // Log a warning if the result is not in the expected format
            console.warn(`YYY: Unexpected format for 'result' in response for wallet ${walletAddress} on chain ${chain}:`, response.data.result);
            return []; // Return an empty array to safely continue execution
        }
    } catch (error) {
        console.error(`Error fetching ${chain} transactions:`, error);
        throw error; 
    }
}

export const getERC20Transactions = async (walletAddress, { apiUri, apiKey, chain, endblock }, contractAddress) => 
    getTxns(walletAddress, { apiUri, apiKey, chain, endblock }, ercTxns, tap(config => {
        if (contractAddress) {
            config.params.contractaddress = contractAddress;
        }
    }));

export const getNormalTransactions = async (walletAddress, { apiUri, apiKey, chain, endblock }) => 
    getTxns(walletAddress, { apiUri, apiKey, chain, endblock }, normalTxns)

// UX INIT FUNCTIONS

export const updateStatus = (stateSetter, key, updates) => 
    stateSetter(prevState => ({ ...prevState, [key]: { ...prevState[key], ...updates }}));

const fetchAndSetStatus = async (walletAddress, key, transaction, stateSetter) => {
    try {
        const result = await transaction.apiCall(walletAddress, transaction.address);
        updateStatus(stateSetter, key, { loading: false, txns: result.length });
        return result;
    } catch (error) {
        console.error(`Error fetching transactions for ${key}:`, error);
        updateStatus(stateSetter, key, { loading: false, txns: 0 });
        throw error;
    }
};

export const getAggregateTransactions = async (walletAddress, transactionsToFetch, updateStatusFn, stateSetter) => {

    // Set all transactions to loading
    Object.keys(transactionsToFetch).forEach(key => updateStatusFn(stateSetter, key, { loading: true }));

    try {
        const fetchPromises = Object.keys(transactionsToFetch).map(key => {
            const transaction = transactionsToFetch[key];
            return fetchAndSetStatus(walletAddress, key, transaction, stateSetter);
        });

        const transactionsArrays = await Promise.all(fetchPromises);
        const walletName = searchWalletName(walletAddress);

        // Flatten transactions and append the wallet name
        const newTxns = transactionsArrays.flat().map(txn => ({
            ...txn,
            walletName
        }));

        return newTxns;
    } catch (error) {
        console.error('Error fetching aggregate transactions:', error);
        Object.keys(transactionsToFetch).forEach(key => updateStatusFn(stateSetter, key, { loading: false, txns: 0 }));
        throw error;
    }
};


/**
 * ==================================================================================================
 * API CALL # 1
 * Get a list of 'Normal Transactions' By Address
 * see:  https://docs.arbiscan.io/api-endpoints/accounts#get-a-list-of-normal-transactions-by-address
 * 
 * ==================================================================================================

        https://api.arbiscan.io/api
            ?module=account
            &action=txlist
            &address=0x1a97a5a0063d837fd3365e71e5bdc3894e833e6d
            &startblock=0
            &endblock=latest
            &page=1
            &offset=10
            &sort=asc&apikey=YourApiKeyToken

 * RESPONSE

        "result": [
            {
                "blockNumber": "11046656",
                "timeStamp": "1651511827",
                "hash": "0xc55bd3890dc132e5b6c43ed8d5608133731dc096303a933325b8c151bef35223",
                "nonce": "1911",
                "blockHash": "0xe083eb288e5fd44906e92db36d4cba9062a32c8faa72538678a2e5977b02b173",
                "transactionIndex": "0",
                "from": "0xf89d7b9c864f589bbf53a82105107622b35eaa40",
                "to": "0x1a97a5a0063d837fd3365e71e5bdc3894e833e6d",
                "value": "27020940000000000",
                "gas": "1200000",
                "gasPrice": "722037233",
                "gasPriceBid": "902546541",
                "isError": "0",
                "txreceipt_status": "1",
                "input": "0x",
                "contractAddress": "",
                "cumulativeGasUsed": "0",
                "gasUsed": "423200",
                "confirmations": "70578588",
                "methodId": "0x",
                "functionName": ""
            },
            {
                "blockNumber": "11046738",
                "timeStamp": "1651511887",
                "hash": "0x0309063f0f52491881cb4dc055555c60edfb943098050000694dd232e4448623",
                "nonce": "0",
                "blockHash": "0x3cf9b96ea3d666456edf4e96e76a4e4106540932167774b4d51ec9bad3511e61",
                "transactionIndex": "0",
                "from": "0x1a97a5a0063d837fd3365e71e5bdc3894e833e6d",
                "to": "0x61a1ff55c5216b636a294a07d77c6f4df10d3b56",
                "value": "0",
                "gas": "974575",
                "gasPrice": "722037233",
                "gasPriceBid": "912546541",
                "isError": "0",
                "txreceipt_status": "1",
                "input": "0x095ea7b30000000000000000000000001c0a560ef9f6ff3f5c2bcce98dc92f2649a507efffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                "contractAddress": "",
                "cumulativeGasUsed": "51472",
                "gasUsed": "570812",
                "confirmations": "70578506",
                "methodId": "0x095ea7b3",
                "functionName": "approve(address spender, uint256 amount)"
            }
        ]
        */


/**
 * ==================================================================================================
 * API CALL # 2
 * Get a list of 'ERC20 - Token Transfer Events' by Address
 * see:  https://docs.arbiscan.io/api-endpoints/accounts#get-a-list-of-erc20-token-transfer-events-by-address
 * 
 * ==================================================================================================

        https://api.arbiscan.io/api
            ?module=account
            &action=tokentx
            &contractaddress=0xda10009cbd5d07dd0cecc66161fc93d7c9000da1
            &address=0x27A0A9bf2916685ac00c2abC735eb9048A1c3bA4
            &page=1
            &offset=100
            &startblock=0
            &endblock=99999999
            &sort=asc
            &apikey=YourApiKeyToken

 * RESPONSE

        "result":[
            {
                "blockNumber":"12877796",
                "timeStamp":"1653418514",
                "hash":"0xc274d5d944fdffd40550eef4c33abba723a76ffa797c613fd909d6df7bd587f0",
                "nonce":"0",
                "blockHash":"0x5916902f212b864d9b49d1ae6e0bc15827adb279252d62a9d8eec22912cdafc8",
                "from":"0xa8642a2085841956a5f0211f9a18e9ae81cfeaf3",
                "contractAddress":"0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
                "to":"0x27a0a9bf2916685ac00c2abc735eb9048a1c3ba4",
                "value":"4000000000000000000",
                "tokenName":"Dai Stablecoin",
                "tokenSymbol":"DAI",
                "tokenDecimal":"18",
                "transactionIndex":"1",
                "gas":"845598",
                "gasPrice":"515157706",
                "gasUsed":"482451",
                "cumulativeGasUsed":"221582",
                "input":"deprecated",
                "confirmations":"9004204"
            },
            {
                "blockNumber":"12887109",
                "timeStamp":"1653432975",
                "hash":"0xe3abf51773106aadfa1b534474cf04615705a861932360377417c8efeb71e71d",
                "nonce":"3",
                "blockHash":"0xd4c60b20c004e11e46354493f03ec0be7d2d9b933b226d5d7c985613a181e310",
                "from":"0x27a0a9bf2916685ac00c2abc735eb9048a1c3ba4",
                "contractAddress":"0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
                "to":"0xed67d6682dc88e06c66e188027ca883455afdada",
                "value":"4000000000000000000",
                "tokenName":"Dai Stablecoin",
                "tokenSymbol":"DAI",
                "tokenDecimal":"18",
                "transactionIndex":"0",
                "gas":"1092543",
                "gasPrice":"403028236",
                "gasUsed":"973562",
                "cumulativeGasUsed":"414662",
                "input":"deprecated",
                "confirmations":"8994891"
            }
        ]
        */
