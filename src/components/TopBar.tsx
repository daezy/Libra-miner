import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React, { FC, useState } from "react";

const TopBar: FC<{
  setNetwork: (name: "devnet" | "mainnet-beta" | "testnet") => void;
  network: string;
}> = ({ network, setNetwork }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState<boolean>(false);

  const toggleDropdown = () => {
    setDropOpen((drop) => !drop);
  };
  return (
    <nav className="">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="brand flex items-center justify-between ml-[-20px]">
          <img src="./logo.png" width={90} alt="" />
          <h2 className="text-slate-100 tracking-widest self-center md:text-xl font-semibold whitespace-nowrap ml-[-20px] text-lg">
            LIBRA
          </h2>
        </div>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse items-center">
          <div className="flex justify-end items-center gap-3">
            <div>
              <div className="dropdown">
                <button
                  className="text-slate-100  py-4 px-3 rounded-2xl  flex justify-between gap-3 items-center mr-3 capitalize text-sm font-medium shadow bg-slate-700"
                  onClick={() => toggleDropdown()}
                >
                  <img
                    src="./sol.png"
                    className="max-w-full"
                    width={27}
                    alt="sol"
                  />{" "}
                  <span className="hidden md:block"> {network && network}</span>
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
            <div className="border-2 border-solid rounded border-blue-400">
              <WalletMultiButton className="py-2 md:px-4 px-2 rounded-md flex justify-center items-center bg-gradient-to-r from-[#1b2d6a] to-blue-400" />
            </div>
          </div>
          <button
            data-collapse-toggle="navbar-cta"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-cta"
            aria-expanded="false"
            onClick={() => setIsOpen((open) => !open)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className={`items-center justify-between ${
            isOpen ? "" : "hidden"
          } w-full md:flex md:w-auto md:order-1`}
          id="navbar-cta"
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-solid border-slate-400 rounded-lg md:border-0  md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0e bg-transparent text-white uppercase ">
            <li>
              <a href="/" className=" hover:text-blue-900 p-4 md:p-0">
                Miner
              </a>
            </li>
            <li>
              <a
                href="https://libra-finance.app"
                className=" hover:text-blue-900 p-4 md:p-0"
              >
                Dapp
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default TopBar;
