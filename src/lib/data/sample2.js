i have an array called SavedTables in this format:

[
    {
        "id": 1,
        "selectedWallets": [
            {
                "name": "membership (deposit)",
                "address": "0xab5573f28e6dd9ec34966b06e4c736481f393fc7"
            },
            {
                "name": "initial-trust-raise (deposit)",
                "address": "0x8c78290373623175dfa7a4736bd3a340b670bce9"
            }
        ],
        "move": "",
        "tableTitle": "Aggregated Allocation Table for: Membership, Initial-trust-raise (2 wallets)",
        "isAggregated": true,
        "generatedOnDate": "November 20, 2023 @ 5:35 p.m. MST",
        "tableData": [
            {
                "txns": 4,
                "netAmount": 10010.994967,
                "contributions": 4,
                "contributionsAmount": 10010.994967,
                "contributionsChainMap": {
                    "arb": 2,
                    "bsc": 2
                },
                "refunds": 0,
                "refundsAmount": 0,
                "refundsChainMap": {},
                "walletTxns": {
                    "membership": {
                        "count": 3,
                        "totalAmount": 9360.994967
                    },
                    "initial-trust-raise": {
                        "count": 1,
                        "totalAmount": 650
                    }
                },
                "memberWallet": "0x969893b7df72d747e395431efff1ab7a31194091",
                "share": 0.19925731640171007,
                "adjustedNetAmount": 8966.579238076953
            },
            {
                "txns": 9,
                "netAmount": 3921.931104794194,
                "contributions": 9,
                "contributionsAmount": 3921.931104794194,
                "contributionsChainMap": {
                    "arb": 6,
                    "bsc": 3
                },
                "refunds": 0,
                "refundsAmount": 0,
                "refundsChainMap": {},
                "walletTxns": {
                    "membership": {
                        "count": 9,
                        "totalAmount": 3921.931104794194
                    }
                },
                "memberWallet": "0xa9854d7dbaef0a91c8ff6b26f01b46d25c518a79",
                "memberName": "alex",
                "share": 0.07806151832357475,
                "adjustedNetAmount": 3512.7683245608637
            }, 
            {
              "contributions": 1,
                "contributionsAmount": 2152.503296356193,
                "contributionsChainMap": {
                    "bsc": 1
                },
                "refunds": 0,
                "refundsAmount": 0,
                "refundsChainMap": {},
                "walletTxns": {
                    "membership": {
                        "count": 1,
                        "totalAmount": 2152.503296356193
                    }
                },
                "memberWallet": "0xeef930e4dc7b379d824b63d28af6b633f870da0e",
                "memberName": "jabpsych",
                "share": 0.04284309719379462,
                "adjustedNetAmount": 1927.939373720758
            },
            // more...
        ],
        "totals": {
            "totalTxns": 163,
            "totalContributionsAmount": 55000.194047519166,
            "totalRefundsAmount": 4758.651364,
            "totalNetAmount": 50241.54268351917,
            "aggregatedContributionsChainMap": {
                "arb": 97,
                "bsc": 53
            },
            "aggregatedRefundsChainMap": {
                "arb": 7,
                "bsc": 6
            },
            "aggregatedTxns": {
                "membership": {
                    "count": 123,
                    "totalAmount": 41072.06401431624
                },
                "initial-trust-raise": {
                    "count": 40,
                    "totalAmount": 9169.478669202921
                }
            },
            "totalShare": 0.9999999999999996
        },
        "numContributors": 51,
        "state": {
            "adjustedNetTotal": 45000,
            "showMemberName": false,
            "showHeaderRow": false,
            "sortBy": "Amount",
            "transferTotal": 0
        }
    },
    {
        "id": 2,
        "selectedWallets": [
            {
                "name": "vela-hyper-vlp (invest)",
                "address": "0xf12c5aa8b0c0be4365663c08671fc4e8a995670b"
            }
        ],
        "move": "",
        "tableTitle": "Allocation Table for: 'Vela-hyper-vlp' Wallet",
        "isAggregated": false,
        "generatedOnDate": "November 20, 2023 @ 5:35 p.m. MST",
        "tableData": [
            {
                "txns": 3,
                "netAmount": 43013.7222,
                "contributions": 3,
                "contributionsAmount": 43013.7222,
                "contributionsChainMap": {
                    "arb": 3
                },
                "refunds": 0,
                "refundsAmount": 0,
                "refundsChainMap": {},
                "walletTxns": {
                    "vela-hyper-vlp": {
                        "count": 3,
                        "totalAmount": 43013.7222
                    }
                },
                "memberWallet": "0x692b5a7ecccad243a07535e8c24b0e7433238c6a",
                "share": 695.9425236118516,
                "adjustedNetAmount": 43013.7222
            },
            {
                "txns": 3,
                "netAmount": 12617.608631,
                "contributions": 2,
                "contributionsAmount": 17617.608631,
                "contributionsChainMap": {
                    "arb": 2
                },
                "refunds": 1,
                "refundsAmount": 5000,
                "refundsChainMap": {
                    "arb": 1
                },
                "walletTxns": {
                    "vela-hyper-vlp": {
                        "count": 3,
                        "totalAmount": 12617.608631
                    }
                },
                "memberWallet": "0xa9854d7dbaef0a91c8ff6b26f01b46d25c518a79",
                "memberName": "alex",
                "share": 204.1471870714974,
                "adjustedNetAmount": 12617.608631
            },
            {
                "txns": 4,
                "netAmount": 7317.734528,
                "contributions": 3,
                "contributionsAmount": 7417.734528,
                "contributionsChainMap": {
                    "arb": 3
                },
                "refunds": 1,
                "refundsAmount": 100,
                "refundsChainMap": {
                    "arb": 1
                },
                "walletTxns": {
                    "vela-hyper-vlp": {
                        "count": 4,
                        "totalAmount": 7317.734528
                    }
                },
                "memberWallet": "0x84652bb2539513baf36e225c930fdd8eaa63ce27",
                "share": 118.3976269446847,
                "adjustedNetAmount": 7317.734528
            },
            // more...
        ],
        "totals": {
            "totalTxns": 53,
            "totalContributionsAmount": 92648.53350203778,
            "totalRefundsAmount": 92586.72707299999,
            "totalNetAmount": 61.80642903779517,
            "aggregatedContributionsChainMap": {
                "arb": 26,
                "bsc": 19
            },
            "aggregatedRefundsChainMap": {
                "arb": 7,
                "bsc": 1
            },
            "aggregatedTxns": {
                "vela-hyper-vlp": {
                    "count": 53,
                    "totalAmount": 61.80642903779511
                }
            },
            "totalShare": 1.000000000000341
        },
        "numContributors": 27,
        "state": {
            "adjustedNetTotal": 61.80642903779517,
            "showMemberName": false,
            "showHeaderRow": false,
            "sortBy": "Amount",
            "transferTotal": 0
        }
    }
]

I also have an array called sortedAllocationTableData, which is in this format:

[
    {
        "txns": 23,
        "netAmount": 26607,
        "contributions": 23,
        "contributionsAmount": 26607,
        "contributionsChainMap": {
            "arb": 23
        },
        "refunds": 0,
        "refundsAmount": 0,
        "refundsChainMap": {},
        "walletTxns": {
            "investments": {
                "count": 23,
                "totalAmount": 26607
            }
        },
        "memberWallet": "0x02ac25b565c053bc1e7aa2a1499622512af375f1",
        "memberName": "SR",
        "share": 0.15845461545834386,
        "adjustedNetAmount": 26607
    },
    {
        "txns": 20,
        "netAmount": 22052.26,
        "contributions": 20,
        "contributionsAmount": 22052.26,
        "contributionsChainMap": {
            "arb": 20
        },
        "refunds": 0,
        "refundsAmount": 0,
        "refundsChainMap": {},
        "walletTxns": {
            "investments": {
                "count": 20,
                "totalAmount": 22052.26
            }
        },
        "memberWallet": "0x777328aec05b84ac86aafc32fc61b576aa97035a",
        "memberName": "MoneyMagnet",
        "share": 0.1313294388051046,
        "adjustedNetAmount": 22052.26
    },
    {
        "txns": 19,
        "netAmount": 11447.291743,
        "contributions": 19,
        "contributionsAmount": 11447.291743,
        "contributionsChainMap": {
            "arb": 19
        },
        "refunds": 0,
        "refundsAmount": 0,
        "refundsChainMap": {},
        "walletTxns": {
            "investments": {
                "count": 19,
                "totalAmount": 11447.291743
            }
        },
        "memberWallet": "0xdaee7f914e6169a831ad7306e5097e793912acef",
        "memberName": "VJ",
        "share": 0.06817289477117074,
        "adjustedNetAmount": 11447.291743
    },
// more
]

What I need is to generate an array of objects which will become a list of all the unique member wallets, aggregated from:

(1) each saved table's "tableData"
(2) the sortedAllocationTableData.  

I need the new data structure to be in this format: 

{
    "0x02ac25b565c053bc1e7aa2a1499622512af375f1": 
    {
        totalAdjustedNetAmount: 26607,
        totalNetAmount: 26607,
    }
    {
      baseWallet: {
        "share": 0.19925731640171007,
        "adjustedNetAmount": 8966.579238076953,
        "netAmount": 10010.994967,
      },
      savedTable1: { 
        "share": 0.19925731640171007,
        "adjustedNetAmount": 8966.579238076953,
        "netAmount": 10010.994967,
      },
        savedTable2: {
            "share": 0.15845461545834386,
            "adjustedNetAmount": 26607,
            "netAmount": 26607,
        },
        ... so on for each saved table
    },
    "0xdaee7f914e6169a831ad7306e5097e793912acef": 
    {
      baseWallet: {
        "share": 0.19925731640171007,
        "adjustedNetAmount": 8966.579238076953,
        "netAmount": 10010.994967,
      },
      savedTable1: { 
        "share": 0.19925731640171007,
        "adjustedNetAmount": 8966.579238076953,
        "netAmount": 10010.994967,
      },
        savedTable2: {
            "share": 0.15845461545834386,
            "adjustedNetAmount": 26607,
            "netAmount": 26607,
        },
        ... so on for each saved table
    }

    If the member wallet is not in a saved table, then the saved table object will be null.  If the member wallet is not in the sortedAllocationTableData, then the baseWallet object will be null.
