import React, { useEffect } from 'react';
import './index.css';
import {useState} from 'react';
import axios from 'axios';

interface TabData {
  favIconUrl: string;
  title: string;
  url: string;
}

interface TokenListToken {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
}

function getAddresses() {
  const addressesFound: string[] = [];
  const title = document.getElementsByTagName('script');
  for (let i = 0; i < title.length; i++) {
    fetch(title[i].src)
      .then((response) => response.text())
      .then((text) => {
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
          uniqueAddresses.delete('0x0000000000000000000000000000000000000000');
          uniqueAddresses.delete('0xffffffffffffffffffffffffffffffffffffffff');
          uniqueAddresses.delete('0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
          uniqueAddresses.delete('0x1000000000000000000000000000000000000000');
          chrome.runtime.sendMessage({addresses: Array.from(uniqueAddresses.values())});
        }
      );
  }
}

async function filterAddresses(addresses: string[]): Promise<TokenListToken[]> {
  console.log('filtering against token lists...');
  // get the token list from uniswap using axios
  const tokenList = await axios.get('https://gateway.ipfs.io/ipns/tokens.uniswap.org');
  console.log('token list', tokenList.data.tokens);
  const uniDefaultTokens = tokenList.data.tokens as TokenListToken[];
  // find the tokens that are in the token list
  const foundTokens = uniDefaultTokens.filter((token) => addresses.includes(token.address));
  // const filteredERC20s = addresses.filter((address) => uniDefaultTokens.find((token) => token.address === address));
  console.log('filtered ERC20s', foundTokens);
  return foundTokens;
}


function App() {

  const [tabData, setTabData] = useState<TabData| null>(null);
  const [activeAddresses, setActiveAddresses] = useState<string[]>([]);
  const [activeTokens, setActiveTokens] = useState<TokenListToken[]>([]);

  useEffect(() => {
    chrome.tabs && chrome.tabs.query({
      active: true,
      currentWindow: true,
    }, (tabs) => {
      console.log('all tabs', tabs);
      // clean the end of the url by removing everything after the third slash
      const urlCleaned = tabs[0].url?.split('/').slice(0, 3).join('/');
      const newTabData = {favIconUrl: tabs[0].favIconUrl, title: tabs[0].title, url: urlCleaned} as TabData;
      setTabData(newTabData);
      console.log('all the tabs',tabs);
      chrome.scripting.executeScript(
        {
          target: {tabId: tabs[0].id!},
          func: getAddresses,
        },
        (res) => {
          console.log('result', res);
        });
    }); 
    const messages = localStorage.getItem('messages');
    const messagesArray = messages?.split(',') as string[];
    setActiveAddresses(messagesArray);
    
    async function callFilter() {
      const erc20Tokens = await filterAddresses(messagesArray);
      setActiveTokens(erc20Tokens);
    }
    callFilter();
  }, []);


  return (
    <>
      <body className='w-[420px] h-[420px] shadow rounded-lg'>
        <div className="bg-white py-8 px-4 sm:px-10">
          <div className="text-blue-800 container mx-auto text-3xl font-semibold py-2 text-center">
          MetaScan
          </div>
          
          <img src={tabData?.favIconUrl} alt="favicon" className='w-10 h-10 container'/>
          <div className="text-sm text-gray font-bold py-2 text-center">
            Connected to: <a className="text-blue-400" href={tabData?.url} target="_blank" rel="noreferrer">{tabData?.url}</a>
          </div>

          <div className="text-blue mx-auto text-xl text-center font-semibold py-2 align-content">
            Found {activeAddresses.length} active contract addresses
          </div>

          {activeAddresses.map((address) => (
            <>
              <br/>
              <a className="text-blue-400" href={`https://debank.com./profile/${address}`} target="_blank" rel="noreferrer">{address}</a>
            </>))
          }

          <div className="mt-6">
            <div className="container mx-auto">
              <div>
              Powered by <a className="text-blue" href="https://etherscan.io/" target="_blank" rel="noreferrer">Etherscan</a>
              </div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
}

export default App;
