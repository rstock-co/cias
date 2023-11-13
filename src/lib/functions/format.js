export const FormatTxnLink = ({ hash, chain }) => {
    const chainUrls = {
        arb: `https://arbiscan.io/tx/${hash}`,
        bsc: `https://bscscan.com/tx/${hash}`,
        eth: `https://etherscan.io/tx/${hash}`,
    };

    const link = chainUrls[chain];

    return (
        <a href={link} target="_blank" rel="noopener noreferrer" className="txnLink">
            Txn
        </a>
    );
};

export const formatSankeToCapital = (snakeCaseString) => {
    const words = snakeCaseString.split('_');
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    const capitalCasedString = capitalizedWords.join(' ');

    return capitalCasedString;
};

export const generateTitle = (selectedWallets, move) => {
    if (selectedWallets.length === 0) return 'No wallets selected'; 
    
    if (move) return `Allocation Table for: '${move}' Investment`;

    return selectedWallets.length > 1
        ? `Aggregated Allocation Table for: ${selectedWallets.map(wallet => 
            formatSankeToCapital(wallet.name)).join(', ')} (${selectedWallets.length} wallets)`
        : `Allocation Table for: '${formatSankeToCapital(selectedWallets[0].name)}' Wallet`;
}

export const formatAmountDecimals = (chain, value) => chain === 'bsc' ? value / 1e18 : value / 1e6;

export const formatAmountDisplay = (value) => {
    if (value === undefined || value === null || isNaN(value)) {
        return "$0.00"; 
    }

    return value.toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

export const shortenAddress = (address, startLength = 4, endLength = 6) => {
    // Ensure the input is a string
    if (typeof address !== 'string') {
        console.log("Input should be a string");
        return;
    }

    // Ensure the address starts with '0x'
    if (!address.startsWith('0x')) {
        console.log("Address should start with '0x'");
        return;
    }

    // Ensure the address is the correct length
    if (address.length !== 42) {
        console.log("Address should be 42 characters long");
        return;
    }

    // Get the start and end of the address
    const start = address.substring(0, startLength + 2); // add 2 to account for '0x'
    const end = address.substring(address.length - endLength);

    return start + '...' + end;
}

export const lowercase = (string) => {
    return string.toLowerCase();
}

export const formatChainData = (chainData) => {
    if (Array.isArray(chainData)) {
        return chainData.join(", ");
    }
    return "";
};

export const formatChainDataString = (transactions, values) => {
    return Object.entries(transactions).map(([chain, count]) => {
        return `${chain.toUpperCase()}: ${count} transactions, $${values[chain].toFixed(2)} total`;
    });
}

export const formatChainMap = (chainMap) => {
    if (chainMap) {
        return Object.entries(chainMap)
            .map(([chain, count]) => `${chain}(${count})`)
            .join(", ");
    }
    return "";
};

export const formatChainArray = (chainMap) => {
    if (chainMap) {
        return chainMap.join(", ");
    }
    return "";
};
