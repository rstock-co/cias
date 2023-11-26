import wallets from './wallets.json';

const createWallet = ([name, address]) => ({
    name,
    address: address.toLowerCase()
});

export const INVESTMENT_WALLET = wallets.investmentWallet;

export const depositWallets = wallets.depositWallets.map(createWallet);

export const teamWallets = wallets.teamWallets.map(createWallet);

export const conversionServiceWallets = wallets.conversionServiceWallets.map(createWallet);

export const membershipWallets = wallets.membershipWallets.map(createWallet);

export const vcWallets = wallets.vcWallets.map(createWallet);

export const investmentWallets = wallets.investmentWallets.map(createWallet);

export const contributionWallets = wallets.contributionWallets.map(createWallet);

export const stableCoinContracts = wallets.stableCoinContracts.map(createWallet);

export const velaWallets = wallets.velaWallets.map(createWallet);

export const legacyWallets = wallets.legacyWallets.map(createWallet);

export const tokenContractAddresses = wallets.tokenContractAddresses.map(createWallet);

export const memberWallets = wallets.memberWallets.map(createWallet);

export const ignoreWallets = wallets.ignoreWallets.map(createWallet);

export const allWallets =[ 
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
    tokenContractAddresses
].flat();
