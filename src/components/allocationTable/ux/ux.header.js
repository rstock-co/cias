import { useState } from "react";
import { generateAllocationTableTitle } from "../../../lib/functions/format";
import { roundToNearest5Minutes } from '../../../lib/functions/time';
import { format } from 'date-fns';

const HeaderUX = ({
    tableData, 
    dialogOpen, 
    setDialogOpen, 
    selectedWallets, 
    isLoading, 
    move 
} = {}) => {   

    const [showMemberName, setShowMemberName] = useState(false);
    const [showHeaderRow, setShowHeaderRow] = useState(true);
    const [adjustedNetTotal, setAdjustedNetTotal] = useState("");
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
    const generatedDate = format(roundToNearest5Minutes(new Date()), "MMMM d, yyyy '@' h:mm aaaa 'MST'");

    return {
        tableData, 
        dialogOpen, 
        setDialogOpen, 
        selectedWallets, 
        isLoading, 
        move,

        showMemberName,
        showHeaderRow,
        adjustedNetTotal,
        sortBy,

        handleToggleMemberName,
        handleToggleHeaderRow,
        handleAdjustedNetTotalChange,
        handleSortByChange,

        dialogTitle,
        generatedDate
    }
};

export default HeaderUX;