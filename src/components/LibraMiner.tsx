import React, { useCallback, useEffect, useState } from "react";
//import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
//import WalletContextProvider from "./WalletContextProvider";
import * as anchor from "@project-serum/anchor";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js";
import {
  AnchorWallet,
  useAnchorWallet,
  useConnection,
} from "@solana/wallet-adapter-react";
import idl from "../idl.json";
import { ContractData, UserData } from "../interface";
import { INITIALIZER } from "../constants";
import ErrorPopup from "./ErrorPopup";
import SuccessPopup from "./SuccessPopup";
import { BiDiamond } from "react-icons/bi";

const Miner = () => {
  const [provider, setProvider] = useState<anchor.Provider>();
  const [solBalance, setSolBalance] = useState<string>("0");
  const [contractData, setContractData] = useState<ContractData>();
  const [userData, setUserData] = useState<UserData>();
  const [currentReward, setCurrentReward] = useState<string>("0.0000");
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const [program, setProgram] = useState<anchor.Program>();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const initializer = new PublicKey(INITIALIZER);

  const alertError = (message: string) => {
    setError(message);
    setTimeout(() => {
      setError("");
    }, 3000);
  };
  const alertSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => {
      setSuccess("");
    }, 3000);
  };

  const confirmTxn = async (signature: string) => {
    const block = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      signature,
      ...block,
    });
    return signature;
  };

  const handleDeposit = async () => {
    if (program && wallet && contractData) {
      const [minerAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("miner"), wallet.publicKey.toBuffer()],
        program.programId
      );
      const [mineAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("mine"), initializer.toBuffer()],
        program.programId
      );
      const accounts = {
        depositor: wallet.publicKey,
        minerAccount,
        mineAccount,
        vault: contractData.vault,
        feeCollector: contractData.feeCollector,
        systemProgram: SystemProgram.programId,
      };
      await program.methods
        .deposit(new anchor.BN(depositAmount * LAMPORTS_PER_SOL))
        .accounts({ ...accounts })
        .rpc()
        .then(confirmTxn);
    } else {
      alertError("Program not initialized...");
    }
  };

  const handleCompound = async () => {
    if (program && wallet && userData) {
      const [minerAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("miner"), wallet.publicKey.toBuffer()],
        program.programId
      );
      const [mineAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("mine"), initializer.toBuffer()],
        program.programId
      );
      const compoundAccounts = {
        miner: wallet.publicKey,
        minerAccount,
        mineAccount,
      };
      await program.methods
        .compound()
        .accounts({ ...compoundAccounts })
        .rpc()
        .then(confirmTxn);
    } else {
      alertError("No active user account found for program to compound...");
    }
  };

  const handleClaimReward = async () => {
    if (program && wallet && userData) {
      const [minerAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("miner"), wallet.publicKey.toBuffer()],
        program.programId
      );
      const [mineAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("mine"), initializer.toBuffer()],
        program.programId
      );
      const claimAccounts = {
        miner: wallet.publicKey,
        minerAccount,
        mineAccount,
        vault: contractData?.vault,
        feeCollector: contractData?.feeCollector,
      };
      await program.methods
        .claimRewards()
        .accounts({ ...claimAccounts })
        .rpc()
        .then(confirmTxn);
      alertSuccess("Successfully claimed");
    } else {
      alertError("No active user account found for program to claim...");
    }
  };

  const calculateRewards = async () => {
    if (userData && contractData) {
      const apy = (contractData.apy as unknown as anchor.BN).toNumber();
      const devFee = (contractData.devFee as unknown as anchor.BN).toNumber();
      const interval = Date.now() / 1000 - userData.depositTs;
      const totalReward =
        (userData.totalLocked * apy * interval) / (10000 * 31536000);
      const expectedReward = ((10000 - devFee) * totalReward) / 10000;
      setCurrentReward(expectedReward.toFixed(4));
    }
  };

  const setUp = async (program: anchor.Program, wallet: AnchorWallet) => {
    const [mineAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("mine"), initializer.toBuffer()],
      program.programId
    );
    const [minerAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("miner"), wallet.publicKey.toBuffer()],
      program.programId
    );
    try {
      const contractData = await program?.account.mineInfo.fetch(mineAccount);
      setContractData(contractData as unknown as ContractData);
      alertSuccess("fetched contract data");
    } catch (err) {
      alertError("Error Fetching Contract Data");
    }
    try {
      const userData = await program?.account.minerInfo.fetch(minerAccount);
      if (userData) {
        setUserData({
          totalLocked:
            (userData.totalLocked as unknown as anchor.BN).toNumber() /
            LAMPORTS_PER_SOL,
          depositTs: (userData.depositTs as unknown as anchor.BN).toNumber(),
        });
      }
    } catch (err) {
      alertError("Error Fetching User Data");
    }
    const solBalance = await provider?.connection.getBalance(wallet.publicKey);
    if (solBalance) {
      setSolBalance((solBalance / LAMPORTS_PER_SOL).toFixed(2));
    }
    await calculateRewards();
  };

  useEffect(() => {
    let providers: anchor.Provider;

    if (wallet) {
      try {
        providers = anchor.getProvider();
        setProvider(providers);
        const programId = new PublicKey(idl.metadata.address);
        const minerProgram = new anchor.Program(idl as anchor.Idl, programId);
        setProgram(minerProgram);
        setUp(minerProgram, wallet);
      } catch {
        providers = new anchor.AnchorProvider(connection, wallet, {});
        anchor.setProvider(providers);
        setProvider(providers);
      }
    }
  }, [wallet]);

  return (
    <>
      {error && <ErrorPopup message={error} />}
      {success && <SuccessPopup message={success} />}
      <div className="relative">
        <div className="flex flex-col justify-center items-center relative">
          <div className="md:w-[47%] w-[90%] my-8 ">
            <div className="bg-white px-4 py-8 w-full rounded-2xl  shadow-lg pb-5">
              {/*<div className="px-2 py-2 flex justify-between ">*/}
              {/*  <p className="font-light text-[#5d5d5d]">Contract</p>*/}
              {/*  <p className="text-[#0D47A1] font-bold">0.0 SOL</p>*/}
              {/*</div>*/}

              <div className="flex justify-between items-center mb-4">
                <div className="">
                  <p className=" text-[#0D47A1] text-lg mb-1">Staked</p>
                  <p className="text-slate-800 text-xl">
                    {userData ? userData.totalLocked.toFixed(2) : 0} SOL
                  </p>
                </div>
                <div className="">
                  <p className=" text-[#0D47A1] text-lg mb-1">Available</p>
                  <p className="text-slate-800 text-xl">{solBalance} SOL</p>
                </div>
              </div>

              <div className="flex items-center my-3 gap-3">
                <p className="text-lg">Projected Yield</p>
                <p className="text-[#0D47A1] p-1 bg-blue-200 rounded-xl text-sm">
                  APY 2500%
                </p>
              </div>

              <div className="pb-3">
                <div className="px-2 py-2 mt-2  border ">
                  <input
                    type="number"
                    placeholder="0.0 SOL"
                    className="outline-none placeholder-[#0D47A1] placeholder-custom w-full placeholder-text-right"
                    onChange={(e) =>
                      setDepositAmount(parseFloat(e.target.value))
                    }
                  />
                </div>
                <div>
                  <button
                    className={
                      depositAmount <= 0
                        ? `w-full p-2 mt-3 bg-[#c5c5c5] rounded-md cursor-pointer text-[#5d5d5d]`
                        : `w-full p-2 mt-3 bg-[#0D47A1] rounded-md cursor-pointer text-white`
                    }
                    disabled={depositAmount <= 0}
                    onClick={handleDeposit}
                  >
                    <p>DEPOSIT SOL</p>
                  </button>
                </div>
              </div>

              <p className="flex items-center gap-2 justify-center my-2">
                <BiDiamond className="text-[#0D47A1] text-lg" /> Stake SOL and
                earn rewards
              </p>
            </div>

            <div className="bg-white px-4 py-8 w-full rounded-2xl  shadow-lg pb-5 mt-4">
              <div className="">
                <div className="px-2 py-2 flex justify-between">
                  <p className="text-[#0D47A1] text-lg mb-1">Your Rewards</p>
                  <p className="text-slate-800 text-xl">{currentReward} SOL</p>
                </div>
                <div className="flex justify-between gap-3">
                  <button
                    className={
                      !userData
                        ? `w-[45%] p-2 mt-3 bg-[#c5c5c5] rounded-md cursor-pointer text-[#5d5d5d]`
                        : `w-full p-2 mt-3 bg-[#0D47A1] rounded-md cursor-pointer text-white`
                    }
                    disabled={!userData}
                    onClick={handleCompound}
                  >
                    <p>COMPOUND</p>
                  </button>
                  <button
                    className={
                      !userData
                        ? `w-[45%] p-2 mt-3 bg-[#c5c5c5] rounded-md cursor-pointer text-[#5d5d5d]`
                        : `w-full p-2 mt-3 bg-[#0D47A1] rounded-md cursor-pointer text-white`
                    }
                    disabled={!userData}
                    onClick={handleClaimReward}
                  >
                    <p>CLAIM REWARD</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="absolute md:top-[54px] top-[15px] md:right-4 right-2 md:mt-0 mt-5">
          {/* <button className="">
            <p className="text-white md:text-[15px] text-[10px]">CONNECT</p>
          </button> */}
        {/* </div> */}
      </div>
    </>
  );
};

export default Miner;
