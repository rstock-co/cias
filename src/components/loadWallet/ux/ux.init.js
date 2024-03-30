import { chainsToFetch, stableCoinsToFetch } from '../data';
import { getAggregateTransactions, updateStatus } from '../../../api/transactions';
import { getBNBPrices, getEtheriumPrices } from '../../../api';
import { useEffect, useState } from 'react';
import { historicalPrices } from '../../../lib/data';

const InitUX = () => {

    const [stableCoins, setStableCoins] = useState(stableCoinsToFetch);
    const [chains, setChains] = useState(chainsToFetch);

    // SELECTED WALLETS
    const [selectedWallets, setSelectedWallets] = useState([]);
    const [previousWallets, setPreviousWallets] = useState([]);

    // CAPPED MOVE
    const [selectedCappedMoveWallets, setSelectedCappedMoveWallets] = useState([]);
    const [selectedDistributionWallet, setSelectedDistributionWallet] = useState([]); 
    const [isCappedMove, setIsCappedMove] = useState(false);
    const [cappedMoveAmount, setCappedMoveAmount] = useState(0); 
    const [sortedAllocationTableData, setSortedAllocationTableData] = useState([]);
    
    // TRANSACTIONS
    const [txns, setTxns] = useState([]);
    const [fetchType, setFetchType] = useState('all'); // 'normal', 'erc20', 'all'
    const [historicalBNBPrices, setHistoricalBNBPrices] = useState(historicalPrices.bnb);
    const [historicalETHPrices, setHistoricalETHPrices] = useState(historicalPrices.eth);

    // LOADING SCREEN TRIGGER
    const [isLoading, setIsLoading] = useState(false);
    const [loadingLocked, setLoadingLocked] = useState(false);

    const getAggregateERC20Txns = async (walletAddress) => getAggregateTransactions(walletAddress, stableCoins, updateStatus, setStableCoins);
    const getAggregateNormalTxns = async (walletAddress) => getAggregateTransactions(walletAddress, chains, updateStatus, setChains);
    
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    const fetchTransactions = async (walletsToFetch) => {
        const delayBetweenFetches = 1000; // Delay 1 second between fetches
        const startTime = Date.now();
        const minLoadingTime = 3000;
        setLoadingLocked(true);
        setIsLoading(true);

        const newTxns = [];


        for (const wallet of walletsToFetch) {
            if (wallet && wallet.address) {
                const fetchPromises = [];
            
                if (fetchType === 'erc20' || fetchType === 'all') {
                    fetchPromises.push(getAggregateERC20Txns(wallet.address));
                }
                if (fetchType === 'normal' || fetchType === 'all') {
                    fetchPromises.push(getAggregateNormalTxns(wallet.address));
                }

                try {
                    // Await all promises from fetchPromises array and directly process results
                    const results = await Promise.all(fetchPromises);
                    results.forEach(result => newTxns.push(...result)); // Assuming result itself is the array of transactions
                } catch (error) {
                    // This catch block will catch any error if one of the promises is rejected
                    console.error(`Error fetching transactions for wallet: ${wallet.name}`, error);
                }
        
                // Delay between each wallet's fetch operation
                await delay(delayBetweenFetches);
            }
        }
    
        // Update the transactions state
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
                Object.keys(stableCoins).forEach(coinKey => {
                    console.log(`Updating status for coinKey (useEffect): ${coinKey}`)
                    updateStatus(setStableCoins, coinKey, { loading: false })
                });
            });
        }
    
        // Update the previousWallets state for the next effect run
        setPreviousWallets(selectedWallets);
    
    }, [selectedWallets, fetchType]); 
    

    // manage the global loading state based on individual coin statuses
    const areAllCoinsNotLoading = (coins) => Object.values(coins).every(coin => !coin.loading);

    useEffect(() => {
        if (!loadingLocked) {
            setIsLoading(!areAllCoinsNotLoading(stableCoins));
        }
    }, [stableCoins, loadingLocked]);

    // Fetch historical price data on load

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const bnbPrices = await getBNBPrices();
                const ethPrices = await getEtheriumPrices();

                console.log('fetched BNB Prices:', bnbPrices);
                console.log('fetched ETH Prices:', ethPrices);
    
              // Check if new data was returned before attempting to update the state
              if (bnbPrices && Object.keys(bnbPrices).length > 0) {
                setHistoricalBNBPrices(prev => ({ ...prev, ...bnbPrices }));
              }
              if (ethPrices && Object.keys(ethPrices).length > 0) {
                setHistoricalETHPrices(prev => ({ ...prev, ...ethPrices }));
              }
            } catch (error) {
                console.error('Error fetching prices:', error);
            }
        };
    
        fetchPrices();
    }, []);
  
    return {
        txns,
        setTxns,
        fetchType,
        setFetchType,
        selectedWallets,
        setSelectedWallets,

        fetchTransactions,
        isLoading,
        stableCoins,

        isCappedMove,
        setIsCappedMove,
        cappedMoveAmount,
        setCappedMoveAmount,
        selectedCappedMoveWallets,
        setSelectedCappedMoveWallets,
        selectedDistributionWallet, 
        setSelectedDistributionWallet, 
        sortedAllocationTableData, 
        setSortedAllocationTableData,

        historicalBNBPrices,
        historicalETHPrices,
    };
}

export default InitUX;