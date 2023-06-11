export const getAddressByName = walletName => {
    const wallet = wallets.find(wallet => wallet.name === walletName);
    return wallet ? wallet.address : null;
}

export const getNameByAddress = (address) => {
    const wallet = wallets.find(wallet => wallet.address.toLowerCase() === address.toLowerCase());
    return wallet ? wallet.name : 'Member';
}

export const wallets = [

    // TOKENS
    {
        name: "vela",
        address: "0x088cd8f5eF3652623c22D48b1605DCfE860Cd704"
    },

    // STABLE COIN CONTRACTS
    {
        name: "stable_usdc_arb",
        address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8"
    },
    {
        name: "stable_usdc_eth",
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    },
    {
        name: "stable_usdt_eth",
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7"
    },
    {
        name: "stable_busd_bep20",
        address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"
    },

    // POOL
    {
        name: "pool_investments",
        address: "0xb79E768bEF0Ca0a34E53c3FE2ac26E600ACf8ccA"
    },
    {
        name: "pool_fair_launches",
        address: "0xb443C767dcB9A858A0Acceb76191dDDe4CD70c4D"
    },
    {
        name: "pool_nfts",
        address: "0x3f2288F29fD58324D7414FD005Dba14443CC3eDd"
    },
    {
        name: "pool_membership",
        address: "0xab5573F28e6dD9Ec34966b06e4C736481F393FC7"
    },
    {
        name: "pool_trust",
        address: "0x8c78290373623175dfa7a4736bd3a340b670bce9"
    },

    // VC MEMBERSHIPS
    {
        name: "vc_mem_blackdragon",
        address: "0x2a42Ecc98FAA7C66Ef41DA84fC63D4Ca08bf2B37"
    },
    {
        name: "vc_mem_venturecapitalx",
        address: "0xbA25e33085Ae1122c10f2d8ff9325FA8Bc922E23"
    },
    {
        name: "vc_mem_3_???",
        address: "0x5341de11f6ef17d3b8d213b99fc2435361a1bbf0"
    },
    {
        name: "vc_mem_4_???",
        address: "0xcfedfa1734528a1ad96a5ee999b034623785c6ae"
    },
    {
        name: "vc_mem_5_???",
        address: "0x0147a5254391689562ea68a3f6880a63fccbb168"
    },
    {
        name: "vc_mem_6_???",
        address: "0x61c87d7508f404bbf23ef2dfe04919675155306c"
    },
    {
        name: "vc_mem_7_???",
        address: "0x1c31fb3359357f6436565ccb3e982bc6bf4189ae"
    },
    {
        name: "vc_mem_8_???",
        address: "0x47ea95183e049fa7678dcc38d209e0549266b998"
    },
    {
        name: "vc_mem_9_???",
        address: "0xc03c4eae85c99d775da1945fc636e713fc281fb0"
    },

    // VC INVESTMENTS
    {
        name: "hypercycle",
        address: "0xED1c9293358d89399A0183D922e6Ef5b701b1503"
    },
    {
        name: "finterest",
        address: "0x6408769E416D3Db8a0fa4Bc908Da3418fcFfDDEa"
    },
    {
        name: "worlds_beyond",
        address: "0x493d147402c9C60cd28779B4FBA9C940335007D5"
    },
    {
        name: "games_for_a_living",
        address: "0x8d64d9cb00a71863f7438f4b3036aed40f5a45a1"
    },
    {
        name: "vVv_equity_raise",
        address: "0x37c453e88bf69b9deeadfcbda2286b943fac8a1c"
    },
    {
        name: "SUI",
        address: "0xd5c604aa5e122499f89084f2c3af26a822a22235"
    },
    {
        name: "futures_trader_???",
        address: "0x1c31fb3359357f6436565ccb3e982bc6bf4189ae"
    },

    // LAVA (VELA)
    {
        name: "move_lava",
        address: "0xefabc0328fd122f68199b36de51d8629ba2f6b23"
    },
    {
        name: "move_vela_hyper_vlp",
        address: "0xF12C5aa8B0c0Be4365663C08671fC4E8a995670b"
    },
    {
        name: "lava_main",
        address: "0x8C74dBCBb3f89Efd05316F6593e227ab7EbF959C"
    },
    {
        name: "lava_2",
        address: "0x593439a51C0E7048f445ae0639B1389fea2c921E"
    }, {
        name: "lava_3",
        address: "0x0E5f914ca4b510FD69F7A5b9995d6d2183e810bD"
    },
    {
        name: "lava_4",
        address: "0x8B39b8FF88F073529De2c60753b6118fEa528cFe"
    },
    {
        name: "lava_5",
        address: "0x8565C5CfF0461094f1104bEE293688198b749503"
    },
    {
        name: "lava_6",
        address: "0x1661ebCB1A63cceA7D8acf2249d71297f168a37F"
    },
    {
        name: "lava_7",
        address: "0x3591E7Bf8a027E952B923152FE06883F3072367b"
    },
    {
        name: "lava_8",
        address: "0x916C32E5b5482f429425FF9A7219020a833B8048"
    },
    {
        name: "lava_9",
        address: "0xc5DB629aA89E78F534aC104C1f573f6188B63b58"
    },
    {
        name: "lava_10",
        address: "0xAcdF02Ce9dD7164eFbD19Bb620Dc2DD46199B26f"
    },
    {
        name: "lava_sell",
        address: "0x66a1439457719124d5812a077f8409098ba2ca95"
    },
    // INTERMEDIARY WALLETS
    {
        name: "int_jp_binance",
        address: "0x2a9626a6fc4665fe0351a319d225c2937fc5a55a"
    },
    {
        name: "int_binance_arb",
        address: "0xb38e8c17e38363af6ebdcb3dae12e0243582891d"
    },
    {
        name: "int_jp_bybit",
        address: "0xF534Fe3c6061D61458C3f6CA29B2d5Ba7855E95D"
    },
    {
        name: "int_cex_xfers",
        address: "0x026e2f80572b9e20D93E18E82EF34B824916b330"
    },
    {
        name: "int_gas",
        address: "0xDf12edaae8acb58E09bAb1ADa1aA9e9BcDf5b45a"
    },
    {
        name: "int_bybit_hot",
        address: "0xf89d7b9c864f589bbf53a82105107622b35eaa40"
    },
    {
        name: "int_binance_14",
        address: "0x28c6c06298d514db089934071355e5743bf21d60"
    },
    {
        name: "int_binance_15",
        address: "0x21a31ee1afc51d94c2efccaa2092ad1028285549"
    },
];
