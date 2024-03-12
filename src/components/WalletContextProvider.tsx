import React, { FC, ReactNode, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import * as web3 from "@solana/web3.js";
import * as walletAdapterWallets from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";

const WalletContextProvider: FC<{
  children: ReactNode;
  network: "devnet" | "mainnet-beta" | "testnet";
}> = ({ children, network }) => {
  const endpoint = web3.clusterApiUrl(network);
  const wallets = useMemo(() => {
    return [
      new walletAdapterWallets.PhantomWalletAdapter(),
      new walletAdapterWallets.SolflareWalletAdapter(),
    ];
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;
