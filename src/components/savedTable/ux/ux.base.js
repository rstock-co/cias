const BaseUX = ({ data, selectedWallets } = {}) => {
    const { totals = {}, ...restData } = data;

    return {
        ...restData, 
        ...totals,  
        selectedWallets, 
    };
};

export default BaseUX;
