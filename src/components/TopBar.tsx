import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React, { FC, useState } from "react";

const TopBar: FC<{ setNetwork: (string) => void; network: string }> = ({
  network,
  setNetwork,
}) => {
  const [dropOpen, setDropOpen] = useState<boolean>(false);

  const toggleDropdown = () => {
    setDropOpen((drop) => !drop);
  };
  return (
    <div className="container mx-auto px-4 py-3">
      <div className="flex justify-end items-center gap-3">
        <div>
          <div className="dropdown">
            <button
              className="text-slate-100 border border-solid border-blue-600 py-4 px-3 rounded-2xl  flex justify-between gap-3 items-center mr-3 capitalize text-sm font-medium "
              onClick={() => toggleDropdown()}
            >
              <img
                src="./sol.png"
                className="max-w-full"
                width={27}
                alt="sol"
              />{" "}
              {network && network}
            </button>
            <div
              id="myDropdown"
              className={`dropdown-content ${dropOpen ? "show" : ""}`}
            >
              <a
                href="#"
                onClick={() => {
                  setNetwork("testnet");
                  toggleDropdown();
                }}
              >
                Testnet
              </a>
              <a
                href="#"
                onClick={() => {
                  setNetwork("devnet");
                  toggleDropdown();
                }}
              >
                Devnet
              </a>
              <a
                href="#"
                onClick={() => {
                  setNetwork("mainnet-beta");
                  toggleDropdown();
                }}
              >
                Mainnet
              </a>
            </div>
          </div>
        </div>
        <div>
          <WalletMultiButton className="py-2 md:px-4 px-2 rounded-md flex justify-center items-center bg-gradient-to-r from-[#1b2d6a] to-blue-400" />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
