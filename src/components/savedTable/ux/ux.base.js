const BaseUX = ({ data, selectedWallets, setSavedTables } = {}) => {
    const { totals = {}, ...restData } = data;

    const updateSavedTableState = (tableId, newState) => {
        setSavedTables(prevTables => {
            return prevTables.map(table => {
                if (table.id === tableId) {
                    // Update the state of the specific table
                    return { ...table, state: { ...table.state, ...newState } };
                }
                return table; // Return other tables unchanged
            });
        });
    };
    
    const headerStateSetters = (tableId) => ({
        toggleMemberName: value => updateSavedTableState(tableId, { showMemberName: value }),
        toggleHeaderRow: value => updateSavedTableState(tableId, { showHeaderRow: value }),
        adjustedNetTotal: value => updateSavedTableState(tableId, { adjustedNetTotal: value }),
        sortBy: value => updateSavedTableState(tableId, { sortBy: value }),
        transferTotal: value => updateSavedTableState(tableId, { transferTotal: value }),
    });
    
    return {
        ...restData, 
        ...totals,  
        selectedWallets, 
        headerStateSetters
    };
};

export default BaseUX;
