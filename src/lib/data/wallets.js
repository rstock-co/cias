export const INVESTMENT_WALLET = '0xb79e768bef0ca0a34e53c3fe2ac26e600acf8cca'.toLowerCase();

export const depositWallets = [
    {
        name: "investments (deposit)",
        address: "0xb79e768bef0ca0a34e53c3fe2ac26e600acf8cca"
    }, {
        name: "fair-launches (deposit)",
        address: "0xb443c767dcb9a858a0acceb76191ddde4cd70c4d"
    }, {
        name: "nfts (deposit)",
        address: "0x3f2288f29fd58324d7414fd005dba14443cc3edd"
    }, {
        name: "membership (deposit)",
        address: "0xab5573f28e6dd9ec34966b06e4c736481f393fc7"
    }, {
        name: "initial-trust-raise (deposit)",
        address: "0x8c78290373623175dfa7a4736bd3a340b670bce9"
    },{
        name: "gas (deposit)",
        address: "0xdf12edaae8acb58e09bab1ada1aa9e9bcdf5b45a"
    },
].map(wallet => ({...wallet, address: wallet.address.toLowerCase()}));

export const teamWallets = [
    {
        name: "jp-binance (team)",
        address: "0x2a9626a6fc4665fe0351a319d225c2937fc5a55a"
    }, {
        name: "binance-arb (team)",
        address: "0xb38e8c17e38363af6ebdcb3dae12e0243582891d"
    }, {
        name: "bybit (team)",
        address: "0xF534Fe3c6061D61458C3f6CA29B2d5Ba7855E95D"
    }, {
        name: "cex-xfers (team)",
        address: "0x026e2f80572b9e20D93E18E82EF34B824916b330"
    }, {
        name: "bybit-hot (team)",
        address: "0xf89d7b9c864f589bbf53a82105107622b35eaa40"
    }, {
        name: "binance-14-hot (team)",
        address: "0x28c6c06298d514db089934071355e5743bf21d60"
    }, {
        name: "binance-15-hot (team)",
        address: "0x21a31ee1afc51d94c2efccaa2092ad1028285549"
    }, {
        name: "nfts (team)",
        address: "0x5341de11f6ef17d3b8d213b99fc2435361a1bbf0"
    }, {
        name: "fees (team)",
        address: "0xf037e27d60da261bbb80f11adeb6a2354ef0cfc1"
    }, {
        name: "charity (team)",
        address: "0xe30a3ea5f406962bb39d0dd71fd00a96572730be"
    }, {
        name: "swaps (team)",
        address: "0x0b58f4c88fbc4c87b1900f5f6c55c60b1720947b"
    }, {
        name: "shared-team-wallet (team)",
        address: "0xc91b132921ecc41bbc8deff27681602ec04102b9"
    }, {
        name: "poolo (team)",
        address: "0xcf3e1b2ed48cd076dff102f59ee771b09a41aa5e"
    }, {
        name: "fair-launches (team)",
        address: "0xd80c26ee84bd9eebb932461efe49022edec11318"
    }, 
].map(wallet => ({...wallet, address: wallet.address.toLowerCase()}));

export const conversionServiceWallets = [
    {
        name: "odos-router-v1-recieve (team)",
        address: "0xdd94018f54e565dbfc939f7c44a16e163faab331"
    }, {
        name: "odos-router-v1-send (team)",
        address: "0xcfedfa1734528a1ad96a5ee999b034623785c6ae"
    },
].map(wallet => ({...wallet, address: wallet.address.toLowerCase()}));

export const membershipWallets = [
    {
        name: "black-dragon (membership)",
        address: "0x2a42ecc98faa7c66ef41da84fc63d4ca08bf2b37"
    }, {
        name: "venture-capital-x (membership)",
        address: "0xba25e33085ae1122c10f2d8ff9325fa8bc922e23"
    }, {
        name: "gcr (membership)",
        address: "0xeed2b769c798e0b05ceed848ba01fac32e2dc5aa"
    }, {
        name: "300dao (membership)",
        address: "0x29bb0a097d31db6ea597ee52b4c61877fa96ed36"
    }, {
        name: "a2dao (membership)",
        address: "0x219932252f6ae72c90aa03e768ea89a94a1dd256"
    }, {
        name: "carnage-club (membership)",
        address: "0x8b99b9b59f3fb60560a9d7e49ebcfb36945cec67"
    }, {
        name: "digits-club (membership)",
        address: "0xa9786e9cfaef54b2bd160b3b0bbf5c6df675458e"
    }, {
        name: "steady-stack (membership)",
        address: "0x0147a5254391689562ea68a3f6880a63fccbb168"
    }, {
        name: "citcap (membership)",
        address: "0x61c87d7508f404bbf23ef2dfe04919675155306c"
    }, {
        name: "enjinstarter (membership)",
        address: "0x9125a47cf0f0bf513922515aeca3ccd91674795b"
    }, {
        name: "vc-finterest",
        address: "0xaa9324d3ac98d65782e7c630f878140d4a127445"
    }, {
        name: "vc-hypercycle",
        address: "0x2b485b86c843332a2abfd553d5fe7485cee0348c"
    }, {
        name: "futures-trader-???",
        address: "0x1c31fb3359357f6436565ccb3e982bc6bf4189ae"
    }, {
        name: "???",
        address: "0x47ea95183e049fa7678dcc38d209e0549266b998"
    }, {
        name: "???",
        address: "0xc03c4eae85c99d775da1945fc636e713fc281fb0"
    }, {
        name: "???",
        address: "0xcfedfa1734528a1ad96a5ee999b034623785c6ae"
    }, {
        name: "???",
        address: "0x6e70661439285c6c16f8aae549070e18bd1baf3b"
    }, 
].map(wallet => ({...wallet, address: wallet.address.toLowerCase()}));

export const investmentWallets = [
    {
        name: "vela-hyper-vlp (invest)",
        address: "0xf12c5aa8b0c0be4365663c08671fc4e8a995670b"
    }, {
        name: "vela-hyper-vlp-2 (invest)",
        address: "0xc569e83944d94b7b3eadb244ff80a37b109fe501"
    }, {
        name: "busdpad (invest)",
        address: "0x5f11b7a138fb108850572b9ac538e571da64d969"
    }, {
        name: "games-for-a-living (invest)",
        address: "0x8d64d9cb00a71863f7438f4b3036aed40f5a45a1"
    }, {
        name: "kintsu (invest)",
        address: "0x5a8b42130c9f10718afabcf43876dec0792b478c"
    }, {
        name: "nillion-otc (invest)",
        address: "0x31716f93a9e69a28ab548eaf34237c844650cb26"
    }, {
        name: "nillion-individual (invest)",
        address: "0x7ffe348d2a4227144c1fa28c6e839757d91e0684"
    }, {
        name: "fuel (invest)",
        address: "0xac8c01251a9937ced17474593d423341d0ecda57"
    }, {
        name: "sui (invest)",
        address: "0xd5c604aa5e122499f89084f2c3af26a822a22235"
    }, {
        name: "finterest-receiver (invest)",
        address: "0xcac455d1af104cf5a417bc93c981a4a05c92d8ef"
    }, {
        name: "finterest-deposit (invest)",
        address: "0x6408769e416d3db8a0fa4bc908da3418fcffddea"
    }, {
        name: "deposit (invest)",
        address: "0x6408769e416d3db8a0fa4bc908da3418fcffddea"
    }, {
        name: "ftmo-challenge (invest)",
        address: "0x97f7d4d7a8874146b926a77f50c2b85281a693ee"
    }, {
        name: "auki-otc-3-receiver (invest)",
        address: "0x51c81a1d51a3954d535eefed6e01d6ffdf924f54"
    }, {
        name: "poppa-stonks-crypto-futures (invest)",
        address: "0x40333f9597344d3287ddf439dbdec0a2163891e8"
    }, {
        name: "octomarket-receiver (invest)",
        address: "0xcaa6bb0bca23ece02e97d6285955cc6770a1538f"
    }, {
        name: "ghost-trader[gtr] (invest)",
        address: "0x70046dad7ec5005e4219b1378a1cbafe94811618"
    }, {
        name: "auki-receiver (invest)",
        address: "0x1939e1d7516269f687ea9be1757ca019b1347878"
    }, {
        name: "auki-deposit (invest)",
        address: "0xb0584b2c3b15313027fc2251c73c7279df18fd08"
    }, {
        name: "supraoracles (invest)",
        address: "0x8d065407ccfb48b93fc2d0792218e185a31e1776"
    }, {
        name: "gunzilla-receiver (invest)",
        address: "0xce99df0bfdfa9e14ca189b8c938c2f86e86b9e75"
    }, {
        name: "gunzilla-deposit (invest)",
        address: "0x230bb1703024cf5da347a832ad2f1dcf5016bebc"
    }, {
        name: "vVv-whale-equity-deposit (invest)",
        address: "0x37c453e88bf69b9deeadfcbda2286b943fac8a1c"
    }, {
        name: "vVv-equity-receiver (invest)",
        address: "0xd6a9960cf9ce87535b2afe3875002ff0fc556e9b"
    }, {
        name: "vVv-dolphin-equity-deposit (invest)",
        address: "0x665de8fcd2fea9776605605e06b2fd752fdd807c"
    }, {
        name: "BeNFT (invest)",
        address: "0xdc031ed0ff6aef2caaf12bc3b8f365550ea1c462"
    }, {
        name: "karate-dao (invest)",
        address: "0x01b66e3e3c1af5e2e3c0a50ebeb94af4ef4bd0f5"
    }, {
        name: "worlds-beyond (invest)",
        address: "0x493d147402c9c60cd28779b4fba9c940335007d5"
    }, {
        name: "hypercycle (invest)",
        address: "0xed1c9293358d89399a0183d922e6ef5b701b1503"
    }, {
        name: "unify (invest)",
        address: "0x853af2223cfc99bb0e964b48e33b824129f87bee"
    }, {
        name: "fluidity (invest)",
        address: "0x21e4d03fea7dd4dc6423828849a120ece57c8ba5"
    }, {
        name: "shrapnel (invest)",
        address: "0x2fa3df5c6d753042830f1f65f96185ab3a05bfd4"
    }, {
        name: "sei (invest)",
        address: "0x9502e66cb0480fa2d8f7f60787120ffe1f9fe77c"
    }, {
        name: "auki-otc-1 (invest)",
        address: "0x926d6b1644fe096c7e2d10c6ea7a0d5fa9fc754d"
    }, {
        name: "auki-otc-2 (invest)",
        address: "0xaf2d7bb39349afd03400a8a1faa98eeed521336e"
    }, {
        name: "filswan (invest)",
        address: "0x4b745f084319d584e32f5dd4b336a8e762c97bc2"
    },

    // degen
    {
        name: "degen-main (invest)",
        address: "0xc03c4eae85c99d775da1945fc636e713fc281fb0"
    }, {
        name: "degen-slush (invest)",
        address: "0x47ea95183e049fa7678dcc38d209e0549266b998"
    }, {
        name: "degen-alex-pool (invest)",
        address: "0xd7a439191087e0535f4084488d174468b33f2d9b"
    }, {
        name: "degen-crescent-swap (invest)",
        address: "0x5453cbc17454a5ac82e37d5a704ac59824c58fb0"
    },

].map(wallet => ({...wallet, address: wallet.address.toLowerCase()}));

export const stableCoinContracts = [
    {
        name: "usdc-e_arb",
        address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8"
    }, {
        name: "usdc_arb",
        address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"
    }, {
        name: "usdc2_arb",
        address: "0xAe321792046A4606ab5965793A61C0A7a703ED7A"
    }, {
        name: "usdt_arb",
        address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9"
    }, {
        name: "usdc_eth",
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    }, {
        name: "usdt_eth",
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7"
    }, {
        name: "busd_bep20",
        address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"
    }, {
        name: "bsc-usd_bep20",
        address: "0x55d398326f99059fF775485246999027B3197955"
    }
].map(wallet => ({...wallet, address: wallet.address.toLowerCase()}));

export const velaWallets = [
    {
        name: "vela-token",
        address: "0x088cd8f5eF3652623c22D48b1605DCfE860Cd704"
    }, {
        name: "move-lava",
        address: "0xefabc0328fd122f68199b36de51d8629ba2f6b23"
    }, {
        name: "lava-main",
        address: "0x8C74dBCBb3f89Efd05316F6593e227ab7EbF959C"
    }, {
        name: "vela-sell",
        address: "0x66a1439457719124d5812a077f8409098ba2ca95"
    }, {
        name: "lava-2",
        address: "0x593439a51C0E7048f445ae0639B1389fea2c921E"
    }, {
        name: "lava-3",
        address: "0x0E5f914ca4b510FD69F7A5b9995d6d2183e810bD"
    }, {
        name: "lava-4",
        address: "0x8B39b8FF88F073529De2c60753b6118fEa528cFe"
    }, {
        name: "lava-5",
        address: "0x8565C5CfF0461094f1104bEE293688198b749503"
    }, {
        name: "lava-6",
        address: "0x1661ebCB1A63cceA7D8acf2249d71297f168a37F"
    }, {
        name: "lava-7",
        address: "0x3591E7Bf8a027E952B923152FE06883F3072367b"
    }, {
        name: "lava-8",
        address: "0x916C32E5b5482f429425FF9A7219020a833B8048"
    }, {
        name: "lava-9",
        address: "0xc5DB629aA89E78F534aC104C1f573f6188B63b58"
    }, {
        name: "lava-10",
        address: "0xAcdF02Ce9dD7164eFbD19Bb620Dc2DD46199B26f"
    }    
].map(wallet => ({...wallet, address: wallet.address.toLowerCase()}));

export const legacyWallets = [
    {
        name: "serenity-shield",
        address: "0x402B7B932A76d1f007dDC5E51A63105F05bb017B"
    }, {
        name: "heating-blanket",
        address: "0x670ab42a33be7aa7fc591ed1e4df74bf4cc4d6b2"
    }, {
        name: "volcano",
        address: "0x1865fa691B468ef7bFd789EE9D29efbe3dc7d47A"
    }, {
        name: "galleon",
        address: "0x81281EB16F37eBf29820c503529B62E99798911B"
    }
].map(wallet => ({...wallet, address: wallet.address.toLowerCase()}));

export const memberWallets = [
    {
        name: "VJ",
        address: "0xdaee7f914e6169a831ad7306e5097e793912acef"
    }, {
        name: "JP",
        address: "0x0f5C73f3210147920995b9C992438d1b2717751c"
    }, {
        name: "JP",
        address: "0x44221b3a2ac73b6d5e666a2b546f903953df5bae"
    }, {
        name: "SR",
        address: "0x02aC25b565c053bc1E7Aa2A1499622512Af375F1"
    }, {
        name: "jabpsych",
        address: "0xeef930E4dc7b379d824B63d28af6b633F870dA0e"
    }, {
        name: "alex",
        address: "0xA9854d7dbaeF0a91c8fF6b26F01B46D25C518a79"
    }, {
        name: "Jay",
        address: "0x224fA7d0e1406A3F85978EA995c79b58da4ebe04"
    }, {
        name: "JimJo",
        address: "0x456245235D4bEf02671f2D43f34291bbE367a2f6"
    }, {
        name: "MrsBones",
        address: "0xcB45Dc6c09D06cF16aa54Ff88125B2be24084469"
    }, {
        name: "shiios",
        address: "0x3B6EC3855266385928E8dF4bF5ce6ad4235a10bD"
    }, {
        name: "vant4mi",
        address: "0xa818210bae304ed8b78c0e72abcc5981b7d8fa5f"
    }, {
        name: "Trickstar",
        address: "0xF538077F55ee8d5C1561e47415b77150Ab8554d1"
    }, {
        name: "CraigBrew",
        address: "0x6b90848Ede7cBdD5367673E55fBac0C9D81a679a"
    }, {
        name: "SoberIrishman",
        address: "0x267fF9A3d69C1e75670FD18D202B6FF9c8D5e85e"
    }, {
        name: "JF",
        address: "0xB23562504D71b129359A9bcE5126A7E50876546E"
    }, {
        name: "MegaMoose",
        address: "0xbeCbb8be6D3e1fE3655002D82ddd08CE5Ae9e7a8"
    }, {
        name: "G0dthunder",
        address: "0xb40abd89e6faba971e4dc452ec5de0634276f5fe"
    }, {
        name: "MoneyMagnet",
        address: "0x777328aEC05B84aC86aafC32fc61b576aA97035A"
    }, {
        name: "ricsto",
        address: "0xf19ac505851B7D6bCF1b1182Fd320101EC422094"
    }, {
        name: "BetterThanU",
        address: "0x70F47e22500447C26506967ef958467d7dDb5254"
    }, {
        name: "MDLF",
        address: "0xA6211B1Aa757Cb3b397aD61b1e739D40c926EAf9"
    }, {
        name: "matt",
        address: "0xB57d0386d9Fd47BFf9018BACD86ECDBf43F0FC60"
    }, {
        name: "IrishGrandmaHands",
        address: "0x9e3fb5ed745fc7523ed028879dc76bb7d6434633"
    },
    
    
    // ignore (remove later)
    {
        name: "ignore (Fake - Sober1)",
        address: "0x2677a1713c676df5039d124bc428b3da6485e85e"
    }, {
        name: "ignore (Fake - Sober2)",
        address: "0x26727fca8b020501787ebf217d8d2c059075e85e"
    }, {
        name: "ignore (Fake - 0x969893....1194091)",
        address: "0x96907ac63dee14d21326ac9798f46394d4294091"  
    }, {
        name: "ignore (Fake - MDLF)",
        address: "0xa621134b4818b55779d25a241208b4d26956eaf9"  
    }, {
        name: "ignore (Fake - G0dthunder)",
        address: "0xb40f0e7ccb97228cf47dc55f89706dbfc306f5fe"  
    }, {
        name: "ignore (Fake - 0xf4250....aa81e66)",
        address: "0xf423a30741ebbced1e1faf31396d3dc577481e66"  
    }, {
        name: "ignore (Fake - Alex)",
        address: "0xa98a97d30204b9c598d6b4eef4aa83f29ba18a79"  
    }, {
        name: "ignore (Fake - 0xc123a....a6de00b)",
        address: "0xc120124f69ea7ac2860465270688ddcb4f9de00b"  
    }, {
        name: "ignore (Fake - JimJo)",
        address: "0x456900f4142331b83abf1855a5e88f263e17a2f6"  
    },
].map(wallet => ({...wallet, address: wallet.address.toLowerCase()}));

export const ignoreWallets = [
    {
        name: "ignore (Fake - Sober1)",
        address: "0x2677a1713c676df5039d124bc428b3da6485e85e"
    }, {
        name: "ignore (Fake - Sober2)",
        address: "0x26727fca8b020501787ebf217d8d2c059075e85e"
    }, {
        name: "ignore (Fake - 0x969893....1194091)",
        address: "0x96907ac63dee14d21326ac9798f46394d4294091"  
    }, {
        name: "ignore (Fake - MDLF)",
        address: "0xa621134b4818b55779d25a241208b4d26956eaf9"  
    }, {
        name: "ignore (Fake - G0dthunder)",
        address: "0xb40f0e7ccb97228cf47dc55f89706dbfc306f5fe"  
    }, {
        name: "ignore (Fake - 0xf4250....aa81e66)",
        address: "0xf423a30741ebbced1e1faf31396d3dc577481e66"  
    }, {
        name: "ignore (Fake - Alex)",
        address: "0xa98a97d30204b9c598d6b4eef4aa83f29ba18a79"  
    }, {
        name: "ignore (Fake - 0xc123a....a6de00b)",
        address: "0xc120124f69ea7ac2860465270688ddcb4f9de00b"  
    }, {
        name: "ignore (Fake - JimJo)",
        address: "0x456900f4142331b83abf1855a5e88f263e17a2f6"  
    }, {
        name: "ignore (scam txn)",
        address: "0x47e33c8e86652e00fee2732769c63bffaed6b998"  
    },

].map(wallet => ({...wallet, address: wallet.address.toLowerCase()}));

const combineWallets = (...walletArrays) => walletArrays && walletArrays.flat();

export const allWallets = combineWallets(
    depositWallets,
    teamWallets,
    conversionServiceWallets,
    membershipWallets,
    investmentWallets,
    stableCoinContracts,
    velaWallets,
    legacyWallets,
);
