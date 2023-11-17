import { useState } from "react";
import { roundToNearest5Minutes } from '../../../lib/functions/time';
import { format } from 'date-fns';

const HeaderUX = ({
    tableData, 
    dialogOpen, 
    setDialogOpen, 
    savedTables,
    transferTxnsToBlend,
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
    
    const generatedDate = () => {
        const now = new Date();
        const currentDate = format(now, "MMMM d, yyyy");
        const currentTime = format(roundToNearest5Minutes(now), "'@' h:mm aaaa 'MST'");
        return (
            <>
                {currentDate}
                <br />
                {currentTime}
            </>
        );
    }

    return {
        tableData, 
        dialogOpen, 
        setDialogOpen, 
        savedTables,
        transferTxnsToBlend,

        showMemberName,
        showHeaderRow,
        adjustedNetTotal,
        sortBy,

        handleToggleMemberName,
        handleToggleHeaderRow,
        handleAdjustedNetTotalChange,
        handleSortByChange,

        generatedDate
    }
};

export default HeaderUX;