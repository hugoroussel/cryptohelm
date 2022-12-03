import React, { useEffect } from 'react';
import './index.css';
import {useState} from 'react';

interface TabData {
  favIconUrl: string;
  title: string;
}

interface ResultData {
  addresses: string[];
}


function getTitle() {
  const addressesFound: string[] = [];
  // get the inner html of the page
  const title = document.getElementsByTagName('script');
  // for each script return the src attribute
  for (let i = 0; i < title.length; i++) {
    // log each src attribute file content
    fetch(title[i].src)
      .then((response) => response.text())
      .then((text) => {
        // find all the addresses in the file
        const regex = /0x[a-fA-F0-9]{40}/g;
        const found = text.match(regex);
        if (found) {
          found.forEach((address) => addressesFound.push(address), addressesFound.length++);
        }
      }
      ).then(
        () => {
          const uniqueAddresses = new Set();
          addressesFound.forEach((address) => {
            uniqueAddresses.add(address);
          });
          uniqueAddresses.delete("0x0000000000000000000000000000000000000000");
          uniqueAddresses.delete("0xffffffffffffffffffffffffffffffffffffffff");
          chrome.runtime.sendMessage({addresses: Array.from(uniqueAddresses.values())});
        }
      )
  }
}


function App() {

  const [iconUrl, setIconUrl] = useState<TabData| null>(null);
  const [activeAddress, setActiveAddress] = useState<number>(0);

  // on first load console log hello world
  useEffect(() => {
    // get the content of the clipboard
    chrome.tabs && chrome.tabs.query({
      active: true,
      currentWindow: true
   }, (tabs) => {
      console.log(tabs[0].url);
      const newTabData = {favIconUrl: tabs[0].favIconUrl,title: tabs[0].title} as TabData;
      setIconUrl(newTabData);
      console.log("all the tabs",tabs);
      // get the source code of the page
      chrome.scripting.executeScript(
        {
          target: {tabId: tabs[0].id!},
          func: getTitle,
        },
        (res) => {
          console.log("result", res);
        });
   });
   // get the content of the local storage 
   const messages = localStorage.getItem("messages")
   console.log("local storage content", messages);
   // transform csv to array
    const messagesArray = messages?.split(",");
    console.log("messages", messagesArray);
    setActiveAddress(messagesArray?.length || 0);

  }, []);


  return (
    <>
    <div className="w-80 h-px h-1400 rounded-lg">
      <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
        <div className="text-blue container mx-auto text-xl font-semibold py-2">
          MetaScan
        </div>

        <div className="text-blue container center mx-auto text-xl font-semibold py-2">
          Connected to:
          {/*Display the favicon of the current tab*/}
          <img src={iconUrl?.favIconUrl} alt="favicon" className='w-5 h-5'/>
          {/*Display the title of the current tab*/}
          {iconUrl?.title}
          Found {activeAddress} active contract addresses
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
              className="text-white flex w-full justify-center rounded-md border border-transparent bg-lblue py-2 px-4 text-sm font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Search
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="container mx-auto">
            <div>
              Powered by <a className="text-lblue" href="https://etherscan.io/" target="_blank" rel="noreferrer">Etherscan</a>
            </div>
          </div>
        </div>
      </div>
      </div>
</>
  );
}

export default App;
