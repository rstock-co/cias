export const FormatTxnLink = ({ hash, chain, style }) => {
    const chainUrls = {
        arb: `https://arbiscan.io/tx/${hash}`,
        bsc: `https://bscscan.com/tx/${hash}`,
        eth: `https://etherscan.io/tx/${hash}`,
    };

    const link = chainUrls[chain];

    return (
        <a href={link} target="_blank" rel="noopener noreferrer" className="txnLink" style={style}>
            Txn
        </a>
    );
};


export const formatSnakeToCapital = (snakeCaseString) => {
    const words = snakeCaseString.split('_');
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    const capitalCasedString = capitalizedWords.join(' ');

    return capitalCasedString;
};

export const formatWalletName = name => 
    // Strip off the part within brackets
    formatSnakeToCapital(name).replace(/ *\([^)]*\) */g, '')
;

export const generateAllocationTableTitle = (selectedWallets, move) => {
    if (selectedWallets.length === 0) return 'No wallets selected'; 

    if (move) return `Allocation Table for: '${move}' Investment`;

    return selectedWallets.length > 1
        ? `Aggregated Allocation Table for: ${selectedWallets.map(wallet => 
            formatWalletName(wallet.name)).join(', ')} (${selectedWallets.length} wallets)`
            : `Allocation Table for: '${formatWalletName(selectedWallets[0].name)}' Wallet`;
};


export const formatAmountDecimals = (chain, value, txnType) => 
    txnType === 'erc20'
        ? chain === 'bsc' ? value / 1e18 : value / 1e6
        : value / 1e18 // Default to ETH conversion for 'normal' transactions
;


export const formatAmountDisplay = (value, txnType = "erc20") => {
    if (value === undefined || value === null || isNaN(value) || Number(value) === 0 || value === '0') {
        return txnType === "normal" ? "0.0000" : "$0.00";
    }

    if (txnType === "normal") {
        return parseFloat(value).toFixed(4);
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
        console.log("Address should start with '0x': ", address);
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

    return `${start} ... ${end}`;
}

export const formatChainData = (chainData) => {
    if (chainData) {
        return Object.entries(chainData)
            .map(([chain, count]) => `${chain}(${count})`)
            .join(", ");
    }
    return "";
};

export const formatChainDataString = (transactions, values) => Object.entries(transactions).map(([chain, count]) => `${chain.toUpperCase()}: ${count} transactions, $${values[chain].toFixed(2)} total`)

export const formatChainMap = (chainMap) => 
    chainMap ? Object.entries(chainMap)
        .map(([chain, count]) => `${chain}(${count})`) 
        : "";

export const formatChainArray = (chainMap) => chainMap 
    ? Object.entries(chainMap)
    .map(([key, value]) => `${key}(${value})`)
    .join(", ")
    : "";

export const formatAggregatedData = (inputData) => {
    if (!inputData) {
        return {
            txns: '',
            totalAmounts: ''
        };
    }

    const keys = Object.keys(inputData);

    const txns = keys.map(key => `${key}(${inputData[key].count})`).join(', ');

    const totalAmounts = keys.map(key => `${key}(${formatAmountDisplay(inputData[key].totalAmount)})`).join(', ');

    return {
        txns,
        totalAmounts
    };
};


export const extractTitle = (tableTitle) => {
    // Pattern to match titles inside single quotes and extract them
    const quotePattern = /'([^']+)'/;
    let match = tableTitle.match(quotePattern);

    // Return the matched group without quotes
    if (match) return match[1];

    // For other cases, remove parentheses and their content, and trim spaces
    if (! tableTitle.includes('for:'))
        return tableTitle.replace(/\([^)]+\)/g, '').trim();

    // If no single quotes found but contains 'for:', process accordingly
    return tableTitle.split('for:')[1]
        .replace(/,/g, '|')
        .replace(/\([^)]+\)/g, '')
        .trim()
        .split('|')
        .map(s => s.trim().replace(/-/g, ' '))
        .join(' | ');
}
