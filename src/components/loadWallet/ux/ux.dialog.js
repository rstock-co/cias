import { useState, useEffect } from 'react';
import { generateMemberSummaryTableData } from '../../../lib/functions/wallets';
import { moves } from '../../../lib/lookup';

const DialogUX = ({isLoading, tableData = []}) => {

    // DIALOG BOX STATES
    const [allocationDialogOpen, setAllocationDialogOpen] = useState(false);
    const [chainDialogOpen, setChainDialogOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [loadingDialogOpen, setLoadingDialogOpen] = useState(false);
    const [memberSummaryDialogOpen, setMemberSummaryDialogOpen] = useState(false);
    const [memberSummaryData, setMemberSummaryData] = useState([]);

    // Loading screen dialog box
    useEffect(() => {
        console.log('isLoading:', isLoading, 'tableData.length:', tableData.length);
        if (isLoading || tableData.length > 900) {
            setLoadingDialogOpen(true);
        } else {
            setLoadingDialogOpen(false);
        }
    }, [isLoading, tableData.length]);
    

    // DIALOG HANDLERS
    const handleGenerateAllocations = () => {
        setAllocationDialogOpen(true);
    };

    const handleGenerateChainFlow = () => {
        setChainDialogOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleMemberSummary = (memberWallet) => {
        // Here you generate the data for the MemberSummary dialog
        const data = generateMemberSummaryTableData(tableData, memberWallet, moves);
        setMemberSummaryData(data);
        setMemberSummaryDialogOpen(true); // Open the dialog
    };

    return {
        allocationDialogOpen,
        setAllocationDialogOpen,
        handleGenerateAllocations,

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

        memberSummaryData
    }
}

export default DialogUX;