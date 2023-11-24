import { useEffect, useState } from 'react';
import { stableCoinsToFetch, chainsToFetch } from '../data';
import { getAggregateTransactions, updateStatus } from '../../../api/functions';

const InitUX = () => {

    const [stableCoins, setStableCoins] = useState(stableCoinsToFetch);
    const [chains, setChains] = useState(chainsToFetch);

    // SELECTED WALLETS
    const [selectedWallets, setSelectedWallets] = useState([]);
    const [previousWallets, setPreviousWallets] = useState([]);

    // TRANSACTIONS
    const [txns, setTxns] = useState([]);
    const [fetchType, setFetchType] = useState('erc20'); // 'normal', 'erc20', 'all'

    // LOADING SCREEN TRIGGER
    const [isLoading, setIsLoading] = useState(false);
    const [loadingLocked, setLoadingLocked] = useState(false);

   
    const getAggregateERC20Txns = async (walletAddress) => {
        return getAggregateTransactions(walletAddress, stableCoins, (key, updates) => updateStatus(setStableCoins, key, updates));
    };
    
    const getAggregateNormalTxns = async (walletAddress) => {
        return getAggregateTransactions(walletAddress, chains, (key, updates) => updateStatus(setChains, key, updates));
    };
    
    const fetchTransactions = async (walletsToFetch) => {
        const minLoadingTime = 3000; // Minimum loading time in milliseconds
        const startTime = Date.now(); 
    
        setLoadingLocked(true); 
        setIsLoading(true);
    
        const newTxns = [];
        for (const wallet of walletsToFetch) {
            if (wallet && wallet.address) {
                try {
                    if (fetchType === 'erc20' || fetchType === 'all') {
                        const erc20Results = await getAggregateERC20Txns(wallet.address);
                        newTxns.push(...erc20Results);
                    }
                    if (fetchType === 'normal' || fetchType === 'all') {
                        const normalResults = await getAggregateNormalTxns(wallet.address);
                        newTxns.push(...normalResults);
                    }
                } catch (error) {
                    console.error('Error fetching transactions for wallet:', wallet.name, error);
                }
            }
        }
    
        setTxns(prevTxns => [...prevTxns, ...newTxns]);
    
        // Calculate elapsed time and handle loading state
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
            .then(() => {
                // Handle successful fetch
            })
            .catch((error) => {
                console.error('Error fetching transactions:', error);
                // Update all coins/chains to not loading on error
                Object.keys(stableCoins).forEach(coinKey =>
                    updateStatus(setStableCoins, coinKey, { loading: false })
                );
            });
        }
    
        // Update the previousWallets state for the next effect run
        setPreviousWallets(selectedWallets);
    
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedWallets, fetchType]); 
    

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
        setFetchType,
        selectedWallets,
        setSelectedWallets,
        fetchTransactions,
        isLoading,
        stableCoins
    };
}

export default InitUX;