import { useConnection } from "@solana/wallet-adapter-react";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";

const MINER_BALANCE_ADDRESS = "66dkQZp2uSGCNsZtFtibzsCaU5YhYHcZLK7F5wcmnX3x";
const TAXES = "EAwYyugG9EhaRMnQxDHus6DqSHh9zaRcGkEX7tmnZGX";
const SPL_TOKEN_PROGRAM_ID = "Program11111111111111111111111111111111";
const TRANSFER_IX_TYPES = ["transferchecked", "transfer"];

const Admin = () => {
  const [contractSolBalance, setContractSolBalance] = useState<string>("0");
  const [tax, setTax] = useState<number>(0);
  const {connection} = useConnection()

  useEffect(()=>{
    const getBalance = async () => {
        const solBalance = await connection.getBalance(new PublicKey(MINER_BALANCE_ADDRESS));
        if (solBalance) {
          await setContractSolBalance((solBalance / LAMPORTS_PER_SOL).toFixed(2));
        }
        
        // const transactionDetails = await connection.getParsedTransactions(signatureList,{ maxSupportedTransactionVersion: 0 })
        // console.log(signatureList)
        // console.log(transactionDetails)
        
        // const filteredList = transactionDetails.filter(transactionDetail => JSON.stringify(transactionDetail?.transaction.message.instructions[2]).includes("parsed") && JSON.stringify(transactionDetail?.transaction.message.instructions[2]).includes("GubeRYFQHMMYDkNFgmXoB8EzD8LF78HuG2aLGLkrc4ht")
        // );

        // console.log(filteredList)
       
    }

    getBalance()

    
  },[connection])

  useEffect(() => {
    getTransactions()
  }, [])

  const getTransactions = async () => {
        
        const transactionList = await connection.getSignaturesForAddress(new PublicKey(TAXES), {until: "3mWQqyZdemRoFi4frgbLbodJMVScJNsMiKqFgG4w7QRFHkocf2tGPViKinADSsNfUudSRQkE4RkopwMcUDnphZax"})
        const signatureList = await transactionList.map(transaction => transaction.signature)
        console.log(signatureList)

        signatureList.forEach(async signature => {
            const transactionDetail = await connection.getParsedTransaction(signature,{ maxSupportedTransactionVersion: 0 })

            if (transactionDetail) {
                    if (JSON.stringify(transactionDetail?.transaction.message.instructions[2]).includes("parsed") && JSON.stringify(transactionDetail?.transaction.message.instructions[2]).includes(`"destination":"GubeRYFQHMMYDkNFgmXoB8EzD8LF78HuG2aLGLkrc4ht"`)) {
                        let amount = Number(JSON.stringify(transactionDetail?.transaction.message.instructions[2]).slice(91, -161))
                        console.log(amount)
                        setTax(tx => tx += amount)
                    }
            }
            
        })
    };

  return (
    <div className="grid grid-cols-1 gap-4 md:w-[47%] container mx-auto py-8">
        <div className="bg-white p-4 rounded-md">
            <h2 className="text-xl">Contract SOL Balance</h2>
            <p className="my-1">{contractSolBalance} SOL</p>
        </div>
        <div className="bg-white p-4 rounded-md">
            <h2 className="text-xl">Taxes Collected</h2>
            <p className="my-1">{(tax / LAMPORTS_PER_SOL)} SOL</p>

            <p className="text-sm text-slate-400">Total Fees 4%</p>
            <p className="text-sm text-slate-400">Half goes into the pool and the other half to the taxes wallet</p>
            
        </div>
    </div>
  )
}

export default Admin