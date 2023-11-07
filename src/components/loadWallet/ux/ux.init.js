import { useEffect, useState } from 'react';
import { getERC20TxnsArb } from "../../../api/arb";
import { getERC20TxnsBsc } from "../../../api/bsc";
import { getERC20TxnsEth } from "../../../api/eth";
import { wallets, getAddressByName } from "../../../lib/lookup/wallets";

const InitUX = () => {

    // STABLE COINS TO FETCH
    const [stableCoins, setStableCoins] = useState({
        stableArb: { address: getAddressByName("stable_usdc_arb"), name: "USDC(Arb)", apiCall: getERC20TxnsArb, chain: "arb", loading: false, txns: 0 },
        stableEth: { address: getAddressByName("stable_usdc_eth"), name: "USDC(Eth)", apiCall: getERC20TxnsEth, chain: "eth", loading: false, txns: 0 },
        stableEth2: { address: getAddressByName("stable_usdt_eth"), name: "USDT(Eth)", apiCall: getERC20TxnsEth, chain: "eth", loading: false, txns: 0 },
        stableBsc: { address: getAddressByName("stable_busd_bep20"), name: "BUSD(Bep20)", apiCall: getERC20TxnsBsc, chain: "bsc", loading: false, txns: 0 },
        stableBsc2: { address: getAddressByName("stable_bsc-usd_bep20"), name: "BSC-USD(Bep20)", apiCall: getERC20TxnsBsc, chain: "bsc", loading: false, txns: 0 },
    });

    // SELECTED WALLETS
    const [selectedWallets, setSelectedWallets] = useState([]);
    const [previousWallets, setPreviousWallets] = useState([]);

    // TRANSACTIONS
    const [txns, setTxns] = useState([]);

    // LOADING SCREEN TRIGGER
    const [isLoading, setIsLoading] = useState(false);
    const [loadingLocked, setLoadingLocked] = useState(false);
    

    const updateCoinStatus = (coinKey, updates) => {
        setStableCoins(prevCoins => ({
            ...prevCoins,
            [coinKey]: { ...prevCoins[coinKey], ...updates },
        }));
    };

    const fetchAndSetStatus = async (walletAddress, coinKey) => {
        try {
            const coin = stableCoins[coinKey];
            updateCoinStatus(coinKey, { loading: true });

            const result = await coin.apiCall(walletAddress, coin.address);
            updateCoinStatus(coinKey, { loading: false, txns: result.length });

            return result;
        } catch (error) {
            console.error('Error fetching transactions:', error);
            updateCoinStatus(coinKey, { loading: false, txns: 0 });
            throw error;
        }
    };

    const getAggregateERC20Txns = async (walletAddress) => {
        // Start loading process for each coin
        Object.keys(stableCoins).forEach(coinKey => updateCoinStatus(coinKey, { loading: true }));

        try {
            const fetchPromises = Object.keys(stableCoins).map(coinKey => fetchAndSetStatus(walletAddress, coinKey));

            const transactionsArrays = await Promise.all(fetchPromises);

            // Find wallet name for the given walletAddress
            const wallet = wallets.find(wallet => wallet.address.toLowerCase() === walletAddress.toLowerCase());
            const walletName = wallet ? wallet.name : '';

            // Flatten transactions and append the wallet name and coin key as the chain
            const newTxns = transactionsArrays.flat().map(txn => {
                return {
                    ...txn,
                    wallet: walletName
                }
            });

            return newTxns;
        } catch (error) {
            console.error('Error fetching aggregate transactions:', error);
            throw error;
        }
    };

    const fetchTransactions = async (walletsToFetch) => {
        const minLoadingTime = 3000; // Minimum loading time in milliseconds
        const startTime = Date.now(); // Record the start time

        setLoadingLocked(true); // Lock loading state changes
        setIsLoading(true); // Set the loading state to true

        const newTxns = [];
        for (const wallet of walletsToFetch) {
            if (wallet && wallet.address) {
                try {
                    const result = await getAggregateERC20Txns(wallet.address);
                    newTxns.push(...result);
                } catch (error) {
                    console.error('Error fetching transactions for wallet:', wallet, error);
                }
            }
        }

        setTxns(prevTxns => [...prevTxns, ...newTxns]);

        // Calculate how much time has passed
        const elapsedTime = Date.now() - startTime;

        // If the loading happened too fast, wait until minLoadingTime has passed
        if (elapsedTime < minLoadingTime) {
            setTimeout(() => {
                setIsLoading(false); // Set the loading state to false
                setLoadingLocked(false); // Unlock loading state changes
            }, minLoadingTime - elapsedTime);
        } else {
            setIsLoading(false); // Set the loading state to false immediately
            setLoadingLocked(false); // Unlock loading state changes
        }
    };

    useEffect(() => {
        // Fetch transactions only for the newly added wallets
        const newWallets = selectedWallets.filter(wallet => !previousWallets.find(w => w.address === wallet.address)
    );

    if (newWallets.length > 0) {
        fetchTransactions(newWallets)
        .then(() => {
            // Instead of setting the global loading state here,
            // we will rely on individual coin statuses
        })
        .catch((error) => {
            console.error('Error fetching transactions:', error);
            // If there is an error, we should update all coins to not loading
            Object.keys(stableCoins).forEach(coinKey =>
            updateCoinStatus(coinKey, { loading: false })
            );
        });
    }

    // Update the previousWallets state for the next effect run
    setPreviousWallets(selectedWallets);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedWallets]);

    // manage the global loading state based on individual coin statuses
    const isAllCoinsNotLoading = (coins) => Object.values(coins).every(coin => !coin.loading);

    useEffect(() => {
        if (!loadingLocked) {
            setIsLoading(!isAllCoinsNotLoading(stableCoins));
        }
    }, [stableCoins, loadingLocked]);
      
    return {
        txns,
        setTxns,
        selectedWallets,
        setSelectedWallets,
        fetchTransactions,
        isLoading,
        stableCoins
    };
}

export default InitUX;