import React, { useState } from 'react';
import { StyledTabs, StyledTab } from './styles'; 

const TableTabs = () => {
    const [tabIndex, setTabIndex] = useState(0);

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    return (
        <StyledTabs value={tabIndex} onChange={handleChange}>
            <StyledTab label="Tab 1" />
            <StyledTab label="Tab 2" />
            <StyledTab label="Tab 3" />
        </StyledTabs>
    );
};

export default TableTabs;
