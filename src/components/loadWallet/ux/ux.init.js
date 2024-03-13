import { chainsToFetch, stableCoinsToFetch } from '../data';
import { getAggregateTransactions, updateStatus } from '../../../api/transactions';
import { getBNBPrices, getEtheriumPrices } from '../../../api';
import { useEffect, useState } from 'react';

const InitUX = () => {

    const [stableCoins, setStableCoins] = useState(stableCoinsToFetch);
    const [chains, setChains] = useState(chainsToFetch);

    // SELECTED WALLETS
    const [selectedWallets, setSelectedWallets] = useState([]);
    const [previousWallets, setPreviousWallets] = useState([]);

    // CAPPED MOVE
    const [selectedCappedMoveWallets, setSelectedCappedMoveWallets] = useState([]);
    const [isCappedMove, setIsCappedMove] = useState(false);
    const [cappedMoveAmount, setCappedMoveAmount] = useState(0); 
    
    // TRANSACTIONS
    const [txns, setTxns] = useState([]);
    const [fetchType, setFetchType] = useState('all'); // 'normal', 'erc20', 'all'
    const [historicalBNBPrices, setHistoricalBNBPrices] = useState([]);
    const [historicalETHPrices, setHistoricalETHPrices] = useState([]);

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
    
                setHistoricalBNBPrices(bnbPrices);
                setHistoricalETHPrices(ethPrices);
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

        historicalBNBPrices,
        historicalETHPrices,
    };
}

export default InitUX;




// // # 1

// const fetchTransactions = async (walletsToFetch) => {
//     const minLoadingTime = 3000; // Minimum loading time in milliseconds
//     const startTime = Date.now();

//     setLoadingLocked(true);
//     setIsLoading(true);

//     let allFetchPromises = [];

//     // Iterate through each wallet and prepare fetch promises for both ERC20 and normal transactions
//     walletsToFetch.forEach(wallet => {
//         if (wallet && wallet.address) {
//             allFetchPromises.push(
//                 getAggregateERC20Txns(wallet.address)
//                     .then(txns => ({ status: 'fulfilled', txns, wallet }))
//                     .catch(error => ({ status: 'rejected', error, wallet }))
//             );
//             allFetchPromises.push(
//                 getAggregateNormalTxns(wallet.address)
//                     .then(txns => ({ status: 'fulfilled', txns, wallet }))
//                     .catch(error => ({ status: 'rejected', error, wallet }))
//             );
//         }
//     });

//     try {
//         // Wait for all transaction fetches to settle, handling each result as it comes
//         const settledResults = await Promise.allSettled(allFetchPromises);
//         const newTxns = settledResults.reduce((acc, result) => {
//             if (result.status === 'fulfilled' && result.value.status === 'fulfilled') {
//                 return [...acc, ...result.value.txns];
//             } else if (result.value.status === 'rejected') {
//                 console.error(`Error fetching transactions for wallet: ${result.value.wallet.name}`, result.value.error);
//             }
//             return acc;
//         }, []);

//         setTxns(prevTxns => [...prevTxns, ...newTxns]);
//     } catch (error) {
//         console.error('Error processing transactions fetch results:', error);
//     } finally {
//         // Calculate elapsed time and adjust loading state accordingly
//         const elapsedTime = Date.now() - startTime;
//         if (elapsedTime < minLoadingTime) {
//             setTimeout(() => {
//                 setIsLoading(false);
//                 setLoadingLocked(false);
//             }, minLoadingTime - elapsedTime);
//         } else {
//             setIsLoading(false);
//             setLoadingLocked(false);
//         }
//     }
// };


// // # 2

// const fetchTransactions = async (walletsToFetch) => {
//     const startTime = Date.now();
//     setLoadingLocked(true);
//     setIsLoading(true);

//     // Create an array of promises for all wallets and transaction types
//     let fetchPromises = [];
//     walletsToFetch.forEach(wallet => {
//         if (wallet && wallet.address) {
//             if (fetchType === 'erc20' || fetchType === 'all') {
//                 fetchPromises.push(getAggregateERC20Txns(wallet.address)
//                   .then(txns => ({ status: 'fulfilled', txns, wallet }))
//                   .catch(error => ({ status: 'rejected', reason: error, wallet })));
//             }
//             if (fetchType === 'normal' || fetchType === 'all') {
//                 fetchPromises.push(getAggregateNormalTxns(wallet.address)
//                   .then(txns => ({ status: 'fulfilled', txns, wallet }))
//                   .catch(error => ({ status: 'rejected', reason: error, wallet })));
//             }
//         }
//     });

//     // Execute all fetches in parallel and process the results
//     const results = await Promise.allSettled(fetchPromises);
//     const newTxns = results.reduce((acc, result) => {
//         if (result.status === 'fulfilled' && result.value.status === 'fulfilled') {
//             return acc.concat(result.value.txns);
//         } else if (result.value.status === 'rejected') {
//             console.error(`Error fetching transactions for wallet: ${result.value.wallet.name}`, result.value.reason);
//         }
//         return acc;
//     }, []);

//     // Update the transactions state
//     setTxns(prevTxns => [...prevTxns, ...newTxns]);

//     // Handle loading state based on the minimum loading time
//     const elapsedTime = Date.now() - startTime;
//     const minLoadingTime = 3000; // Minimum loading time in milliseconds
//     if (elapsedTime < minLoadingTime) {
//         setTimeout(() => {
//             setIsLoading(false);
//             setLoadingLocked(false);
//         }, minLoadingTime - elapsedTime);
//     } else {
//         setIsLoading(false);
//         setLoadingLocked(false);
//     }
// };
