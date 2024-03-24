import wallets from "./walletImports";

const createWallet = ([name, address]) => ({
    name,
    address: address.toLowerCase()
});

const mappedWallets = Object.entries(wallets.wallets)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value.map(createWallet)}) , {});

export const INVESTMENT_WALLET = wallets.investmentWallet;
export const INDEX_FUND_WALLET = wallets.indexFundWallet;

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

const noDisplayWallets = {
    conversionServiceWallets,
    stableCoinContracts,
    tokenContractAddresses,
    memberWallets,
    ignoreWallets 
};

export const allWallets = Object.entries(mappedWallets)
    .filter(([key]) => key !== 'memberWallets')
    .flatMap(([, wallets]) => wallets);

export const displayWallets = allWallets.filter(wallet => 
    !Object.values(noDisplayWallets).some(category => category.includes(wallet)));

