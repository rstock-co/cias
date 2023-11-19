import axios from 'axios';
import { BSC_API_KEY } from '../lib/data';

export const getNormalTxnsBsc = async walletAddress => {
    const requestConfig = {
        params: {
            module: 'account',
            action: 'txlist',
            address: walletAddress,
            startblock: '0',
            endblock: '99999999',
            page: '1',
            offset: '1000',
            sort: 'asc',
            apikey: BSC_API_KEY,
        },
    };

    try {
        const response = await axios.get("https://api.bscscan.com/api", requestConfig);
        return response.data.result;
    } catch (error) {
        console.error('Error fetching internal transactions:', error);
        throw error; 
    }
};

// contractAddress is optional, if passed, txns will be filtered by the token (ie. Vela)
export const getERC20TxnsBsc = async (walletAddress, contractAddress) => {
    const requestConfig = {
        params: {
            module: 'account',
            action: 'tokentx',
            address: walletAddress,
            startblock: '0',
            endblock: '99999999',
            page: '1',
            offset: '1000',
            sort: 'asc',
            apikey: BSC_API_KEY,
        },
    };

    // Conditionally add the contractaddress key-value pair.
    if (contractAddress) {
        requestConfig.params.contractaddress = contractAddress;
    }

    try {
        const response = await axios.get("https://api.bscscan.com/api", requestConfig);
        return response.data.result.map(txn => ({
            ...txn,
            chain: 'bsc'
        }));
    } catch (error) {
        console.error('Error fetching internal transactions:', error);
        throw error; 
    }
};

