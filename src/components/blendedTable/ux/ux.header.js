import { useState } from "react";
import { roundToNearest5Minutes } from '../../../lib/functions/time';
import { format } from 'date-fns';

const HeaderUX = ({
    savedTables,
    blendedTableList,
    ...props
} = {}) => {   

    const [showMemberName, setShowMemberName] = useState(false);
    const [showHeaderRow, setShowHeaderRow] = useState(true);
    const [adjustedNetTotal, setAdjustedNetTotal] = useState("");
    const [sortBy, setSortBy] = useState("Amount");
    const [tabIndex, setTabIndex] = useState(0);

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

        generatedDate
    }
};

export default HeaderUX;