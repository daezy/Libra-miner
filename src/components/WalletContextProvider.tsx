import React, { FC, ReactNode, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import * as walletAdapterWallets from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";

const WalletContextProvider: FC<{
  children: ReactNode;
  network: "devnet" | "mainnet-beta" | "testnet";
}> = ({ children, network }) => {
  // const endpoint =
  //   "https://solana-mainnet.g.alchemy.com/v2/mSSt0hYTZTKiDCQwz8TLgt7duMQLueDZ";
  const endpoint = "https://mainnet.helius-rpc.com/?api-key=c31c3d98-af72-4a89-a7ec-67d26e17da22";
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
