import { useEffect, useState } from 'react';
import { getAggregateERC20Txns } from '../../../api/aggregate';
import { getAddressByName } from '../../../lookup/wallets';
import { filterTxns, generateTableData, getUniqueWallets, getUniqueTypes } from '../../../lib/functions/wallets';

const BaseUX = () => {

    // WALLET ADDRESSES
    const stableArb = getAddressByName("stable_usdc_arb");
    const stableEth = getAddressByName("stable_usdc_eth");
    const stableEth2 = getAddressByName("stable_usdt_eth");
    const stableBsc = getAddressByName("stable_busd_bep20");
    const [selectedWallets, setSelectedWallets] = useState([
        {
            name: "pool_investments",
            address: "0xb79E768bEF0Ca0a34E53c3FE2ac26E600ACf8ccA",
        },
    ]);

    // TRANSACTIONS
    const [txns, setTxns] = useState([]);
    const [tableData, setTableData] = useState([]);

    // SELECT INPUT STATE
    const [type, setType] = useState("");
    const [filterTypes, setFilterTypes] = useState([]);
    const [filterWallet, setFilterWallet] = useState("");
    const [filterWallets, setFilterWallets] = useState([]);
    const [chain, setChain] = useState("");
    const [dates, setDates] = useState({
        startDate: "",
        endDate: ""
    });
    const [direction, setDirection] = useState("")

    // ALL FILTERS FROM SELECT INPUTS
    const [filters, setFilters] = useState({
        type: "",
        chain: "",
        filterWallet: '',
        dateRange: { startDate: "", endDate: "" },
        direction: "",

    });

    // DIALOG BOX STATES
    const [allocationDialogOpen, setAllocationDialogOpen] = useState(false);
    const [chainDialogOpen, setChainDialogOpen] = useState(false);

    // PAGE LOADING
    const [isLoading, setIsLoading] = useState(true); 

    // SELECTED WALLETS HANDLER (appends new txn data to existing txn data)
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


    const handleSelectedWalletChange = event => {
        const { target: { value } } = event;
        const selectedWalletNames = typeof value === 'string' ? value.split(',') : value;

        const selectedWallets = selectedWalletNames.map(name => ({
            name,
            address: getAddressByName(name)
        }));

        const prevSelectedWalletsAddresses = selectedWallets.map(wallet => wallet.address.toLowerCase());

        // Filter out transactions that are associated with the removed wallets
        const newTxns = txns.filter(txn => {
            return prevSelectedWalletsAddresses.includes(txn.from.toLowerCase()) ||
                prevSelectedWalletsAddresses.includes(txn.to.toLowerCase());
        });

        // Also remove associated transactions from tableData
        const newTableData = tableData.filter(data => {
            return prevSelectedWalletsAddresses.includes(data.from.toLowerCase()) ||
                prevSelectedWalletsAddresses.includes(data.to.toLowerCase());
        });

        const walletsToFetch = selectedWallets.filter(wallet => {
            const isAddressFetched = newTxns.some(txn => txn.to.toLowerCase() === wallet.address.toLowerCase());
            return !isAddressFetched;
        });

        // avoid api call if a wallet is deselected from the multi-select box
        if (walletsToFetch.length > 0) {
            fetchTransactions(walletsToFetch);
        }

        setTxns(newTxns);
        setTableData(newTableData);
        setSelectedWallets(selectedWallets);
    };



    // FILTER HANDLERS

    const handleTypeChange = (event) => {
        setType(event.target.value);
        setFilters(prevFilters => ({ ...prevFilters, type: event.target.value }));
    };
    const handleFilterWalletChange = (value) => {
        setFilterWallet(value);
        setFilters(prevFilters => ({ ...prevFilters, filterWallet: value }));
    };
    const handleChainChange = (event) => {
        setChain(event.target.value);
        setFilters(prevFilters => ({ ...prevFilters, chain: event.target.value }));
    };
    const handleDatesChange = (dateRange) => {
        setDates(dateRange);
        setFilters(prevFilters => ({ ...prevFilters, dateRange }));
    };
    const handleDirectionChange = (event) => {
        setDirection(event.target.value);
        setFilters(prevFilters => ({ ...prevFilters, direction: event.target.value }));
    };


    const handleGenerateAllocations = () => {
        setAllocationDialogOpen(true);
    };

    const handleGenerateChainFlow = () => {
        setChainDialogOpen(true);
    };

    // inital page load
    useEffect(() => {
        if (selectedWallets.length > 0) {
            fetchTransactions(selectedWallets);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // useEffect(() => {
    //     const walletsToFetch = selectedWallets.filter(wallet => {
    //         const isAddressFetched = txns.some(txn => txn.to.toLowerCase() === wallet.address.toLowerCase());
    //         return !isAddressFetched;
    //     });

    //     if (walletsToFetch.length > 0) {
    //         fetchTransactions(walletsToFetch);
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [selectedWallets, stableArb, stableEth, stableEth2, stableBsc]);

    useEffect(() => {
        if (txns && txns.length > 0 && selectedWallets && selectedWallets.length > 0) {
            const selectedWalletAddresses = selectedWallets.map(wallet => wallet.address);
            const tableData = txns.map((txn, index) => generateTableData(txn, index, selectedWalletAddresses));

            const filteredTxns = filterTxns(tableData, filters);
            setTableData(filteredTxns);
        }
    }, [txns, selectedWallets, filters]);






    useEffect(() => {
        if (tableData.length > 0 && tableData.length < 900) {
            setFilterWallets(getUniqueWallets(tableData));
            setFilterTypes(getUniqueTypes(tableData));
        }
    }, [tableData]);

    console.log("All Txns: ", txns)
    console.log("Table data: ", tableData);
    return {

        tableData,

        selectedWallets,
        handleSelectedWalletChange,
        type,
        filterTypes,
        handleTypeChange,
        filterWallet,
        filterWallets,
        handleFilterWalletChange,
        chain,
        handleChainChange,
        dates,
        handleDatesChange,
        direction,
        handleDirectionChange,

        handleGenerateAllocations,
        handleGenerateChainFlow,

        allocationDialogOpen,
        setAllocationDialogOpen,
        chainDialogOpen,
        setChainDialogOpen,
        isLoading
    }

}

export default BaseUX;