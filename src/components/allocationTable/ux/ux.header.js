import { useEffect, useState } from "react";
import { format } from 'date-fns';
import { generateAllocationTableTitle } from "../../../lib/functions/format";
import { roundToNearest5Minutes } from '../../../lib/functions/time';

const HeaderUX = ({
    selectedWallets, 
    move,
    ...props
} = {}) => {   

    const [showConversions, setShowConversions] = useState(false); 
    const [showMemberName, setShowMemberName] = useState(false);
    const [showHeaderRow, setShowHeaderRow] = useState(true);
    const [adjustedNetTotal, setAdjustedNetTotal] = useState("");
    const [numberOfTokensToDistribute, setNumberofTokensToDistribute] = useState(0); 
    
    const [generatedDateString, setGeneratedDateString] = useState("");
    const [generatedDateHTML, setGeneratedDateHTML] = useState("");
    const [sortBy, setSortBy] = useState("Amount");
    const [isAggregated, setIsAggregated] = useState(false);

    const handleToggleConversions = (event) => {
        setShowConversions(event.target.checked);
    };
    
    const handleToggleMemberName = (event) => {
        setShowMemberName(event.target.checked);
    };
    
    const handleToggleHeaderRow = (event) => {
        setShowHeaderRow(event.target.checked);
    };
    
    const handleAdjustedNetTotalChange = (event) => {
        setAdjustedNetTotal(event.target.value);
    };

    const handleNumberOfTokensToDistributeChange = (event) => {
        setNumberofTokensToDistribute(event.target.value);
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

    useEffect(() => {     
        setIsAggregated(selectedWallets.length > 1);
    }, [selectedWallets]);

    return {
        selectedWallets, 
        move,
        ...props,

        showConversions,
        showMemberName,
        showHeaderRow,
        adjustedNetTotal,
        numberOfTokensToDistribute,
        sortBy,

        handleToggleConversions,
        handleToggleMemberName,
        handleToggleHeaderRow,
        handleAdjustedNetTotalChange,
        handleNumberOfTokensToDistributeChange,
        handleSortByChange,

        dialogTitle,
        generatedDateHTML,
        generatedDateString,
        isAggregated
    }
};

export default HeaderUX;