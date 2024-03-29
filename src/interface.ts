import { PublicKey } from "@solana/web3.js";

export interface ContractData {
    initializer: PublicKey,
    feeCollector: PublicKey,
    vault: PublicKey,
    totalLocked: number,
    apy: number,
    devFee: number,
    claimInterval: number,
    earlyClaimPenalty: number
}

export interface UserData {
    address: PublicKey,
    totalLocked: number,
    depositTs: number
}