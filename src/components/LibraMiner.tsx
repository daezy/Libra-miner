import React, { useCallback, useEffect, useState } from "react";
//import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
//import WalletContextProvider from "./WalletContextProvider";
import * as anchor from "@project-serum/anchor";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js";
import { AnchorWallet, useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import idl from "../idl.json";
import { ContractData, UserData } from "../interface";
import { INITIALIZER } from "../constants";

const Miner = () => {
  // const [disabled] = useState(true);
  // const [hasMined] = useState(false);
  const [provider, setProvider] = useState<anchor.Provider>();
  const [solBalance, setSolBalance] = useState<string>("0");
  const [contractData, setContractData] = useState<ContractData>();
  const [userData, setUserData] = useState<UserData>();
  const [depositAmount, setDepositAmount] = useState<number>(0);

  const [program, setProgram] = useState<anchor.Program>();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const initializer = new PublicKey(INITIALIZER);

  const confirmTxn = async (signature: string) => {
    const block = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      signature,
      ...block
    });
    return signature
  }

  const handleDeposit = async () => {
    if (program && wallet && contractData) {
      const [minerAccount, ] = PublicKey.findProgramAddressSync(
        [Buffer.from("miner"), wallet.publicKey.toBuffer()], 
        program.programId
      );
      const [mineAccount,] = PublicKey.findProgramAddressSync(
        [Buffer.from("mine"), initializer.toBuffer()], 
        program.programId
      );
      const accounts = {
        depositor: wallet.publicKey,
        minerAccount,
        mineAccount,
        vault: contractData.vault,
        feeCollector: contractData.feeCollector,
        systemProgram: SystemProgram.programId
      }
      await program.methods.deposit( 
        new anchor.BN(depositAmount * LAMPORTS_PER_SOL)
      )
        .accounts({ ...accounts })
        .rpc()
        .then(confirmTxn);
    } else {
      console.log("Program not initialized...")
    } 
  }

  const handleCompound = async () => {
    if (program && wallet && userData) {
      const [minerAccount, ] = PublicKey.findProgramAddressSync(
        [Buffer.from("miner"), wallet.publicKey.toBuffer()], 
        program.programId
      );
      const [mineAccount,] = PublicKey.findProgramAddressSync(
        [Buffer.from("mine"), initializer.toBuffer()], 
        program.programId
      );
      const compoundAccounts = {
        miner: wallet.publicKey,
        minerAccount,
        mineAccount
      }
      await program.methods.compound()
        .accounts({ ...compoundAccounts })
        .rpc()
        .then(confirmTxn);
    } else {
      console.log("No active user account found for program to compound...")
    }
  }

  const handleClaimReward = async () => {
    if (program && wallet && userData) {
      const [minerAccount, ] = PublicKey.findProgramAddressSync(
        [Buffer.from("miner"), wallet.publicKey.toBuffer()], 
        program.programId
      );
      const [mineAccount,] = PublicKey.findProgramAddressSync(
        [Buffer.from("mine"), initializer.toBuffer()], 
        program.programId
      );
      const claimAccounts = {
        miner: wallet.publicKey,
        minerAccount,
        mineAccount,
        vault: contractData?.vault,
        feeCollector: contractData?.feeCollector
      }
      await program.methods.claimRewards()
        .accounts({ ...claimAccounts })
        .rpc()
        .then(confirmTxn);
    } else {
      "No active user account found for program to claim..."
    }
  }
  

  const setUp = async (program: anchor.Program, wallet: AnchorWallet) => {
    const [mineAccount,] = PublicKey.findProgramAddressSync(
      [Buffer.from("mine"), initializer.toBuffer()], 
      program.programId
    ) ;
    const [minerAccount, ] = PublicKey.findProgramAddressSync(
      [Buffer.from("miner"), wallet.publicKey.toBuffer()], 
      program.programId
    );
    try {
      const contractData = await program?.account.mineInfo.fetch(mineAccount);
      setContractData(contractData as unknown as ContractData);
    } catch (err) {
      console.log('Error Fetching Contract Data', err)
    };
    try {
      const userData = await program?.account.minerInfo.fetch(minerAccount);
      if (userData) {
        setUserData({
          totalLocked: (userData.totalLocked as unknown as anchor.BN).toNumber()/LAMPORTS_PER_SOL,
          depositTs: (userData.depositTs as unknown as anchor.BN).toNumber()
        });
      }
    } catch (err) {
      console.log('Error Fetching User Data', err)
    };
    const solBalance = await provider?.connection.getBalance(wallet.publicKey);
    if (solBalance) {
      setSolBalance((solBalance/LAMPORTS_PER_SOL).toFixed(2));
    }
  }


  useEffect(() => {
    let providers: anchor.Provider;

    if (wallet) {
      try {
        providers = anchor.getProvider();
        setProvider(providers);
        const programId = new PublicKey(idl.metadata.address);
        const minerProgram = new anchor.Program(idl as anchor.Idl, programId);
        setProgram(minerProgram);
        setUp(minerProgram, wallet)
      } catch {
        providers = new anchor.AnchorProvider(connection, wallet, {});
        anchor.setProvider(providers);
        setProvider(providers);
      }
    }
  }, [wallet]);

  return (
    <>
      <div className="relative">
        <div className="flex md:justify-center justify-start items-center ">
          <img
            src={"./logo.png"}
            alt="logo"
            className="md:w-[150px] w-[100px]"
          />
          <h1 className="md:text-[32px] text-[20px] -ml-5 font-bold md:text-blue-500 text-white">
            Libra Miner
          </h1>
        </div>
        <div className="flex flex-col justify-center items-center relative">
          <div>
            <p className="text-[#d5d5d5] text-center -mt-5">
              Introducing Solana's First Rebase Token And <br />
              Interest Derivative.
            </p>
          </div>
          <div className="lg:w-[32%] md:w-[50%] w-[90%] my-8 ">
            <div className="bg-white p-3 w-full rounded-[10px]  shadow-lg pb-5">
              {/*<div className="px-2 py-2 flex justify-between ">*/}
              {/*  <p className="font-light text-[#5d5d5d]">Contract</p>*/}
              {/*  <p className="text-[#011556] font-bold">0.0 SOL</p>*/}
              {/*</div>*/}
              <div className="px-2 py-2 flex justify-between ">
                <p className="font-light text-[#5d5d5d]">Sol Balance</p>
                <p className="text-[#011556] font-bold">{solBalance} SOL</p>
              </div>
              <div className="px-2 py-2 flex justify-between ">
                <p className="font-light text-[#5d5d5d]">Total Locked</p>
                <p className="text-[#011556] font-bold">{userData? userData.totalLocked.toFixed(2) : 0} SOL</p>
              </div>
                <div className="border-b pb-3 border-[#c5c5c5]">
                  <div className="px-2 py-2 mt-2  border ">
                    <input
                      type="number"
                      placeholder="0.0 SOL"
                      className="outline-none placeholder-[#011556] placeholder-custom w-full placeholder-text-right"
                      onChange={(e)=>setDepositAmount(parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <button
                      className={
                        depositAmount <= 0
                          ? `w-full p-2 mt-3 bg-[#c5c5c5] rounded-md cursor-pointer text-[#5d5d5d]`
                          : `w-full p-2 mt-3 bg-[#011556] rounded-md cursor-pointer text-white`
                      }
                      disabled={depositAmount <= 0}
                      onClick={handleDeposit}
                    >
                      <p>DEPOSIT SOL</p>
                    </button>
                  </div>
                </div>
              <div className="mt-2">
                <div className="px-2 py-2 flex justify-between">
                  <p className="font-semibold text-[#011556]">Your Rewards</p>
                  <p className="text-[#011556] font-bold">0.0 SOL</p>
                </div>
                <div className="flex justify-between gap-3">
                  <button
                    className={
                      !userData
                        ? `w-[45%] p-2 mt-3 bg-[#c5c5c5] rounded-md cursor-pointer text-[#5d5d5d]`
                        : `w-full p-2 mt-3 bg-[#011556] rounded-md cursor-pointer text-white`
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
                        : `w-full p-2 mt-3 bg-[#011556] rounded-md cursor-pointer text-white`
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
