import React, { useState } from 'react';
import { StyledTabs, StyledTab } from './styles'; 
import { extractTitle } from '../../lib/functions/format';
import SavedTable from '../savedTable/view';

const TableTabs = ({savedTables, selectedWallets}) => {
    const [tabIndex, setTabIndex] = useState(0);

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    return (
        <>
            <StyledTabs value={tabIndex} onChange={handleChange}>
                {savedTables.length > 0 && savedTables.map((table, index) => (
                    <StyledTab key={table.id} label={`${extractTitle(table.tableTitle)}`} disableRipple />
                ))}
            </StyledTabs>
            {savedTables.length > 0 && (
                <SavedTable data={savedTables[tabIndex]} selectedWallets={selectedWallets} />
            )}
        </>
    );
};

export default TableTabs;
