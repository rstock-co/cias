import { useEffect, useMemo, useState } from "react";
import { extractTitle, generateAllocationTableTitle } from "../../../lib/functions/format";
import { format } from 'date-fns';
import { roundToNearest5Minutes } from '../../../lib/functions/time';

const HeaderUX = ({
    savedTables,
    selectedWallets,
    move,
    blendedTableList,
    transferTxnsToBlend,
    ...props
} = {}) => {   

    const [showConversions, setShowConversions] = useState(false);
    const [showMemberName, setShowMemberName] = useState(false);
    const [showHeaderRow, setShowHeaderRow] = useState(true);
    const [adjustedNetTotal, setAdjustedNetTotal] = useState("");
    const [sortBy, setSortBy] = useState("Amount");
    const [tabIndex, setTabIndex] = useState(0);
    const [isAggregated, setIsAggregated] = useState(false);
    const [generatedDateString, setGeneratedDateString] = useState("");
    const [generatedDateHTML, setGeneratedDateHTML] = useState("");
    const [tableTransferTotals, setTableTransferTotals] = useState({});
    const [dynamicDialogTitle, setDynamicDialogTitle] = useState('');


    useEffect(() => {     
        setIsAggregated(selectedWallets.length > 1);
    }, [selectedWallets]);

    const [filteredBlendedTableIds, setFilteredBlendedTableIds] = useState([]);

    useEffect(() => {
        const savedTableIds = savedTables.map(table => table.id);
        const newFilteredIds = blendedTableList.filter(tableId => savedTableIds.includes(tableId));
        setFilteredBlendedTableIds(newFilteredIds);
    }, [blendedTableList, savedTables]); 

    const handleToggleConversions = (event) => {
        setShowConversions(event.target.checked);
    }

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

    const dialogTitle = `Blended ${generateAllocationTableTitle(selectedWallets, move)}`;

    const tabTitle = dialogTitle === "Blended No wallets selected" ? '' : 
        <div>
            Blended Wallet:
            <br />
            {extractTitle(dialogTitle)}
        </div>


    const savedTableDisplayData = useMemo(() => filteredBlendedTableIds.map(tableId => {
            const tableTitle = extractTitle(savedTables.find(table => table.id === tableId)?.tableTitle);
            const transferTotal = tableTransferTotals[tableId] ?? 0.00;
            return { tableId, tableTitle, transferTotal };
        }), [filteredBlendedTableIds, savedTables, tableTransferTotals]);

    
    useEffect(() => {
        const updateDynamicTitle = (index) => {
            console.log("Updating dynamic title for index:", index);
            if (index < savedTableDisplayData.length) {
                const selectedTable = savedTableDisplayData[index];
                setDynamicDialogTitle(`Transfer Wallet # ${index + 1}: ${selectedTable.tableTitle}`);
            } else {
                setDynamicDialogTitle(dialogTitle === "Blended No wallets selected" ? "Blended No wallets selected" : `Blended Wallet: ${extractTitle(dialogTitle)}`);
            }
        };
        if (savedTableDisplayData && savedTableDisplayData.length > 0) {
            updateDynamicTitle(tabIndex);
        }
    }, [savedTableDisplayData, tabIndex, dialogTitle]);

    useEffect(() => {
        // Calculate the total transfer amount for each table in filteredBlendedTableIds
        const totals = filteredBlendedTableIds.reduce((acc, tableId) => {
            const totalAmount = Object.entries(transferTxnsToBlend)
                .filter(([, txnInfo]) => txnInfo.tableID === tableId)
                .reduce((total, [, txnInfo]) => total + txnInfo.amount, 0);

            acc[tableId] = totalAmount;
            return acc;
        }, {});

        setTableTransferTotals(totals);
    }, [transferTxnsToBlend, filteredBlendedTableIds, savedTables]);

    return {
        ...props,
        filteredBlendedTableIds,

        showConversions,
        showMemberName,
        showHeaderRow,
        adjustedNetTotal,
        sortBy,
        tabIndex,

        handleToggleConversions,
        handleToggleMemberName,
        handleToggleHeaderRow,
        handleAdjustedNetTotalChange,
        handleSortByChange,
        handleTabChange,

        generatedDateString,
        generatedDateHTML,
        dialogTitle,
        isAggregated,
        tableTransferTotals,
        savedTableDisplayData,
        dynamicDialogTitle,
        tabTitle,
    }
};

export default HeaderUX;
