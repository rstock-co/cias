import { getAddressByName } from "../../lib/functions/wallets";
import { getERC20TxnsArb } from "../../api/arb";
import { getERC20TxnsBsc } from "../../api/bsc";
import { getERC20TxnsEth } from "../../api/eth";

// STABLE COINS TO FETCH
export const stableCoinsToFetch = { 
    stableArb: { address: getAddressByName("stable_usdc_arb"), name: "USDC(Arb)", apiCall: getERC20TxnsArb, chain: "arb", loading: false, txns: 0 },
    stableEth: { address: getAddressByName("stable_usdc_eth"), name: "USDC(Eth)", apiCall: getERC20TxnsEth, chain: "eth", loading: false, txns: 0 },
    stableEth2: { address: getAddressByName("stable_usdt_eth"), name: "USDT(Eth)", apiCall: getERC20TxnsEth, chain: "eth", loading: false, txns: 0 },
    stableBsc: { address: getAddressByName("stable_busd_bep20"), name: "BUSD(Bep20)", apiCall: getERC20TxnsBsc, chain: "bsc", loading: false, txns: 0 },
    stableBsc2: { address: getAddressByName("stable_bsc-usd_bep20"), name: "BSC-USD(Bep20)", apiCall: getERC20TxnsBsc, chain: "bsc", loading: false, txns: 0 },
};

// TABLE COLUMNS
export const propertyMap = {
    id: { header: '#', align: 'center' },
    chain: { header: 'Chain', align: 'center' },
    wallet: { header: 'Wallet', align: 'center' }, 
    inout: { header: 'In/Out', align: 'center' },
    dateTime: { header: 'Date/Time', align: 'left' },
    link: { header: 'Txn', align: 'center' },
    from: { header: 'From', align: 'left' },
    to: { header: 'To', align: 'left' },
    walletType: { header: 'Description', align: 'left' },
    amountDisplay: { header: 'Amount ($)', align: 'center' },
    currency: { header: 'Currency ($)', align: 'center' },
};