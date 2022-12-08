import React, { useEffect } from 'react';
import './index.css';
import {useState} from 'react';
import axios from 'axios';
import { ArrowPathIcon, ShieldCheckIcon, CheckBadgeIcon, ExclamationCircleIcon} from '@heroicons/react/20/solid';
import {TabData, TokenListToken,NewPageProps} from './structs';
import NewPage from './NewPage';

function getAddresses() {
  const addressesFound: string[] = [];
  const title = document.getElementsByTagName('script');
  console.log('title', title);
  // remove if the script is from argent 
  for (let i = 0; i < title.length; i++) {
    if (title[i].id.includes('argent-x-extension')) {
      continue;
    }
    fetch(title[i].src)
      .then((response) => response.text())
      .then((text) => {
        const regex = /0x[a-fA-F0-9]{40}/g;
        const found = text.match(regex);
        if (found) {
          found.forEach((address) => addressesFound.push(address));
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


function App() {

  const [tabData, setTabData] = useState<TabData| null>({favIconUrl: 'https://static.debank.com/image/matic_nft/local_url/5df849b06af0e9ea7bcbb8c1804304a4/59211315b16c0553e7e63bb5f536d37e.png', title: '', url: 'unknown'});
  const [serverLive, setServerLive] = useState<boolean>(false);
  const [showStart, setShowStart] = useState<boolean>(false);


  const [activeAddresses, setActiveAddresses] = useState<string[]>([]);
  const [activeTokens, setActiveTokens] = useState<TokenListToken[]>([]);
  const [nftTokens, setNftTokens] = useState<TokenListToken[]>([]);
  const [showTokens, setShowTokens] = useState<boolean>(false);
  const [showAllAddresses, setShowAllAddresses] = useState<boolean>(false);
  const [showNfts, setShowNfts] = useState<boolean>(false);
  const [showContracts, setShowContracts] = useState<boolean>(false);
  const [others, setOthers] = useState<string[]>([]);

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

  function callGoServer(){
    console.log('calling go server with ', others.length);
    axios.post(`${process.env.REACT_APP_GO_SERVER_URL}/analyze`, {addresses: others});
  }

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
    let messagesArray = messages?.split(',') as string[];
    if (messagesArray[0] === '') {
      messagesArray = [];
    }
    // send the addresses to server for analysis

    async function runAnalysis() {
      if (messagesArray.length === 0) {
        setActiveAddresses([]);
        return;
      }
      const data = {addresses: messagesArray};
      const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/analyze`, data);
      setActiveTokens(res.data.foundTokens);
      setActiveAddresses(res.data.allAddressesWithoutDuplicates);
      setNftTokens(res.data.nfts);
      setOthers(res.data.others);
    }
    runAnalysis();
  }, [activeTab]);

  useEffect(() => {
    async function livenessCheck() {
      const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/ping`);
      if (res.data === 'Server is running') {
        setServerLive(true);
      }
      console.log('livenesscheck', res.data);
    }
    livenessCheck();
    chrome.tabs && chrome.tabs.query({
    }, (tabs) => {
      const activeTab = tabs.find((tab) => tab.active);
      if (activeTab) {
        setActiveTabId(activeTab);
      }
    });
    setInterval(() => {
      chrome.tabs && chrome.tabs.query({
      }, (tabs) => {
        const at = tabs.find((tab) => tab.active) as chrome.tabs.Tab;
        const activeTabId = localStorage.getItem('activeTab');
        const activeTabIdParsed = JSON.parse(activeTabId as string) as chrome.tabs.Tab;
        if(activeTabIdParsed?.id !== at.id || activeTabIdParsed === null) {
          localStorage.setItem('activeTab', JSON.stringify(at));
          setActiveTabId(at);
        } 
      });
    }, 500);
  }, []);

  const NewPageProps: NewPageProps = {
    showStart: showStart,
    setShowStart: setShowStart,
  };

  return (
    <>
      {showStart && <NewPage {...NewPageProps}/>}
      <body className='w-[340px] h-[450px] bg-white'>
        <div className="bg-[#D9D9D9] h-[31px] grid grid-cols-4 gap-4 rounded-sm">
          <div className="flex">
            <ShieldCheckIcon className="h-7 pt-1 pr-1 text-[#3C4D7B] flex-shrink-0" aria-hidden="true" />
            <div className="text-lg pt-0.5 text-gray-800">Metascan</div>
          </div>
          <div></div>
          <div></div>
          <div className="flex justify-end pt-2">
            <ArrowPathIcon className="h-10 pb-6 pr-2 text-gray-900 hover:text-gray-400" aria-hidden="true" onClick={(e)=>{e.preventDefault();callGoServer();}} />
            <div className="text-xs pr-1">
              {serverLive ? '🟢' : '🔴'}
            </div>
          </div>
        </div>

        <div>
          <img src={tabData?.favIconUrl} alt="favicon" className='w-10 h-10 container my-2'/>
          <div className="text-sm text-gray text-center pb-2">
            Connected to: <a className="text-blue-400" href={tabData?.url} target="_blank" rel="noreferrer">{tabData?.url}</a>
          </div>
        </div>
        <hr/>

        <div className="py-4 flex text-center">
          {activeAddresses.length > 0 && <CheckBadgeIcon className="h-10 pb-2 pl-2 flex-shrink-0 self-center text-blue-400" aria-hidden="true" />}
          {activeAddresses.length == 0 && <ExclamationCircleIcon className="h-10 pb-2 pl-2 flex-shrink-0 self-center text-blue-400" aria-hidden="true" />}
          <div className='text-lg font-semibold'>
            {activeAddresses.length > 0 ? (`Detected at least ${activeAddresses.length} smart contracts on this page, all verified.`) : 'No smart contracts detected'}
          </div>
        </div>

        <hr/>

        <div className='text-center my-2 mx-2'>
          <dl className="mt-5 grid grid-cols-2 gap-1 sm:grid-cols-3">
            <div className="rounded-lg bg-[#3C4D7B] px-4 py-5 shadow sm:p-6 hover:bg-gray-800" onClick={(e) => {e.preventDefault();setShowAllAddresses(!showAllAddresses);}}>
              <dt className="text-xs text-gray-100">Total addresses</dt>
              <dd className="mt-1 text-sm font-semibold tracking-tight text-gray-300">{activeAddresses.length}</dd>
            </div>
            {showAllAddresses && activeAddresses.map((address) => (
              <>
                <br/>
                <a className="text-blue-400" href={`https://debank.com./profile/${address}`} target="_blank" rel="noreferrer">{address}</a>
              </>))
            }
            <div className="rounded-lg bg-[#3C4D7B] px-4 py-5 shadow sm:p-6 hover:bg-gray-800" onClick={(e) => {e.preventDefault();setShowTokens(!showTokens);}}> 
              <dt className="text-xs text-gray-100">Verified ERC20s</dt>
              <dd className="mt-1 text-sm font-semibold tracking-tight text-gray-300">{activeTokens.length}</dd>
            </div>
            {showTokens && activeTokens.map((token) => {
              return (
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 hover:bg-gray-300" key={token.symbol}>
                  <img src={token.logoURI} className="h-5 w-5"/>
                  <dt className="text-xs text-gray-500">{token.symbol}</dt>
                  <dt className="text-xs text-gray-500">
                    <a className="text-blue-400" href={`https://etherscan.io/address/${token.address}`} target="_blank" rel="noreferrer">
                      {
                        token.address.substring(0, 6) + '...' + token.address.substring(token.address.length - 4, token.address.length)
                      }</a>
                  </dt>
                </div>
              );
            })}
            <div className="rounded-lg bg-[#3C4D7B] px-4 py-5 shadow sm:p-6 hover:bg-gray-800" onClick={(e) => {e.preventDefault();setShowNfts(!showNfts);}}>
              <dt className="text-xs text-gray-100">NFT addresses</dt>
              <dd className="mt-1 text-sm font-semibold tracking-tight text-gray-300">{nftTokens.length}</dd>
            </div>
            {showNfts && nftTokens.map((token) => {
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
            <div className="rounded-lg bg-[#3C4D7B] px-4 py-5 shadow sm:p-6 hover:bg-gray-800" onClick={(e)=>{e.preventDefault();setShowContracts(!showContracts);}}>
              <dt className="text-xs text-gray-100">Other Addresses</dt>
              <dd className="mt-1 text-sm font-semibold tracking-tight text-gray-300">{others.length}</dd>
            </div>
            {showContracts && others.map((address) => (
              <>
                <br/>
                <a className="text-blue-400 text-center" href={`https://etherscan.io/address/${address}`} target="_blank" rel="noreferrer">{address}</a>
              </>))}
          </dl>
        </div>
        <hr/>
        <div className='pl-1 pt-1 text-center text-md font-light'>
          Metascan all rights reserved.
        </div>
      </body>
    </>
  );
}

export default App;
