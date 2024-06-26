import React, { useState } from "react";

const Referral: React.FC<{
  address: string | undefined;
  referred: boolean;
  referrer: string;
  setReferrer: (address: string) => void;
}> = (props) => {
  const [copyText, setCopyText] = useState<string>("Copy");

  const referralLink = `https://miner.libra-finance.app?ref=${props.address ? props.address : ""}`;

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopyText("Copied");
    setTimeout(() => {
      setCopyText("Copy");
    }, 2000);
  };

  return (
    <div className="bg-white h-full rounded-md overflow-hidden p-4">
      <div>
        {!props.referred && (
          <div>
            <h2 className="my-2">Referral Address</h2>
            <input
              type="text"
              id="referral"
              name="referral"
              className="outline-none mb-4 placeholder-slate-600 placeholder-custom w-full p-3 placeholder-text-right border border-slate-200"
              placeholder="Enter referral address"
              value={props.referrer}
              onChange={(e) => props.setReferrer(e.target.value)}
            />

            <br />
          </div>
        )}

        {/* <h2 className="my-2">Referred by?</h2>
        <p className="bg-slate-200 p-3 rounded-md text-sm text-slate-600">
          0x0003D3WJ394059K9J48689JI947 */}
        {/* </p> */}
        <h2 className="my-2">Referral Link</h2>
        <p className="bg-slate-200 p-3 py-4 rounded-md text-sm text-blue-600 flex items-center justify-between gap-3">
          <span className="break-words overflow-clip">{referralLink}</span>
          <button
            className="p-3 h-full text-slate-600 hover:bg-slate-300 rounded"
            onClick={handleCopyToClipboard}
          >
            {copyText}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Referral;
