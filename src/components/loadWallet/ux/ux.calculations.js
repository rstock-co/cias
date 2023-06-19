const CalculationsUX = ({
    tableData
} = {}) => {

    const calculateTotalTransactionsByChain = (tableData) => {
        const chains = ['arb', 'bsc', 'eth'];
        let result = {};
        chains.forEach(chain => {
            result[chain] = tableData.filter(row => row.chain.toLowerCase() === chain).length;
        });
        return result;
    }

    const calculateTotalValueByChain = (tableData) => {
        const chains = ['arb', 'bsc', 'eth'];
        let result = {};
        chains.forEach(chain => {
            result[chain] = tableData.reduce((total, row) => {
                return row.chain.toLowerCase() === chain ? total + parseFloat(row.amount) : total;
            }, 0);
        });
        return result;
    }

    const formatChainData = (transactions, values) => {
        return Object.entries(transactions).map(([chain, count]) => {
            return `${chain.toUpperCase()}: ${count} transactions, $${values[chain].toFixed(2)} total`;
        });
    }




    return {
        calculateTotalTransactionsByChain,
        calculateTotalValueByChain,
        formatChainData
    }

}

export default CalculationsUX;
