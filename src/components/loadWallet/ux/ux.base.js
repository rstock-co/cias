import { useEffect, useState } from 'react';
import { getERC20Txns } from '../../../api/arbitrum/getTxns';
import { getAddressByName } from '../../../lookup/wallets';
import {
    filterIncomming,
    filterOutgoing,
    generateContributorTableData,
    generateRecieverTableData
} from '../../../lib/functions/wallets';

const BaseUX = () => {

    const tokenAddress = getAddressByName("stable_usdc_arb");

    const [txns, setTxns] = useState([]);

    const [selectedWallet, setSelectedWallet] = useState({});
    const [transactionType, setTransactionType] = useState("");

    const [contributorTableData, setContributorTableData] = useState([]);
    const [recieverTableData, setRecieverTableData] = useState([]);

    const [dialogOpen, setDialogOpen] = useState(false);

    const handleWalletChange = async (event) => {
        setSelectedWallet({
            name: event.target.value,
            address: getAddressByName(event.target.value)
        });
    };

    const handleTransactionTypeChange = (event) => {
        setTransactionType(event.target.value);
    };

    const handleGenerateTable = () => {
        setDialogOpen(true);
    };


    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const result = await getERC20Txns(selectedWallet.address, tokenAddress);
                setTxns(result);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();

    }, [selectedWallet, tokenAddress]);

    useEffect(() => {
        if (txns && txns.length > 0 && selectedWallet && selectedWallet.address) {
            const inTxns = filterIncomming(txns, selectedWallet.address);
            const outTxns = filterOutgoing(txns, selectedWallet.address);

            setContributorTableData(inTxns
                .filter(txn => txn.value !== "0")
                .map(generateContributorTableData));
            setRecieverTableData(outTxns
                .filter(txn => txn.value !== "0")
                .map(generateRecieverTableData));
        }
    }, [txns, selectedWallet]);

    console.log("TXNSSSZZZ: ", txns)
    console.log("Contributor data: ", contributorTableData)
    console.log("Reciever data: ", recieverTableData)

    return {
        selectedWallet,
        transactionType,
        handleWalletChange,
        handleTransactionTypeChange,
        handleGenerateTable,
        contributorTableData,
        recieverTableData,
        dialogOpen,
        setDialogOpen
    }

}

export default BaseUX;