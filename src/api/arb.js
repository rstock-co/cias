import axios from 'axios';

export const getNormalTxnsArb = async walletAddress => {
    const requestConfig = {
        params: {
            module: 'account',
            action: 'txlist',
            address: walletAddress,
            startblock: '0',
            endblock: 'latest',
            page: '1',
            offset: '1000',
            sort: 'asc',
            apikey: '9A86M2SJYUSQS2ZEFP66WC32IW9E19KD39',
        },
    };

    try {
        const response = await axios.get("https://api.arbiscan.io/api", requestConfig);
        return response.data.result;
    } catch (error) {
        console.error('Error fetching internal transactions:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
};

// contractAddress is optional, if passed, txns will be filtered by the token (ie. Vela)
export const getERC20TxnsArb = async (walletAddress, contractAddress) => {
    const requestConfig = {
        params: {
            module: 'account',
            action: 'tokentx',
            address: walletAddress,
            startblock: '0',
            endblock: 'latest',
            page: '1',
            offset: '1000',
            sort: 'asc',
            apikey: '9A86M2SJYUSQS2ZEFP66WC32IW9E19KD39',
        },
    };

    // Conditionally add the contractaddress key-value pair.
    if (contractAddress) {
        requestConfig.params.contractaddress = contractAddress;
    }

    try {
        const response = await axios.get("https://api.arbiscan.io/api", requestConfig);
        return response.data.result;
    } catch (error) {
        console.error('Error fetching internal transactions:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
};

