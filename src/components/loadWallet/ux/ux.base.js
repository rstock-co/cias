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
    const [selectedWallet, setSelectedWallet] = useState({
        name: "pool_investments",
        address: "0xb79E768bEF0Ca0a34E53c3FE2ac26E600ACf8ccA"
    });

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

    // HANDLERS
    const handleSelectedWalletChange = async (event) => {
        setSelectedWallet({
            name: event.target.value,
            address: getAddressByName(event.target.value)
        });
    };

    // FILTERS

    const handleTypeChange = (event) => {
        setType(event.target.value);
        setFilters(prevFilters => ({ ...prevFilters, type: event.target.value }));
    };
    const handleFilterWalletChange = (event) => {
        setFilterWallet(event.target.value);
        setFilters(prevFilters => ({ ...prevFilters, filterWallet: event.target.value }));
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

    useEffect(() => {

        const fetchTransactions = async () => {
            setIsLoading(true);  // start loading
            try {
                const result = await getAggregateERC20Txns(selectedWallet.address, { stableArb, stableEth, stableEth2, stableBsc });
                setTxns(result);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
            setIsLoading(false);  // end loading
        };

        fetchTransactions();

    }, [selectedWallet, stableArb, stableEth, stableEth2, stableBsc]);

    // useEffect(() => {

    //     if (txns && txns.length > 0 && selectedWallet && selectedWallet.address) {
    //         console.log("FILTERS: ", filters)
    //         const filteredTxns = filterTxns(txns, filters);
    //         setTableData(filteredTxns.map((txn, index) => generateTableData(txn, index, selectedWallet.address)));
    //     }

    // }, [txns, selectedWallet, filters]);

    useEffect(() => {
        if (txns && txns.length > 0 && selectedWallet && selectedWallet.address) {
            // First generate table data
            const tableData = txns.map((txn, index) => generateTableData(txn, index, selectedWallet.address));

            // Then filter the table data
            const filteredTxns = filterTxns(tableData, filters);

            setTableData(filteredTxns);
        }
    }, [txns, selectedWallet, filters]);


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

        selectedWallet,
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