import { useEffect, useState } from 'react';
import { stableCoinsToFetch } from '../data';
import { searchWalletName } from '../../../lib/functions/wallets';

const InitUX = () => {

    const [stableCoins, setStableCoins] = useState(stableCoinsToFetch);

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
        // Set all coins to loading
        Object.keys(stableCoins).forEach(coinKey => updateCoinStatus(coinKey, { loading: true }));

        try {
            const fetchPromises = Object.keys(stableCoins).map(coinKey => fetchAndSetStatus(walletAddress, coinKey));

            const transactionsArrays = await Promise.all(fetchPromises);

            // Find wallet name for the given walletAddress
            const walletName = searchWalletName(walletAddress);

            // Flatten transactions and append the wallet name
            const newTxns = transactionsArrays.flat().map(txn => {
                return {
                    ...txn,
                    walletName
                }
            });

            return newTxns;
        } catch (error) {
            console.error('Error fetching aggregate transactions:', error);
            throw error;
        }
    };

    const fetchTransactions = async (walletsToFetch) => {
        const minLoadingTime = 3000; // Minimum loading time in milliseconds (to allow the user to view loading screen without flashing too fast)
        const startTime = Date.now(); 

        setLoadingLocked(true); 
        setIsLoading(true);

        const newTxns = [];
        for (const wallet of walletsToFetch) {
            if (wallet && wallet.address) {
                try {
                    const result = await getAggregateERC20Txns(wallet.address);
                    newTxns.push(...result);
                } catch (error) {
                    console.error('Error fetching transactions for wallet:', wallet.name, error);
                }
            }
        }

        setTxns(prevTxns => [...prevTxns, ...newTxns]);

        // Calculate how much time has passed since the fetch started
        const elapsedTime = Date.now() - startTime;

        // If the loading happened too fast, wait until minLoadingTime has passed
        if (elapsedTime < minLoadingTime) {
            setTimeout(() => {
                setIsLoading(false); 
                setLoadingLocked(false); 
            }, minLoadingTime - elapsedTime);
        } else {
            setIsLoading(false); 
            setLoadingLocked(false); 
        }
    };

    useEffect(() => {
        // Fetch transactions only for the newly added wallets
        const newWallets = selectedWallets.filter(wallet => !previousWallets.find(w => w.address === wallet.address));

        if (newWallets.length > 0) {
            fetchTransactions(newWallets)
            .then(() => {})
            .catch((error) => {
                console.error('Error fetching transactions:', error);
                // If there is an error, update all coins to not loading
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
    const areAllCoinsNotLoading = (coins) => Object.values(coins).every(coin => !coin.loading);

    useEffect(() => {
        if (!loadingLocked) {
            setIsLoading(!areAllCoinsNotLoading(stableCoins));
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