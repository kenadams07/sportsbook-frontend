import React from "react";
// import { useDispatch } from "react-redux";
// import { oneClickBet as oneClickBetAction } from "../../redux/actions/bet/oneClickBetAction";

const InternalServerError = ({ reset }) => {
  // const dispatch = useDispatch();
  // dispatch(oneClickBetAction({}));
  // localStorage.removeItem("oneClickBetLocalStorageData");
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 min-h-screen mx-auto  lg:py-16 lg:px-6 flex items-center">
        <div className="mx-auto  text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-white">
            500
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
            Internal Server Error.
          </p>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            We are already working to solve the problem.
          </p>
          <button
            onClick={() => reset()}
            className="w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    </section>
  );
};

export default InternalServerError;
