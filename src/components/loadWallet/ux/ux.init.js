import { useEffect, useState } from 'react';
import { getAggregateERC20Txns } from '../../../api/aggregate';
import { getAddressByName } from '../../../lookup/wallets';

const InitUX = () => {

    // WALLET ADDRESSES
    const stableArb = getAddressByName("stable_usdc_arb");
    const stableEth = getAddressByName("stable_usdc_eth");
    const stableEth2 = getAddressByName("stable_usdt_eth");
    const stableBsc = getAddressByName("stable_busd_bep20");

    // SET OF SELECTED WALLETS (multi-select)
    const [selectedWallets, setSelectedWallets] = useState([
        {
            name: "pool_investments",
            address: "0xb79E768bEF0Ca0a34E53c3FE2ac26E600ACf8ccA",
        },
    ]);

    // TRANSACTIONS
    const [txns, setTxns] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const fetchTransactions = async (walletsToFetch) => {
        setIsLoading(true);  // start loading
        const newTxns = [];
        for (const wallet of walletsToFetch) {
            if (wallet && wallet.address) {
                try {
                    const result = await getAggregateERC20Txns(wallet.address, { stableArb, stableEth, stableEth2, stableBsc });
                    newTxns.push(...result);
                } catch (error) {
                    console.error('Error fetching transactions:', error);
                }
            }
        }
        setIsLoading(false);  // end loading
        setTxns(prevTxns => [...prevTxns, ...newTxns]);
    };

    useEffect(() => {
        if (selectedWallets.length > 0) {
            fetchTransactions(selectedWallets);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        txns,
        setTxns,
        selectedWallets,
        setSelectedWallets,
        fetchTransactions,
        isLoading
    };
}

export default InitUX;