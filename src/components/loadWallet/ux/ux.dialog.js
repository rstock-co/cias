import { useEffect, useState } from 'react';
import { generateMemberSummaryTableData } from '../../memberSummary/data';
import { getWalletAddress } from '../../../lib/functions/wallets';

const DialogUX = ({
    isLoading, 
    tableData = [], 
    blendedTableList, 
    selectedWallets,
    setSelectedWallets, 
    setSelectedCappedMoveWallets, 
    setFetchType, 
    cappedMoveAmount, 
    setCappedMoveAmount, 
    isCappedMove, 
    setIsCappedMove, 
    isCappedWalletFound,
    handleCappedMoveImport
}) => {

    // DIALOG BOX STATES
    const [allocationDialogOpen, setAllocationDialogOpen] = useState(false);
    const [blendedAllocationDialogOpen, setBlendedAllocationDialogOpen] = useState(false);
    const [finishCappedMoveDialogOpen, setFinishCappedMoveDialogOpen] = useState(false);
    const [chainDialogOpen, setChainDialogOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [loadingDialogOpen, setLoadingDialogOpen] = useState(false);
    const [memberSummaryDialogOpen, setMemberSummaryDialogOpen] = useState(false);
    const [memberSummaryData, setMemberSummaryData] = useState({});
    

    // Loading screen dialog box
    useEffect(() => {
        if (isLoading || tableData.length > 900) {
            setLoadingDialogOpen(true);
        } else {
            setLoadingDialogOpen(false);
        }
    }, [isLoading, tableData.length]);
    

    // DIALOG HANDLERS
    const handleGenerateAllocations = () => {
        if (isCappedMove && isCappedWalletFound && selectedWallets.length === 1) {
            setAllocationDialogOpen(true);
        }
        else if (isCappedMove) setFinishCappedMoveDialogOpen(true);
        else {
            if (blendedTableList.length > 0) {
                setBlendedAllocationDialogOpen(true);
            } else {
                setAllocationDialogOpen(true);
            }
        }
    };

    const handleGenerateCappedMove = () => {
        setFetchType('all');
        setIsCappedMove(true);
        setTimeout(() => {
            setSelectedWallets([
              {
                "name": "membership (deposit)",
                "address": "0xab5573f28e6dd9ec34966b06e4c736481f393fc7"
              },
              {
                "name": "initial-trust-raise (deposit)",
                "address": "0x8c78290373623175dfa7a4736bd3a340b670bce9"
              },
              {
                "name": "gas (deposit)",
                "address": "0xdf12edaae8acb58e09bab1ada1aa9e9bcdf5b45a"
              }
            ]);
          }, 300);
    };

    const handleUpdateCappedMove = () => {
        setIsCappedMove(true);
        handleCappedMoveImport('existing');
    }

    const handleGenerateChainFlow = () => {
        setChainDialogOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleCappedMoveAmountChange = (value) => {
        setCappedMoveAmount(value);
    };

    const handleMultiSelectCappedMoveWalletChange = (walletNames, reason) => {
        console.log('reason', reason)
        const walletAddresses = walletNames.map(name => getWalletAddress(name));
        const selectedWallets = walletNames.map((name, i) => ({
            name,
            address: walletAddresses[i]
        }));
        setSelectedCappedMoveWallets(selectedWallets);
    }

    const handleMemberSummary = (memberWallet) => {
        const [memberName, ...memberSummary] = generateMemberSummaryTableData(tableData, memberWallet);
        setMemberSummaryData({ memberName, memberSummary });
        setMemberSummaryDialogOpen(true);
    };    

    return {
        allocationDialogOpen,
        setAllocationDialogOpen,
        blendedAllocationDialogOpen, 
        setBlendedAllocationDialogOpen,
        finishCappedMoveDialogOpen,
        setFinishCappedMoveDialogOpen,
        handleGenerateAllocations,
        handleGenerateCappedMove,

        chainDialogOpen,
        setChainDialogOpen,
        handleGenerateChainFlow,

        snackbarOpen,
        setSnackbarOpen,
        handleCloseSnackbar,

        loadingDialogOpen,

        memberSummaryDialogOpen, 
        setMemberSummaryDialogOpen,
        handleMemberSummary,
        memberSummaryData,

        isCappedMove,
        setIsCappedMove,
        cappedMoveAmount,
        handleCappedMoveAmountChange,
        handleMultiSelectCappedMoveWalletChange,
        handleUpdateCappedMove,
    }
}

export default DialogUX;