import { useEffect, useState } from 'react';
import { stableCoinsToFetch } from '../data';
import { searchWalletName } from '../../../lib/functions/wallets';
// Import the function to fetch normal transactions
import { getNormalTransactions } from '../../../lib/functions/normalTransactions'; 

const InitUX = () => {
    const [stableCoins, setStableCoins] = useState(stableCoinsToFetch);
    const [selectedWallets, setSelectedWallets] = useState([]);
    const [previousWallets, setPreviousWallets] = useState([]);
    const [txns, setTxns] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingLocked, setLoadingLocked] = useState(false);
    const [transactionType, setTransactionType] = useState('erc20'); // 'normal', 'erc20', 'all'

    // ... existing function definitions ...

    const fetchNormalTxns = async (walletAddress) => {
        // Implement your logic to fetch normal transactions
        return getNormalTransactions(walletAddress);
    };

    const fetchTransactions = async (walletsToFetch) => {
        const minLoadingTime = 3000;
        const startTime = Date.now(); 
        setLoadingLocked(true); 
        setIsLoading(true);
        const newTxns = [];

        for (const wallet of walletsToFetch) {
            if (wallet && wallet.address) {
                try {
                    let result = [];
                    if (transactionType === 'erc20' || transactionType === 'all') {
                        result = result.concat(await getAggregateERC20Txns(wallet.address));
                    }
                    if (transactionType === 'normal' || transactionType === 'all') {
                        result = result.concat(await fetchNormalTxns(wallet.address));
                    }
                    newTxns.push(...result);
                } catch (error) {
                    console.error('Error fetching transactions for wallet:', wallet.name, error);
                }
            }
        }








        
// ==========================================================
        setTxns(prevTxns => [...prevTxns, ...newTxns]);
        const elapsedTime = Date.now() - startTime;
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
        stableCoins,
        setTransactionType, // Expose the function to change transaction type
    };
}

export default InitUX;
