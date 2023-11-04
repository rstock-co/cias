import { useEffect, useState } from 'react';
import { getERC20TxnsArb } from "../../../api/arb";
import { getERC20TxnsBsc } from "../../../api/bsc";
import { getERC20TxnsEth } from "../../../api/eth";
import { wallets, getAddressByName } from "../../lookup/wallets";

const InitUX = () => {

    const stableArb = getAddressByName("stable_usdc_arb");
    const stableEth = getAddressByName("stable_usdc_eth");
    const stableEth2 = getAddressByName("stable_usdt_eth");
    const stableBsc = getAddressByName("stable_busd_bep20");

    // SET OF SELECTED WALLETS (multi-select)
    const [selectedWallets, setSelectedWallets] = useState([
        // {
        //     name: "pool_investments",
        //     address: "0xb79E768bEF0Ca0a34E53c3FE2ac26E600ACf8ccA"
        // },
        // {
        //     name: "pool_membership",
        //     address: "0xab5573F28e6dD9Ec34966b06e4C736481F393FC7"
        // },
        // {
        //     name: "pool_trust",
        //     address: "0x8c78290373623175dfa7a4736bd3a340b670bce9"
        // },
        // {
        //     name: "int_gas",
        //     address: "0xDf12edaae8acb58E09bAb1ADa1aA9e9BcDf5b45a"
        // },
        {
            name: "volcano",
            address: "0x1865fa691B468ef7bFd789EE9D29efbe3dc7d47A"
        },
        // {
        //     name: "serenity_shield",
        //     address: "0x402B7B932A76d1f007dDC5E51A63105F05bb017B"
        // },
    ]);

    // TRANSACTIONS
    const [txns, setTxns] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [arbStatus, setArbStatus] = useState({ loading: true, txns: 0 });
    const [ethStatus, setEthStatus] = useState({ loading: true, txns: 0 });
    const [bscStatus, setBscStatus] = useState({ loading: true, txns: 0 });

    const fetchAndSetStatus = async (walletAddress, contractAddress, apiCall, setStatus) => {
        try {
            const result = await apiCall(walletAddress, contractAddress);
            setStatus === setEthStatus
                ? setStatus(prevStatus => ({ ...prevStatus, loading: false, txns: prevStatus.txns + result.length }))
                : setStatus({ loading: false, txns: result.length });
            return result;
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setStatus({ loading: false, txns: 0 });
            throw error;
        }
    };


    const getAggregateERC20Txns = async (walletAddress, contractAddresses) => {
        const { stableArb, stableEth, stableEth2, stableBsc } = contractAddresses;
        try {
            const [data1, data2, data3, data4] = await Promise.all([
                fetchAndSetStatus(walletAddress, stableArb, getERC20TxnsArb, setArbStatus),
                fetchAndSetStatus(walletAddress, stableEth, getERC20TxnsEth, setEthStatus),
                fetchAndSetStatus(walletAddress, stableEth2, getERC20TxnsEth, setEthStatus),
                fetchAndSetStatus(walletAddress, stableBsc, getERC20TxnsBsc, setBscStatus)
            ]);

            // Find wallet name for the given walletAddress
            const wallet = wallets.find(wallet => wallet.address.toLowerCase() === walletAddress.toLowerCase());

            // Append the chain property and wallet name to each transaction object
            const d1 = data1.map(txn => ({ ...txn, chain: 'arb', wallet: wallet ? wallet.name : '' }));
            const d2 = data2.map(txn => ({ ...txn, chain: 'eth', wallet: wallet ? wallet.name : '' }));
            const d3 = data3.map(txn => ({ ...txn, chain: 'eth', wallet: wallet ? wallet.name : '' }));
            const d4 = data4.map(txn => ({ ...txn, chain: 'bsc', wallet: wallet ? wallet.name : '' }));

            return [...d1, ...d2, ...d3, ...d4];
        } catch (error) {
            console.error('Error fetching aggregate transactions:', error);
            throw error; // Re-throw the error to be handled by the caller
        }
    };

    const fetchTransactions = async (walletsToFetch) => {
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
        setTxns(prevTxns => [...prevTxns, ...newTxns]);
    };

    useEffect(() => {
        fetchTransactions(selectedWallets);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setIsLoading(arbStatus.loading || ethStatus.loading || bscStatus.loading);
    }, [arbStatus, ethStatus, bscStatus]);

    return {
        txns,
        setTxns,
        selectedWallets,
        setSelectedWallets,
        fetchTransactions,
        isLoading,
        arbStatus,
        ethStatus,
        bscStatus,
        setArbStatus,
        setEthStatus,
        setBscStatus
    };
}

export default InitUX;