import React, { useEffect } from 'react';
import './index.css';
import {useState} from 'react';
import axios from 'axios';
import { SignalSlashIcon, CheckBadgeIcon, MagnifyingGlassIcon, ExclamationCircleIcon, ShieldExclamationIcon, BoltSlashIcon, BoltIcon} from '@heroicons/react/20/solid';
import {ContractsPageProps,TabData, TokenListToken,ERC20sPageProps,AddressCollection} from './structs';
import NewPage from './Tokens';
import Header from './Header';
import Contracts from './Contracts';
import unverifiedPlaceholder from './unverifiedcontracts.json';
import fs from 'fs';

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
  const [indexingNecessary, setIndexingNecessary] = useState<boolean>(false);

  const [showTokens, setShowTokens] = useState<boolean>(false);
  const [showNfts, setShowNfts] = useState<boolean>(false);
  const [showUnverifiedContracts, setShowUnverifiedContracts] = useState<boolean>(false);
  const [showAllAddresses, setShowAllAddresses] = useState<boolean>(false);

  const [activeAddresses, setActiveAddresses] = useState<string[]>([]);
  const [activeTokens, setActiveTokens] = useState<TokenListToken[]>([]);
  const [nftTokens, setNftTokens] = useState<TokenListToken[]>([]);
  const [others, setOthers] = useState<string[]>([]);
  const [nonVerified, setNonVerified] = useState<AddressCollection[]>([]);

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
    let messagesArray = messages?.split(',') as string[];
    if (messagesArray[0] === '') {
      messagesArray = [];
    }
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
      setIndexingNecessary(res.data.indexingNecessary);
      console.log(res.data);
      setNonVerified(res.data.nonVerifiedContracts);
    }
    runAnalysis();
  }, [activeTab]);

  useEffect(() => {

    // read the unverified contracts from local file

    const placeHolderData = JSON.parse(JSON.stringify(unverifiedPlaceholder));
    setNonVerified(placeHolderData);

    

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

  const erc20PageProps: ERC20sPageProps = {
    showTokens: showTokens,
    setShowTokens: setShowTokens,
    serverLive: serverLive,
    erc20s: activeTokens,
  };

  const nftsPageProps: ERC20sPageProps = {
    showTokens: showNfts,
    setShowTokens: setShowNfts,
    serverLive: serverLive,
    erc20s: nftTokens,
  };

  const unverifiedContractPageProps : ContractsPageProps = {
    contracts: nonVerified,
    showContracts: showUnverifiedContracts,
    setShowContracts: setShowUnverifiedContracts,
  };

  // etherscan light blue #3498db

  return (
    <>
      {showTokens && <NewPage {...erc20PageProps}/>}
      {showNfts && <NewPage {...nftsPageProps}/>}
      {showUnverifiedContracts && <Contracts {...unverifiedContractPageProps}/>}
      {!showUnverifiedContracts && !showNfts &&!showTokens &&

        <body className='w-[340px] h-[450px] bg-white'>
          <Header/>

          <div>
            <img src={tabData?.favIconUrl} alt="favicon" className='w-10 h-10 container my-2'/>
            <div className="text-sm text-gray text-center pb-2">
            Connected to: <a className="text-blue-400" href={tabData?.url} target="_blank" rel="noreferrer">{tabData?.url}</a>
            </div>
          </div>

          <div/>

          <div className="py-2 border-solid border-[#21325b] border-[0.5px] rounded-sm hover:bg-gray-200" onClick={(e)=>{e.preventDefault();setShowStart(!showStart);}}>
            {activeAddresses.length > 0 && !indexingNecessary && 
          <>
            <div className='ml-5 flex items-center font-semibold text-lg'>
              <CheckBadgeIcon className="h-8 w-8 m-2 text-blue-500 inline" aria-hidden="true" />
              <div className="text-lg font-semibold">
              Found {activeAddresses.length} verified contracts
              </div>
            </div>
            <div className='ml-5 flex items-center text-md font-semibold text-lg'>
              <ShieldExclamationIcon className="h-8 w-8 m-2 text-red-500 inline" aria-hidden="true" />
              <div className="text-lg font-semibold">
              Found {nonVerified?.length} unverified contracts
              </div>
            </div>
          </>
            }
            {activeAddresses.length > 0 && indexingNecessary && 
          <div className='ml-5 flex items-center'>
            <MagnifyingGlassIcon className="m-1 h-8 w-8 text-red-800 inline" aria-hidden="true" />
            <div className="text-lg font-semibold">
              Indexing.. Please wait a few minutes and refresh.
            </div>
          </div>
            }
            {activeAddresses.length == 0 && 
          <>
            <div className='flex items-center ml-7'>
              <SignalSlashIcon className="m-2 h-8 w-8 text-gray-800 inline" aria-hidden="true" />
              <div className="text-lg font-semibold">
                No addresses detected
              </div>
            </div>
          </>
            }
          </div>

          <div className='text-center my-2 mx-2'>
            <dl className="mt-5 grid grid-cols-2 gap-1 sm:grid-cols-3">
              <div className="rounded-lg bg-[#21325b] px-4 py-5 shadow sm:p-6 hover:bg-gray-800" onClick={(e) => {e.preventDefault();setShowUnverifiedContracts(!showUnverifiedContracts);}}>
                <dt className="text-xs text-gray-100">Unverified Contracts</dt>
                <dd className="mt-1 text-sm font-semibold tracking-tight text-gray-300">{nonVerified.length}</dd>
              </div>
              <div className="rounded-lg bg-[#21325b] px-4 py-5 shadow sm:p-6 hover:bg-gray-800" onClick={(e) => {e.preventDefault();setShowTokens(!showTokens);}}> 
                <dt className="text-xs text-gray-100">Verified ERC20s</dt>
                <dd className="mt-1 text-sm font-semibold tracking-tight text-gray-300">{activeTokens.length}</dd>
              </div>
              <div className="rounded-lg bg-[#21325b] px-4 py-5 shadow sm:p-6 hover:bg-gray-800" onClick={(e) => {e.preventDefault();setShowNfts(!showNfts);}}>
                <dt className="text-xs text-gray-100">NFT addresses</dt>
                <dd className="mt-1 text-sm font-semibold tracking-tight text-gray-300">{nftTokens.length}</dd>
              </div>
              <div className="rounded-lg bg-[#21325b] px-4 py-5 shadow sm:p-6 hover:bg-gray-800" onClick={(e)=>{e.preventDefault();}}>
                <dt className="text-xs text-gray-100">Other Addresses</dt>
                <dd className="mt-1 text-sm font-semibold tracking-tight text-gray-300">{others.length}</dd>
              </div>
            </dl>
          </div>
          <hr/>
          <div className='pl-1 pt-1 text-center text-md font-light'>
          Metascan all rights reserved.
          </div>
        </body>
      }
    </>

  );
}

export default App;
