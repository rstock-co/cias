import axios from 'axios';

export const getNormalTxnsEth = async walletAddress => {
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
            apikey: 'VUB3S8UB35DM3EJWDRD9DH7B4E5EWBJXYY',
        },
    };

    try {
        const response = await axios.get("https://api.etherscan.io/api", requestConfig);
        return response.data.result;
    } catch (error) {
        console.error('Error fetching internal transactions:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
};

// contractAddress is optional, if passed, txns will be filtered by the token (ie. Vela)
export const getERC20TxnsEth = async (walletAddress, contractAddress) => {
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
            apikey: 'VUB3S8UB35DM3EJWDRD9DH7B4E5EWBJXYY',
        },
    };

    // Conditionally add the contractaddress key-value pair.
    if (contractAddress) {
        requestConfig.params.contractaddress = contractAddress;
    }

    try {
        const response = await axios.get("https://api.etherscan.io/api", requestConfig);
        return response.data.result.map(txn => ({
            ...txn,
            chain: 'eth'
        }));
    } catch (error) {
        console.error('Error fetching internal transactions:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
};

