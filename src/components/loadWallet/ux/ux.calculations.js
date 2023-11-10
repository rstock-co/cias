import { formatChainDataString } from "../../../lib/functions/format";
import { calculateTotalTransactionsByChain, calculateTotalValueByChain } from "../../../lib/functions/data";

const CalculationsUX = ({
    tableData
} = {}) => {

    const totalTransactionsByChain = calculateTotalTransactionsByChain(tableData);
    const totalValueByChain = calculateTotalValueByChain(tableData);
    const formattedChainDataString = formatChainDataString(totalTransactionsByChain, totalValueByChain);

    return {
        totalTransactionsByChain,
        totalValueByChain,
        formattedChainDataString
    }
}

export default CalculationsUX;
