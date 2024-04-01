import React, { useEffect, useState } from "react";
//import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
//import WalletContextProvider from "./WalletContextProvider";
import * as anchor from "@project-serum/anchor";
import { ComputeBudgetProgram, LAMPORTS_PER_SOL, PublicKey, SystemProgram, sendAndConfirmRawTransaction, sendAndConfirmTransaction } from "@solana/web3.js";
import {
  AnchorWallet,
  useAnchorWallet,
  useConnection,
} from "@solana/wallet-adapter-react";
import idl from "../idl.json";
import { encode } from 'bs58';
import { ContractData, UserData } from "../interface";
import { INITIALIZER } from "../constants";
import ErrorPopup from "./ErrorPopup";
import SuccessPopup from "./SuccessPopup";
import { BiDiamond } from "react-icons/bi";
import Loader from "./Loader";
import HowItWorks from "./HowItWorks";
import { Link, useLocation } from "react-router-dom";
import Referral from "./Referral";
import { Timer } from "./Timer";

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
  const [loading, setLoading] = useState<boolean>(false);
  const [refAddress, setRefAddress] = useState<string>("");
  const [priority, setPriority] = useState<"none" | "high" | "low" | "medium" | "veryHigh">("medium");
  const location = useLocation();
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
  const handleLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 30000);
  };

  const handleReferralAddress = (address: string) => {
    setRefAddress(address);
  };
  const getTimerDate = (): string => {
    const date = userData
      ? getUnlockDate(parseInt("7"))
      : new Date().toUTCString();

    return date;
  };
  const getUnlockDate = (days: number): string => {
    const dayOfStake = userData
      ? parseInt(userData?.depositTs.toString()) * 1000
      : 0;
    const dateOfStamp = new Date(dayOfStake);
    const result = dateOfStamp.setDate(dateOfStamp.getDate() + days);
    const newDate = new Date(result);
    const result2 = newDate.setTime(newDate.getTime() + 1 * 60 * 60 * 1000);
    const newDate2 = new Date(result2);
    return newDate2.toUTCString();
  };

  const handleMax = () => {
    if (parseInt(solBalance) > 0.005) {
      setDepositAmount(parseInt(solBalance) - 0.005);
    } else {
      setDepositAmount(0);
    }
  };

  async function getPriorityFeeEstimate(transaction: anchor.web3.Transaction) {
    const response = await fetch(connection.rpcEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "1",
        method: "getPriorityFeeEstimate",
        params: [
          {
            transaction: encode(transaction.serialize()),
            options: { includeAllPriorityFeeLevels: true },
          },
        ],
      }),
    });
    const data = await response.json();
    return data.result;
  }

  const confirmTxn = async (signature: string) => {
    const block = await connection.getLatestBlockhash();
    const confirmation = await connection.confirmTransaction({
      signature,
      ...block,
    });
    return confirmation.value
  };

  // const handleDeposit = async () => {
  //   if (depositAmount <= 0 || !depositAmount) {
  //     alertError("Enter valid amount");
  //     return;
  //   }
  //   if (program && wallet && contractData) {
  //     setLoading(true);
  //     const [minerAccount] = PublicKey.findProgramAddressSync(
  //       [Buffer.from("miner"), wallet.publicKey.toBuffer()],
  //       program.programId
  //     );
  //     const [mineAccount] = PublicKey.findProgramAddressSync(
  //       [Buffer.from("mine"), initializer.toBuffer()],
  //       program.programId
  //     );
  //     const referrer = refAddress ? new PublicKey(refAddress) : null;
  //     const accounts = {
  //       depositor: wallet.publicKey,
  //       minerAccount,
  //       mineAccount,
  //       referrer: referrer,
  //       vault: contractData.vault,
  //       feeCollector: contractData.feeCollector,
  //       systemProgram: SystemProgram.programId,
  //     };
  //     try {
  //       await program.methods
  //       .deposit(new anchor.BN(depositAmount * LAMPORTS_PER_SOL))
  //       .accounts({ ...accounts })
  //       .rpc()
  //       .then(confirmTxn);
  //       alertSuccess("Deposit Successfull ✅🚀");
  //     } catch (e) {
  //       console.log(e);
  //       alertError("Deposit Failed ❌❌")
  //     }
  //   } else {
  //     alertError("Program not initialized...");
  //   }
  //   setLoading(false);
  // };

  const getDepositPriorityRate = async (
    depositIx: anchor.web3.TransactionInstruction, 
    wallet: AnchorWallet, priorityLevel: string
  ) => {
    if (priorityLevel == "none") {
      return 100000 // defaults to 0.1 lamports
    }
    const txn = new anchor.web3.Transaction();
    txn.add(depositIx);
    const blockHash = await connection.getLatestBlockhash();
    txn.recentBlockhash = blockHash.blockhash;
    txn.feePayer = wallet.publicKey;
    const signedTx = await wallet.signTransaction(txn);
    const fees = await getPriorityFeeEstimate(signedTx);
    return fees.priorityFeeLevels[priorityLevel];
  }

  const handleDepositWithPriorityFees = async () => {
    if (depositAmount <= 0 || !depositAmount) {
      alertError("Enter valid amount");
      return;
    }
    if (program && wallet && contractData) {
      setLoading(true);
      const [minerAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("miner"), wallet.publicKey.toBuffer()],
        program.programId
      );
      const [mineAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("mine"), initializer.toBuffer()],
        program.programId
      );
      const referrer = refAddress ? new PublicKey(refAddress) : null;
      const accounts = {
        depositor: wallet.publicKey,
        minerAccount,
        mineAccount,
        referrer: referrer,
        vault: contractData.vault,
        feeCollector: contractData.feeCollector,
        systemProgram: SystemProgram.programId,
      };
      const depositIx = await program.methods
        .deposit(new anchor.BN(depositAmount * LAMPORTS_PER_SOL))
        .accounts({ ...accounts }).instruction();
      try {
        const priorityRate = await getDepositPriorityRate(depositIx, wallet, priority);
        const computeUnitLimitIx = ComputeBudgetProgram.setComputeUnitLimit({
          units: 200000
        })
        const computePriceIx = ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: priorityRate
        });
        const txn = new anchor.web3.Transaction();
        txn.add(computePriceIx);
        txn.add(computeUnitLimitIx);
        txn.add(depositIx);
        const blockHash = await connection.getLatestBlockhash();
        txn.recentBlockhash = blockHash.blockhash;
        txn.feePayer = wallet.publicKey;
        const signedTx = await wallet.signTransaction(txn);
        const signature = await connection.sendRawTransaction(signedTx.serialize());
        const confirmation = await confirmTxn(signature);
        if (!confirmation.err) {
          alertSuccess("Deposit successful ✅");
          await setUp(program, wallet);
        } else {
          alertError("Deposit Failed ❌")
        }
      } catch (e) {
        console.log(e);
        alertError("Error Confirming Transaction!!. Please reload page after 5 seconds before retry.")
      }
    } else {
      alertError("Program not initialized...");
    };
    setLoading(false);
  };

  const handleCompound = async () => {
    if (program && wallet && userData) {
      handleLoading();
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
      alertSuccess("Compound successful");
      setLoading(false);
    } else {
      alertError("No active user account found for program to compound...");
      setLoading(false);
    }
  };

  const handleClaimReward = async () => {
    if (program && wallet && userData) {
      handleLoading();
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
      setLoading(false);
      alertSuccess("Successfully claimed");
    } else {
      alertError("No active user account found for program to claim...");
      setLoading(false);
    }
  };

  const handleWithdrawal = async () => {
    handleLoading();

    if (userData) {
      const dayOfStake = userData?.depositTs * 1000;
      // console.log(dayOfStake);
      if (dayOfStake != null || dayOfStake != undefined) {
        const dateOfStamp = new Date(dayOfStake);
        // console.log(dateOfStamp.toDateString());
        const newDate = new Date();
        console.log(dateOfStamp);

        const timeDiff = newDate.getTime() - dateOfStamp.getTime();
        const dayDiff = timeDiff / (1000 * 3600 * 24);
        // console.log(Math.floor(dayDiff));

        const cooldown = 7;
        console.log(cooldown);
        console.log(dayDiff);
        if (Math.floor(dayDiff) < cooldown) {
          alertError(
            `${cooldown - Math.floor(dayDiff)} days left to withdrawal`
          );

          setLoading(false);
          return;
        }
      }
    }

    if (program && wallet && contractData && userData) {
      const [minerAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("miner"), wallet.publicKey.toBuffer()],
        program.programId
      );
      const [mineAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("mine"), initializer.toBuffer()],
        program.programId
      );
      const withdrawAccounts = {
        miner: wallet.publicKey,
        minerAccount,
        mineAccount,
        vault: contractData.vault,
        feeCollector: contractData.feeCollector,
        systemProgram: SystemProgram.programId,
      };
      try {
        await program.methods
          .withdraw()
          .accounts({ ...withdrawAccounts })
          .rpc()
          .then(confirmTxn);
      } catch (e) {
        console.log(e);
        alertError("An Error Occured ❌❌❌");
      }
    } else {
      alertError(
        "No active user account found for program to withdraw from..."
      );
    }
    setLoading(false);
  };

  const calculateRewards = async () => {
    if (userData && contractData) {
      const apy = (contractData.apy as unknown as anchor.BN).toNumber();
      const devFee = (contractData.devFee as unknown as anchor.BN).toNumber();
      const interval = Date.now() / 1000 - userData.depositTs;
      const totalReward =
        (userData.totalLocked * apy * interval) / (10000 * 31536000);
      const expectedReward = ((10000 - devFee) * totalReward) / 10000;
      setCurrentReward(expectedReward.toFixed(7));
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
          address: minerAccount,
          totalLocked:
            (userData.totalLocked as unknown as anchor.BN).toNumber() /
            LAMPORTS_PER_SOL,
          depositTs: (userData.depositTs as unknown as anchor.BN).toNumber(),
        });
      }
    } catch (err) {
      alertError("Error Fetching User Data");
    }
    await calculateRewards();
  };

  useEffect(() => {
    const init = async () => {
      let providers: anchor.Provider;

      if (wallet) {
        try {
          providers = await anchor.getProvider();
          await setProvider(providers);
          const programId = new PublicKey(idl.metadata.address);
          const minerProgram = new anchor.Program(idl as anchor.Idl, programId);
          await setProgram(minerProgram);
          await setUp(minerProgram, wallet);
        } catch {
          providers = new anchor.AnchorProvider(connection, wallet, {});
          await anchor.setProvider(providers);
          await setProvider(providers);
          const programId = new PublicKey(idl.metadata.address);
          const minerProgram = new anchor.Program(idl as anchor.Idl, programId);
          await setProgram(minerProgram);
          await setUp(minerProgram, wallet);
        }

        const solBalance = await connection.getBalance(wallet.publicKey);
        if (solBalance) {
          await setSolBalance((solBalance / LAMPORTS_PER_SOL).toFixed(2));
        }
      }
    };

    init();
  }, [wallet]);

  useEffect(() => {
    if (location.search) {
      setRefAddress(String(new URLSearchParams(location.search).get("ref")));
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => calculateRewards(), 2000);

    return () => clearInterval(interval);
  });

  return (
    <>
      {error && <ErrorPopup message={error} />}
      {success && <SuccessPopup message={success} />}
      {loading && <Loader />}

      <div className="relative">
        <div className="flex flex-col justify-center items-center relative">
          <div className="md:w-[47%] container my-8 ">
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white px-4 py-8 w-full rounded-md  shadow pb-5">
                <div className="flex justify-between items-center mb-4">
                  <div className="">
                    <p className=" text-[#0D47A1] text-lg mb-1">Deposited</p>
                    <p className="text-slate-800 text-xl">
                      {userData ? (userData.totalLocked / 0.96).toFixed(4) : 0}{" "}
                      SOL
                    </p>
                  </div>
                  <div className="">
                    <p className=" text-[#0D47A1] text-lg mb-1">SOL Balance</p>
                    <p className="text-slate-800 text-xl">{solBalance} SOL</p>
                  </div>
                </div>

                <div className="flex items-center my-3 gap-3">
                  <p className="text-lg">Projected Yield</p>
                  <p className="text-[#0D47A1] p-1 bg-blue-200 rounded-xl text-sm">
                    APY{" "}
                    {(contractData
                      ? (contractData.apy as unknown as anchor.BN).toNumber()
                      : 0) / 100}
                    %
                  </p>
                </div>

                <div className="pb-3">
                  <div className="flex items-center gap-2 mt-2">
                    <div className=" border w-[75%] md:w-[85%]">
                      <input
                        type="number"
                        min={0}
                        placeholder="0.0 SOL"
                        value={depositAmount}
                        className="outline-none placeholder-[#0D47A1] placeholder-custom w-full p-2 placeholder-text-right"
                        onChange={(e) =>
                          setDepositAmount(parseFloat(e.target.value))
                        }
                      />
                    </div>

                    <button
                      className="border p-2 w-[25%] md:w-[15%]"
                      onClick={handleMax}
                    >
                      MAX
                    </button>
                  </div>

                  <div>
                    <button
                      className={
                        depositAmount <= 0
                          ? `w-full p-2 mt-3 bg-[#c5c5c5] rounded-md cursor-pointer text-[#5d5d5d]`
                          : `w-full p-2 mt-3 bg-[#0D47A1] rounded-md cursor-pointer text-white`
                      }
                      disabled={depositAmount <= 0}
                      onClick={handleDepositWithPriorityFees}
                    >
                      <p>DEPOSIT SOL</p>
                    </button>
                    <hr className="my-3" />
                    <button
                      className={
                        userData == undefined
                          ? `w-full p-2 mt-3 bg-[#c5c5c5] rounded-md cursor-pointer text-[#5d5d5d]`
                          : `w-full p-2 mt-3 bg-[#0D47A1] rounded-md cursor-pointer text-white`
                      }
                      disabled={userData == undefined}
                      onClick={handleWithdrawal}
                    >
                      <p>WITHDRAW SOL</p>
                    </button>
                  </div>

                  <div className="my-4">
                    <h2>Priority Fees</h2>

                    <div className="flex flex-wrap gap-3 mt-4 ">
                    <button
                        className={`${priority == "none" ? "bg-[#0d48a1d3] text-slate-200" : "bg-[#0D47A114] text-[#0D47A1A3]"} border border-[#032E703D] p-1 px-2 rounded-md text-[14px]`}
                        onClick={() => setPriority("none")}
                      >
                        <p>None</p>
                      </button>
                      <button
                        className={`${priority == "low" ? "bg-[#0d48a1d3] text-slate-200" : "bg-[#0D47A114] text-[#0D47A1A3]"} border border-[#032E703D] p-1 px-2 rounded-md text-[14px]`}
                        onClick={() => setPriority("low")}
                      >
                        <p>Low</p>
                      </button>
                      <button
                        className={`${priority == "medium" ? "bg-[#0d48a1d3] text-slate-200" : "bg-[#0D47A114] text-[#0D47A1A3]"} border border-[#032E703D] p-1 px-2 rounded-md text-[14px]`}
                        onClick={() => setPriority("medium")}
                      >
                        <p>Medium</p>
                      </button>
                      <button
                        className={`${priority == "high" ? "bg-[#0d48a1d3] text-slate-200" : "bg-[#0D47A114] text-[#0D47A1A3]"} border border-[#032E703D] p-1 px-2 rounded-md text-[14px]`}
                        onClick={() => setPriority("high")}
                      >
                        <p>High</p>
                      </button>
                      <button
                        className={`${priority == "veryHigh" ? "bg-[#0d48a1d3] text-slate-200" : "bg-[#0D47A114] text-[#0D47A1A3]"} border border-[#032E703D] p-1 px-2 rounded-md text-[14px]`}
                        onClick={() => setPriority("veryHigh")}
                      >
                        <p>Very High</p>
                      </button>
                    </div>
                  </div>
                </div>

                <p className="flex items-center gap-2 justify-center my-2">
                  <BiDiamond className="text-[#0D47A1] text-lg" /> Mine SOL and
                  earn rewards
                </p>
              </div>

              <HowItWorks />
              <div className="bg-white px-4 py-8 w-full rounded-md  shadow pb-5">
                <div className="">
                  <div className="px-2 py-2 flex justify-between">
                    <p className="text-[#0D47A1] text-lg mb-1">SOL Mined</p>
                    <p className="text-slate-800 text-xl">
                      {currentReward} SOL
                    </p>
                  </div>
                  <p className="text-slate-500 text-right mb-3">
                    Note: Claiming more than once in a week cuts down your ROI
                  </p>
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
                      <p>RE-MINE</p>
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
                {userData && (
                  <div className="my-4">
                    <div>
                      <p className="text-[#032E70] py-2">
                        Next Capital Withdrawal Time
                      </p>
                      <p className="text-[#7F9ECF] text-[12px] pb-2">
                        countdown to withdrawal:
                      </p>
                      <Timer
                        deadline={
                          userData ? getTimerDate() : new Date().toUTCString()
                        }
                      />
                    </div>
                  </div>
                )}
              </div>

              <Referral
                address={userData ? userData.address.toString() : ""}
                referred={userData ? true : false} // set true based on whether user data exists or not or if the referrer address field in userdata exists depending on how its going to work
                referrer={refAddress}
                setReferrer={handleReferralAddress}
              />
            </div>
          </div>
        </div>
        {wallet?.publicKey.toBase58() ==
          "GubeRYFQHMMYDkNFgmXoB8EzD8LF78HuG2aLGLkrc4ht  " && (
          <div className="text-center text-white text-lg">
            <Link to="/miner/admin">Open Admin Page</Link>
          </div>
        )}

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
