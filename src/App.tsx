import React, { useState } from "react";
import "./App.css";
import LibraMiner from "./components/LibraMiner";
import WalletContextProvider from "./components/WalletContextProvider";
import TopBar from "./components/TopBar";
import Footer from "./components/Footer";

function App() {
  const [network, setNetwork] = useState<"devnet" | "mainnet-beta" | "testnet">(
    "mainnet-beta"
  );
  return (
    <>
      <WalletContextProvider network={network}>
        <section>
          <div className="p-3 bg-blue-100 mb-2">
            <p
              className="
            text-center text-sm"
            >
              Service is currently live!
            </p>
          </div>
          <div className="container mx-auto px-4 ">
            <TopBar network={network} setNetwork={setNetwork} />
            <LibraMiner />
          </div>
        </section>
        <Footer />
      </WalletContextProvider>
    </>
  );
}

export default App;
