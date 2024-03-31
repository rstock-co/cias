export const mergeAdjustments = (adjustmentsArray) => {
    // Initialize an object to hold the combined adjustments for all wallet addresses
    const allAdjustments = {};

    adjustmentsArray.forEach(adjustmentObj => {
        const { walletAddress } = adjustmentObj;
        const combinedForWallet = Object.entries(adjustmentObj).reduce((acc, [key, value]) => {
            if (key !== "walletAddress") { // Skip the walletAddress property
                // Assume value is an object like { "walletAddress": adjustmentAmount, ... }
                Object.entries(value).forEach(([walletAddress, amount]) => {
                    // Sum adjustments for each walletAddress
                    acc[walletAddress] = (acc[walletAddress] || 0) + amount;
                });
            }
            return acc;
        }, {});

        // Assign the combined adjustments for this walletAddress to the allAdjustments object
        allAdjustments[walletAddress] = combinedForWallet;
    });

    return allAdjustments;
};


