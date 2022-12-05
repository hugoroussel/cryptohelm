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
  // 1inch token list
  const tokenList = await axios.get('https://wispy-bird-88a7.uniswap.workers.dev/?url=http://tokens.1inch.eth.link');
  console.log('token list', tokenList.data.tokens);
  const uniDefaultTokens = tokenList.data.tokens as TokenListToken[];
  const foundTokens = uniDefaultTokens.filter((token) => addresses.includes(token.address));
  return foundTokens;
}


function App() {

  const [tabData, setTabData] = useState<TabData| null>({favIconUrl: 'https://static.debank.com/image/matic_nft/local_url/5df849b06af0e9ea7bcbb8c1804304a4/59211315b16c0553e7e63bb5f536d37e.png', title: '', url: 'unknown'});
  const [activeAddresses, setActiveAddresses] = useState<string[]>([]);
  const [activeTokens, setActiveTokens] = useState<TokenListToken[]>([]);
  const [showTokens, setShowTokens] = useState<boolean>(false);
  const [showAllAddresses, setShowAllAddresses] = useState<boolean>(false);

  // define an empty chrome tab
  const nullTab: chrome.tabs.Tab = {
    active: false,
    audible: false,
    autoDiscardable: false,
    discarded: false,
    favIconUrl: '',
    height: 0,
    id: 0,} as chrome.tabs.Tab;
  const [activeTab, setActiveTabId] = useState<chrome.tabs.Tab>(nullTab);

  useEffect(() => {
    if(activeTab.id === 0) {
      return;
    }
    const urlCleaned = activeTab?.url?.split('/').slice(0, 3).join('/');
    const newTabData = {favIconUrl: activeTab?.favIconUrl, title: activeTab?.title, url: urlCleaned} as TabData;
    setTabData(newTabData);
    chrome.scripting.executeScript(
      {
        target: {tabId: activeTab!.id!},
        func: getAddresses,
      },
      () => {
        // console.log('script executed);
      });
    const messages = localStorage.getItem('messages');
    const messagesArray = messages?.split(',') as string[];
    setActiveAddresses(messagesArray);
    async function callFilter() {
      const erc20Tokens = await filterAddresses(messagesArray);
      setActiveTokens(erc20Tokens);
    }
    callFilter();
  }, [activeTab]);

  useEffect(() => {
    chrome.tabs && chrome.tabs.query({
    }, (tabs) => {
      const activeTab = tabs.find((tab) => tab.active);
      if (activeTab) {
        setActiveTabId(activeTab);
      }
    });
    setInterval(() => {
      console.log('checking for tab change');
      chrome.tabs && chrome.tabs.query({
      }, (tabs) => {
        console.log('all tabs', tabs);
        const at = tabs.find((tab) => tab.active) as chrome.tabs.Tab;
        // get active tab from local storage
        const activeTabId = localStorage.getItem('activeTab');
        // json parse the active tab
        const activeTabIdParsed = JSON.parse(activeTabId as string) as chrome.tabs.Tab;
        console.log('active tab', activeTabIdParsed, activeTabIdParsed === null);      
        console.log('active tab', at);
        if(activeTabIdParsed?.id !== at.id || activeTabIdParsed === null) {
          console.log('tab changed!');
          localStorage.setItem('activeTab', JSON.stringify(at));
          setActiveTabId(at);
        } 
      });
    }, 500);
  }, []);


  return (
    <>
      <body className='w-[420px] h-[420px] bg-white'>
        <div className="py-8 px-4 sm:px-10">
          <img src={tabData?.favIconUrl} alt="favicon" className='w-10 h-10 container'/>
          <div className="text-sm text-gray font-bold py-2 text-center">
            Connected to: <a className="text-blue-400" href={tabData?.url} target="_blank" rel="noreferrer">{tabData?.url}</a>
          </div>
          <div className='text-center'>
            <h3 className="text-lg font-medium leading-6 text-gray-900">This is what we found</h3>
            <dl className="mt-5 grid grid-cols-1 gap-1 sm:grid-cols-3">
              <div className="rounded-lg bg-white px-4 py-5 shadow sm:p-6 hover:bg-gray-300" onClick={(e) => {e.preventDefault();setShowAllAddresses(!showAllAddresses);}}>
                <dt className="text-xs text-gray-500">Total addresses found</dt>
                <dd className="mt-1 text-sm font-semibold tracking-tight text-gray-900">{activeAddresses.length}</dd>
              </div>
              {showAllAddresses && activeAddresses.map((address) => (
                <>
                  <br/>
                  <a className="text-blue-400" href={`https://debank.com./profile/${address}`} target="_blank" rel="noreferrer">{address}</a>
                </>))
              }
              <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 hover:bg-gray-300" onClick={(e) => {e.preventDefault();setShowTokens(!showTokens);}}> 
                <dt className="text-xs text-gray-500">Verified ERC20s</dt>
                <dd className="mt-1 text-sm font-semibold tracking-tight text-gray-900">{activeTokens.length}</dd>
              </div>
              {showTokens && activeTokens.map((token) => {
                return (
                  <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 hover:bg-gray-300" key={token.symbol}>
                    <img src={token.logoURI} className="h-5 w-5"/>
                    <dt className="text-xs text-gray-500">{token.symbol}</dt>
                    <dt className="text-xs text-gray-500">
                      <a className="text-blue-400" href={`https://etherscan.io/address/${token.address}`} target="_blank" rel="noreferrer">{token.address}</a>
                    </dt>
                  </div>
                );
              })}
              <div className="rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt className="text-xs text-gray-500">Total addresses found</dt>
                <dd className="mt-1 text-sm font-semibold tracking-tight text-gray-900">{activeAddresses.length}</dd>
              </div>
            </dl>
          </div>
          <div className="mt-6">
            <div className="container mx-auto">
              <div>
              Powered by <a className="text-blue-500" href="https://etherscan.io/" target="_blank" rel="noreferrer">Etherscan</a>
              </div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
}

export default App;
