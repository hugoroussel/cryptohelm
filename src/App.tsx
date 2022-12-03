import React, { useEffect } from 'react';
import './index.css';


function App() {

  // on first load console log hello world
  useEffect(() => {
    // get the content of the clipboard
    navigator.clipboard.readText().then(clipText => {
      console.log(clipText);
    });
  }, []);


  return (
    <>
    <div className="w-80 h-px h-1400">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div className="container mx-auto text-xl font-bold py-2">
          MetaScan
        </div>
        <form className="space-y-6" action="#" method="POST">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contract Address
            </label>
            <div className="mt-1">
              <input
                id="contractAddress"
                name="contractAddress"
                type="text"
                required
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Search
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="container mx-auto">
            <div>
              Powered by <a className="text-blue" href="https://etherscan.io/" target="_blank" rel="noreferrer">Etherscan</a>
            </div>
          </div>
        </div>
      </div>
      </div>
</>
  );
}

export default App;
