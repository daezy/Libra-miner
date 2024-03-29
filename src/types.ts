export type SolMiner = {
    "version": "0.1.0",
    "name": "sol_miner",
    "instructions": [
      {
        "name": "initialize",
        "accounts": [
          {
            "name": "initializer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "mineAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mineVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "feeCollector",
            "type": "publicKey"
          },
          {
            "name": "apy",
            "type": "u64"
          },
          {
            "name": "devFee",
            "type": "u64"
          },
          {
            "name": "claimInterval",
            "type": "u64"
          },
          {
            "name": "earlyClaimPenalty",
            "type": "u64"
          }
        ]
      },
      {
        "name": "deposit",
        "accounts": [
          {
            "name": "depositor",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "minerAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mineAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "feeCollector",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "compound",
        "accounts": [
          {
            "name": "miner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "minerAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mineAccount",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "claimRewards",
        "accounts": [
          {
            "name": "miner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "minerAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mineAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "feeCollector",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "withdraw",
        "accounts": [
          {
            "name": "miner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "minerAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mineAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "feeCollector",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "deactivate",
        "accounts": [
          {
            "name": "initializer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "mineAccount",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": []
      }
    ],
    "accounts": [
      {
        "name": "mineInfo",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "initializer",
              "type": "publicKey"
            },
            {
              "name": "feeCollector",
              "type": "publicKey"
            },
            {
              "name": "vault",
              "type": "publicKey"
            },
            {
              "name": "totalLocked",
              "type": "u64"
            },
            {
              "name": "apy",
              "type": "u64"
            },
            {
              "name": "devFee",
              "type": "u64"
            },
            {
              "name": "claimInterval",
              "type": "u64"
            },
            {
              "name": "earlyClaimPenalty",
              "type": "u64"
            },
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "isActive",
              "type": "bool"
            }
          ]
        }
      },
      {
        "name": "mineVault",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            }
          ]
        }
      },
      {
        "name": "minerInfo",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "owner",
              "type": "publicKey"
            },
            {
              "name": "totalLocked",
              "type": "u64"
            },
            {
              "name": "depositTs",
              "type": "u64"
            }
          ]
        }
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "InvalidDepositAmount",
        "msg": "Invalid Deposit Amount"
      }
    ]
  };
  
  export const IDL: SolMiner = {
    "version": "0.1.0",
    "name": "sol_miner",
    "instructions": [
      {
        "name": "initialize",
        "accounts": [
          {
            "name": "initializer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "mineAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mineVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "feeCollector",
            "type": "publicKey"
          },
          {
            "name": "apy",
            "type": "u64"
          },
          {
            "name": "devFee",
            "type": "u64"
          },
          {
            "name": "claimInterval",
            "type": "u64"
          },
          {
            "name": "earlyClaimPenalty",
            "type": "u64"
          }
        ]
      },
      {
        "name": "deposit",
        "accounts": [
          {
            "name": "depositor",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "minerAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mineAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "feeCollector",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "compound",
        "accounts": [
          {
            "name": "miner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "minerAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mineAccount",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "claimRewards",
        "accounts": [
          {
            "name": "miner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "minerAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mineAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "feeCollector",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "withdraw",
        "accounts": [
          {
            "name": "miner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "minerAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mineAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "feeCollector",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "deactivate",
        "accounts": [
          {
            "name": "initializer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "mineAccount",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": []
      }
    ],
    "accounts": [
      {
        "name": "mineInfo",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "initializer",
              "type": "publicKey"
            },
            {
              "name": "feeCollector",
              "type": "publicKey"
            },
            {
              "name": "vault",
              "type": "publicKey"
            },
            {
              "name": "totalLocked",
              "type": "u64"
            },
            {
              "name": "apy",
              "type": "u64"
            },
            {
              "name": "devFee",
              "type": "u64"
            },
            {
              "name": "claimInterval",
              "type": "u64"
            },
            {
              "name": "earlyClaimPenalty",
              "type": "u64"
            },
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "isActive",
              "type": "bool"
            }
          ]
        }
      },
      {
        "name": "mineVault",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            }
          ]
        }
      },
      {
        "name": "minerInfo",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "owner",
              "type": "publicKey"
            },
            {
              "name": "totalLocked",
              "type": "u64"
            },
            {
              "name": "depositTs",
              "type": "u64"
            }
          ]
        }
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "InvalidDepositAmount",
        "msg": "Invalid Deposit Amount"
      }
    ]
  };