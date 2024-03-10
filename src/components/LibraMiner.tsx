import React, { useState } from "react";
import logo from "../assets/libra logo 1.png";

const LibraMiner = () => {
  const [disabled, setDisabled] = useState(true);
  const [hasMined, setHasMined] = useState(false);

  return (
    <div className="relative">
      <div className="flex md:justify-center justify-start items-center ">
        <img src={logo} alt="logo" className="md:w-[150px] w-[100px]" />
        <h1 className="md:text-[32px] text-[20px] -ml-5 font-bold md:text-blue-500 text-white">
          Libra Finance
        </h1>
      </div>
      <div className="flex flex-col justify-center items-center relative">
        <div>
          <p className="text-[#d5d5d5] text-center -mt-5">
            Introducing Solana's First Rebase Token And <br />
            Interest Derivative.
          </p>
        </div>
        <div className="lg:w-[32%] md:w-[50%] w-[70%] mt-10 ">
          <div className="bg-white p-3 w-full rounded-[10px]  shadow-lg pb-5">
            <div className="px-2 py-2 flex justify-between ">
              <p className="font-light text-[#5d5d5d]">Contract</p>
              <p className="text-[#011556] font-bold">0.0 SOL</p>
            </div>
            <div className="px-2 py-2 flex justify-between ">
              <p className="font-light text-[#5d5d5d]">Wallet</p>
              <p className="text-[#011556] font-bold">0.0 SOL</p>
            </div>
            <div className="px-2 py-2 flex justify-between ">
              <p className="font-light text-[#5d5d5d]">Your Libra</p>
              <p className="text-[#011556] font-bold">0.0 LIBRA</p>
            </div>
            {hasMined ? (
              <div className="border-b pb-3 border-[#c5c5c5]">
                <div className="px-2 py-2 mt-2  border ">
                  <input
                    type="number"
                    placeholder="0.0 LIBRA"
                    className="outline-none placeholder-[#011556] placeholder-custom w-full placeholder-text-right"
                  />
                </div>
                <div>
                  <button
                    className={
                      disabled
                        ? `w-full p-2 mt-3 bg-[#c5c5c5] rounded-md cursor-pointer text-[#5d5d5d]`
                        : `w-full p-2 mt-3 bg-[#011556] rounded-md cursor-pointer text-white`
                    }
                    disabled={disabled}
                  >
                    <p>MINE LIBRA</p>
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-b pb-3 border-[#c5c5c5]">
                <div className="px-2 py-2 mt-2  border ">
                  <input
                    type="number"
                    placeholder="0.0 LIBRA"
                    className="outline-none placeholder-[#011556] placeholder-custom w-full placeholder-text-right"
                  />
                </div>
                <div>
                  <button
                    className={
                      disabled
                        ? `w-full p-2 mt-3 bg-[#c5c5c5] rounded-md cursor-pointer text-[#5d5d5d]`
                        : `w-full p-2 mt-3 bg-[#011556] rounded-md cursor-pointer text-white`
                    }
                    disabled={disabled}
                  >
                    <p>MINE LIBRA</p>
                  </button>
                </div>
              </div>
            )}
            <div className="mt-2">
              <div className="px-2 py-2 flex justify-between ">
                <p className="font-semibold text-[#011556]">Your Rewards</p>
                <p className="text-[#011556] font-bold">0.0 SOL</p>
              </div>
              <div className="flex justify-between ">
                <button
                  className={
                    disabled
                      ? `w-[45%] p-2 mt-3 bg-[#c5c5c5] rounded-md cursor-pointer text-[#5d5d5d]`
                      : `w-full p-2 mt-3 bg-[#011556] rounded-md cursor-pointer text-white`
                  }
                  disabled={disabled}
                >
                  <p>RE-MINE</p>
                </button>
                <button
                  className={
                    disabled
                      ? `w-[45%] p-2 mt-3 bg-[#c5c5c5] rounded-md cursor-pointer text-[#5d5d5d]`
                      : `w-full p-2 mt-3 bg-[#011556] rounded-md cursor-pointer text-white`
                  }
                  disabled={disabled}
                >
                  <p>TAKE SOL</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute md:top-[54px] top-[15px] md:right-4 right-2 md:mt-0 mt-5">
        <button className="py-2 md:px-4 px-2 rounded-md flex justify-center items-center bg-gradient-to-r from-[#1b2d6a] to-blue-400">
          <p className="text-white md:text-[15px] text-[10px]">CONNECT</p>
        </button>
      </div>
    </div>
  );
};

export default LibraMiner;
