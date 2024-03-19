import { FaSpinner } from "react-icons/fa";

const Loader = () => {
  return (
    <div className="w-screen h-screen bg-black bg-opacity-45 flex justify-center items-center fixed top-0 z-30 left-0">
      <FaSpinner className="animate-spin text-3xl text-white" />
    </div>
  );
};

export default Loader;
