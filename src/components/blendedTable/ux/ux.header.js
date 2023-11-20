import { useState, useEffect } from "react";
import { roundToNearest5Minutes } from '../../../lib/functions/time';
import { generateAllocationTableTitle, extractTitle } from "../../../lib/functions/format";
import { format } from 'date-fns';

const HeaderUX = ({
    savedTables,
    selectedWallets,
    move,
    blendedTableList,
    ...props
} = {}) => {   

    const [showMemberName, setShowMemberName] = useState(false);
    const [showHeaderRow, setShowHeaderRow] = useState(true);
    const [adjustedNetTotal, setAdjustedNetTotal] = useState("");
    const [sortBy, setSortBy] = useState("Amount");
    const [tabIndex, setTabIndex] = useState(0);
    const [isAggregated, setIsAggregated] = useState(false);

    useEffect(() => {     
        setIsAggregated(selectedWallets.length > 1);
    }, [selectedWallets]);

    const savedTableIds = savedTables.length > 0 ? savedTables.map(savedTable => savedTable.id) : [];
    const filteredBlendedTableIds = blendedTableList.filter(tableId => savedTableIds.includes(tableId));
    
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

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
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

    const dialogTitle = `Blended ${generateAllocationTableTitle(selectedWallets, move)}`;
    const TabTitle = dialogTitle === "Blended No wallets selected" ? '' : 
        <div>
            Blended Wallet
            <br />
            {extractTitle(dialogTitle)}
        </div>

    return {
        ...props,
        filteredBlendedTableIds,

        showMemberName,
        showHeaderRow,
        adjustedNetTotal,
        sortBy,
        tabIndex,

        handleToggleMemberName,
        handleToggleHeaderRow,
        handleAdjustedNetTotalChange,
        handleSortByChange,
        handleTabChange,

        generatedDate,
        dialogTitle,
        TabTitle,
        isAggregated
    }
};

export default HeaderUX;