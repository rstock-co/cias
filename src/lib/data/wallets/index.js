import wallets from "./walletImports";

const createWallet = ([name, address]) => ({
    name,
    address: address.toLowerCase()
});

const mappedWallets = Object.entries(wallets.wallets)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value.map(createWallet)}) , {});

export const INVESTMENT_WALLET = wallets.investmentWallet;

export const {
    depositWallets,
    teamWallets,
    conversionServiceWallets,
    membershipWallets,
    vcWallets,
    investmentWallets,
    contributionWallets,
    stableCoinContracts,
    velaWallets,
    legacyWallets,
    tokenContractAddresses,
    memberWallets,
    ignoreWallets 
} = mappedWallets;


export const allWallets = Object.values(mappedWallets).flat();

