import React, { useState } from "react";
import "./App.css";
import LibraMiner from "./components/LibraMiner";
import WalletContextProvider from "./components/WalletContextProvider";
import TopBar from "./components/TopBar";

function App() {
  const [network, setNetwork] = useState<"devnet" | "mainnet-beta" | "testnet">(
    "mainnet-beta"
  );
  return (
    <>
      <WalletContextProvider network={network}>
        <section>
          <div className="container mx-auto px-4 ">
            <TopBar network={network} setNetwork={setNetwork} />
            <LibraMiner />
          </div>
        </section>
      </WalletContextProvider>
    </>
  );
}

export default App;
