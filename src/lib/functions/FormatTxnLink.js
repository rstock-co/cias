const FormatTxnLink = ({ hash, chain }) => {
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

export default FormatTxnLink;
