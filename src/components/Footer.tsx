const Footer = () => {
  return (
    <div className=" ">
      <footer className="w-11/12 mx-auto py-4 mt-2 text-white flex justify-between items-center gap-2 flex-col md:flex-row">
        <p className=" text-center ] p-5 pt-7">
          Copyright © 2024 LIBRA.FINANCE (
          <span className="text-blue-100">$LIBRA</span>). All rights reserved.
        </p>
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 rounded-md">
            <img src="./img/alpha.png" alt="" width={35} />
          </div>
          <p>
            Powered by{" "}
            <a
              href="https://alphadevelopments.org"
              target="blank"
              className="text-blue-200"
            >
              Alpha Developments
            </a>{" "}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
