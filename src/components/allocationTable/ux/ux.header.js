import { useState, useEffect } from "react";
import { generateAllocationTableTitle } from "../../../lib/functions/format";
import { roundToNearest5Minutes } from '../../../lib/functions/time';
import { format } from 'date-fns';

const HeaderUX = ({
    tableData, 
    dialogOpen, 
    setDialogOpen, 
    selectedWallets, 
    move,
    saveTableData,
    deleteTableData,
    savedTables,
    savedTableId,
    transferTxnsToBlend,
    saveTableSnackbarMessage,
    saveTableSnackbarOpen,
    handleCloseSaveTableSnackbar
} = {}) => {   

    const [showMemberName, setShowMemberName] = useState(false);
    const [showHeaderRow, setShowHeaderRow] = useState(true);
    const [adjustedNetTotal, setAdjustedNetTotal] = useState("");
    const [generatedDateString, setGeneratedDateString] = useState("");
    const [generatedDateHTML, setGeneratedDateHTML] = useState("");
    const [sortBy, setSortBy] = useState("Amount");

    const handleToggleMemberName = (event) => {
        setShowMemberName(event.target.checked);
    };
    
    const handleToggleHeaderRow = (event) => {
        setShowHeaderRow(event.target.checked);
    };
    
    const handleAdjustedNetTotalChange = (event) => {
        setAdjustedNetTotal(event.target.value);
    };

    const handleSortByChange = (value) => {
        setSortBy(value);
    };

    const dialogTitle = generateAllocationTableTitle(selectedWallets, move);

    useEffect(() => {
        const now = new Date();
        const currentDate = format(now, "MMMM d, yyyy");
        const currentTime = format(roundToNearest5Minutes(now), "'@' h:mm aaaa 'MST'");
        setGeneratedDateString(`${currentDate} ${currentTime}`);
        setGeneratedDateHTML((
            <div>
                {currentDate}
                <br />
                {currentTime}
            </div>
        ))
    }, []); 

    return {
        tableData, 
        dialogOpen, 
        setDialogOpen, 
        selectedWallets, 
        move,
        saveTableData,
        deleteTableData,
        savedTables,
        savedTableId,
        transferTxnsToBlend,
        saveTableSnackbarMessage,
        saveTableSnackbarOpen,
        handleCloseSaveTableSnackbar,

        showMemberName,
        showHeaderRow,
        adjustedNetTotal,
        sortBy,

        handleToggleMemberName,
        handleToggleHeaderRow,
        handleAdjustedNetTotalChange,
        handleSortByChange,

        dialogTitle,
        generatedDateHTML,
        generatedDateString
    }
};

export default HeaderUX;