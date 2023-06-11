import { useEffect, useState } from 'react';
import { getAggregateERC20Txns } from '../../../api/aggregate';
import { getAddressByName } from '../../../lookup/wallets';
import { filterTxns, generateTableData } from '../../../lib/functions/wallets';

const BaseUX = () => {

    const stableArb = getAddressByName("stable_usdc_arb");
    const stableEth = getAddressByName("stable_usdc_eth");
    const stableEth2 = getAddressByName("stable_usdt_eth");
    const stableBsc = getAddressByName("stable_busd_bep20");

    const [txns, setTxns] = useState([]);

    const [selectedWallet, setSelectedWallet] = useState({});
    const [type, setType] = useState("");

    const [tableData, setTableData] = useState([]);

    const [allocationDialogOpen, setAllocationDialogOpen] = useState(false);
    const [chainDialogOpen, setChainDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true); 

    const handleWalletChange = async (event) => {
        setSelectedWallet({
            name: event.target.value,
            address: getAddressByName(event.target.value)
        });
    };

    const handleTransactionTypeChange = (event) => {
        setType(event.target.value);
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

    useEffect(() => {

        if (txns && txns.length > 0 && selectedWallet && selectedWallet.address) {
            const filteredTxns = filterTxns(txns, selectedWallet.address, type);
            setTableData(filteredTxns.map((txn, index) => generateTableData(txn, index, selectedWallet.address)));
        }

    }, [txns, selectedWallet, type]);

    console.log("TXNSSSZZZ: ", txns)
    console.log("Table data: ", tableData);
    return {
        selectedWallet,
        type,
        handleWalletChange,
        handleTransactionTypeChange,
        handleGenerateAllocations,
        handleGenerateChainFlow,
        tableData,
        allocationDialogOpen,
        setAllocationDialogOpen,
        chainDialogOpen,
        setChainDialogOpen,
        isLoading
    }

}

export default BaseUX;