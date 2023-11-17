import { useState, useEffect } from 'react';
import { generateMemberSummaryTableData } from '../../memberSummary/data';

const DialogUX = ({isLoading, tableData = [], isBlendedTable}) => {

    // DIALOG BOX STATES
    const [allocationDialogOpen, setAllocationDialogOpen] = useState(false);
    const [blendedAllocationDialogOpen, setBlendedAllocationDialogOpen] = useState(false);
    const [chainDialogOpen, setChainDialogOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [loadingDialogOpen, setLoadingDialogOpen] = useState(false);
    const [memberSummaryDialogOpen, setMemberSummaryDialogOpen] = useState(false);
    const [memberSummaryData, setMemberSummaryData] = useState({});
    const [dialogKey, setDialogKey] = useState(0);

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
        setDialogKey(prevKey => prevKey + 1); // Increment key to force remount
    
        if (isBlendedTable) {
            setBlendedAllocationDialogOpen(true);
        } else {
            setAllocationDialogOpen(true);
        }
    };
    

    const handleGenerateChainFlow = () => {
        setChainDialogOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

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
        memberSummaryData,

        dialogKey
    }
}

export default DialogUX;