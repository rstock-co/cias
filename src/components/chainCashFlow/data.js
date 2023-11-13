export const generateChainFlowTableData = (data, chain) => {
    const chainData = data.filter(item => item.chain === chain);
    const inTxns = chainData.filter(item => item.flow === "In");
    const outTxns = chainData.filter(item => item.flow === "Out");

    const inflow = inTxns.reduce((acc, cur) => acc + Number(cur.amount), 0);
    const outflow = outTxns.reduce((acc, cur) => acc + Number(cur.amount), 0);
    const netFlow = inflow - outflow;

    const txnsIn = inTxns.length;
    const txnsOut = outTxns.length;

    return {
        chain,
        inflow,
        outflow,
        netFlow,
        txnsIn,
        txnsOut,
        totalTxns: txnsIn + txnsOut
    };
};