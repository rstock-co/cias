const BaseUX = ({ data, selectedWallets } = {}) => {
    const { totals = {}, ...restData } = data;

    console.log("BaseUX data: ", data);
    console.log("BaseUX totals: ", totals);
    console.log("BaseUX restData: ", restData);

    return {
        ...restData, // Spread all the properties from data
        ...totals,  // Spread all the properties from totals
        selectedWallets, // Include selectedWallets in the returned object
    };
};

export default BaseUX;
