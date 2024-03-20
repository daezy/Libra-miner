import { useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

const HowItWorks = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="bg-[#E4EBF8] h-full rounded-md overflow-hidden">
      <div
        className="flex items-center justify-between px-7 py-4 hover:bg-slate-300 cursor-pointer"
        onClick={() => setOpen((op) => !op)}
      >
        <p className="text-[15px] text-[#032E70]">How Libra Miner Works</p>

        {open ? <FaCaretUp /> : <FaCaretDown />}
      </div>
      <div
        className={`transition-all ease-in-out duration-300 px-4 ${
          open ? "h-full py-3" : "h-0"
        }`}
      >
        <p className="text-[#032E70] text-sm">
          - You initiate your mining journey by depositing their Solana (SOL)
          tokens into the Libra Miner app. Once deposited, the mining process
          begins automatically, enabling users to earn Solana rewards at a fixed
          Annual Percentage Yield (APY) of 2,120%.
        </p>
        <br />
        <p className="text-[#032E70] text-sm">
          - You have the option to re-mine their earned rewards directly within
          the Solana mining pool. This feature allows for continuous compounding
          of earnings, maximizing the potential for long-term wealth
          accumulation.
        </p>
        <br />
        <p className="text-[#032E70] text-sm">
          - You can only withdraw profit once every 7 days, Attempting to
          withdraw profit more frequently may result in a percentage of the
          reward being returned to the pool.
        </p>
      </div>
    </div>
  );
};

export default HowItWorks;
