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
          - Deposit and Start Mining: Miners deposit their Solana into the Libra
          Miner app to kickstart the mining process. As soon as the deposit is
          made, mining begins automatically, allowing miners to earn Solana
          rewards at a fixed APY of 2,120%.
        </p>
        <br />
        <p className="text-[#032E70] text-sm">
          - Fixed APY and Dynamic Rewards: Enjoy a fixed APY of 2,120% on your
          mining deposits. However, please note that this APY is subject to
          change based on the volume of activity on the Libra Miner platform.
          The more activity, the higher the potential rewards.
        </p>
        <br />
        <p className="text-[#032E70] text-sm">
          - Reinvestment Option: Miners have the option to reinvest their earned
          Solana back into the mining pool, compounding their returns and
          maximizing their mining potential. Reinvesting allows miners to
          accelerate their earnings and capitalize on the growing opportunities
          within the mining ecosystem.
        </p>
        <br />
        <p className="text-[#032E70] text-sm">
          - Withdrawal Penalties: Miners must wait for a minimum of 7 days
          before withdrawing their initial deposit from the Libra Miner
          platform. Attempting to withdraw before the 7-day period will result
          in a penalty, ensuring that miners commit to the mining process and
          contribute to the stability of the platform.
        </p>
      </div>
    </div>
  );
};

export default HowItWorks;
