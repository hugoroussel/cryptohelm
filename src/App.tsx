import React, { useEffect } from 'react';
import './index.css';
import {useState} from 'react';
import axios from 'axios';
import { SignalSlashIcon, MagnifyingGlassIcon} from '@heroicons/react/20/solid';
import {ContractsPageProps,TabData, TokenListToken,ERC20sPageProps,AddressCollection} from './structs';
import NewPage from './Tokens';
import Header from './Header';
import UnverifiedContracts from './UnverifiedContracts';
import VerifiedContracts from './VerifiedContracts';
import Contracts from './UnverifiedContracts';
import blocksGif from './blocks.gif';
import { Circle } from 'rc-progress';
import {percentToColor} from './helpers';
import unverifiedPlaceholder from './unverifiedcontracts.json';

function getAddresses() {
  const scripts = document.getElementsByTagName('script');
  const sources = [] as string[];
  for (let i = 0; i < scripts.length; i++) {
    sources.push(scripts[i].src);
  }
  chrome.runtime.sendMessage({scripts: sources});
}

// etherscan light blue #3498db
// etherscan dark gray #979695
// etherscan dark blue #21325b

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [tabData, setTabData] = useState<TabData| null>({favIconUrl: 'https://i.imgur.com/8RetlRE.png', title: '', url: 'unknown'});
  const [serverLive, setServerLive] = useState<boolean>(false);
  const [noAddressDetected, setNoAddressDetected] = useState<boolean>(false);

  const [analysisDone, setAnalysisDone] = useState<boolean>(false);

  const [percent, setPercent] = useState<number>(100);
  const [pgColor, setPgColor] = useState<string>('#3498db');


  // Page display
  const [showUnverifiedContracts, setShowUnverifiedContracts] = useState<boolean>(false);
  const [showTokens, setShowTokens] = useState<boolean>(false);
  const [showNfts, setShowNfts] = useState<boolean>(false);
  const [showVerifiedContracts, setShowVerifiedContracts] = useState<boolean>(false);

  // Data states
  const [verifiedERC20s, setVerifiedERC20s] = useState<TokenListToken[]>([]);


  const [indexingNecessary, setIndexingNecessary] = useState<boolean>(false);
  const [showAllAddresses, setShowAllAddresses] = useState<boolean>(false);
  const [activeAddresses, setActiveAddresses] = useState<string[]>([]);
  const [nftTokens, setNftTokens] = useState<TokenListToken[]>([]);
  const [others, setOthers] = useState<string[]>([]);

  const [unverifiedContracts, setUnverifiedContracts] = useState<AddressCollection[]>([]);
  const [verifiedContracts, setVerifiedContracts] = useState<AddressCollection[]>([]);

  const nullTab: chrome.tabs.Tab = {
    active: false,
    audible: false,
    autoDiscardable: false,
    discarded: false,
    favIconUrl: '',
    height: 0,
    id: 0,} as chrome.tabs.Tab;
  const [activeTab, setActiveTab] = useState<chrome.tabs.Tab>(nullTab);


  function refreshTabData(at: chrome.tabs.Tab){
    const activeTab = at;
    // console.log('activeTab (found in react state)', activeTab);
    if(activeTab.id === 0) {
      return;
    }
    const urlCleaned = activeTab?.url?.split('/').slice(0, 3).join('/');
    const newTabData = {favIconUrl: activeTab?.favIconUrl, title: activeTab?.title, url: urlCleaned} as TabData;
    setTabData(newTabData);
  }

  function runScan(){
    console.log('runScan() called');
    setLoading(true);
    chrome.scripting.executeScript(
      {
        target: {tabId: activeTab.id || 0},
        func: getAddresses,
      },
      () => {
        // 
      });
    chrome.runtime.onMessage.addListener(
      function(request) {
        readAllScripts(request.scripts);
      }
    );
  }

  function readAllScripts(scripts: string[]){
    const addressesFound: string[] = [];
    async function fetchReadAndFindAddresses(scripts: string[]){
      for(let i=0; i < scripts.length; i++){
        // skip script if it comes from a chrome extension
        if(scripts[i].includes('chrome-extension')){
          continue;
        }
        console.log('script', scripts[i]);
        const response = await fetch(scripts[i]);
        const text = await response.text();
        const found = text.match(/0x[a-fA-F0-9]{40}/g);
        if (found !== null) {
          addressesFound.push(...found);
        }
      }
      const uniqueAddresses = new Set(addressesFound);
      uniqueAddresses.delete('0x0000000000000000000000000000000000000000');
      uniqueAddresses.delete('0xffffffffffffffffffffffffffffffffffffffff');
      uniqueAddresses.delete('0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
      uniqueAddresses.delete('0x1000000000000000000000000000000000000000');
      const uniqueAddressesArray = Array.from(uniqueAddresses.values());
      console.log('uniqueAddresses', uniqueAddressesArray.length);
      runAnalysis(uniqueAddressesArray);
    }
    fetchReadAndFindAddresses(scripts);
  }

  function runAnalysis(addresses : string[]){
    if (addresses.length === 0) {
      console.log('no addresses detected!');
      setLoading(false);
      setNoAddressDetected(true);
      setAnalysisDone(true);
      return;
    }
    async function callServer(addresses : string[]) {
      const data = {addresses: addresses};
      const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/analyze`, data);
      // console.log('received addresses', res.data);
      setUnverifiedContracts(res.data.unverifiedContracts);
      setVerifiedContracts(res.data.verifiedContracts);
      setVerifiedERC20s(res.data.verifiedERC20s);
      const p = (1-(res.data.unverifiedContracts.length / (res.data.verifiedContracts.length + res.data.unverifiedContracts.length)))*100;
      setPercent(p);
      setPgColor(percentToColor(p));
      setLoading(false);
      setAnalysisDone(true);
    }
    callServer(addresses);
  }

  async function livenessCheck() {
    const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/ping`);
    if (res.data === 'Server is running') {
      setServerLive(true);
    }
  }

  useEffect(() => {
    // const placeHolderData = JSON.parse(JSON.stringify(unverifiedPlaceholder));
    // setNonVerified(placeHolderData);
    livenessCheck();
    chrome.tabs && chrome.tabs.query({
    }, (tabs) => {
      const activeTab = tabs.find((tab) => tab.active);
      if (activeTab) {
        console.log('activeTab', activeTab);
        setActiveTab(activeTab);
        refreshTabData(activeTab);
      }else{
        console.log('no active tab');
      }
    });
  }, []);

  const erc20PageProps: ERC20sPageProps = {
    showTokens: showTokens,
    setShowTokens: setShowTokens,
    serverLive: serverLive,
    erc20s: verifiedERC20s,
  };

  const nftsPageProps: ERC20sPageProps = {
    showTokens: showNfts,
    setShowTokens: setShowNfts,
    serverLive: serverLive,
    erc20s: nftTokens,
  };

  const unverifiedContractPageProps : ContractsPageProps = {
    contracts: unverifiedContracts,
    showContracts: showUnverifiedContracts,
    setShowContracts: setShowUnverifiedContracts,
  };

  const verifiedContractPageProps : ContractsPageProps = {
    contracts: verifiedContracts,
    showContracts: showVerifiedContracts,
    setShowContracts: setShowVerifiedContracts,
  };

  return (
    <>
      {showTokens && <NewPage {...erc20PageProps}/>}
      {showNfts && <NewPage {...nftsPageProps}/>}
      {showUnverifiedContracts && <UnverifiedContracts {...unverifiedContractPageProps}/>}
      {showVerifiedContracts && <VerifiedContracts {...verifiedContractPageProps}/>}
      {!showVerifiedContracts && !showUnverifiedContracts && !showNfts &&!showTokens &&
        <body className='w-[340px] bg-slate-50'>
          <Header/>
          <div className='py-2'>
            <img src={tabData?.favIconUrl} alt="favicon" className='w-10 h-10 container'/>
            <div className="text-sm text-gray text-center py-2">
            Connected to: <br/><a className="text-blue-400" href={tabData?.url} target="_blank" rel="noreferrer">{tabData?.url}</a>
            </div>
          </div>
          {!analysisDone && !loading &&
          <div className='grid grid-cols-3 pb-5'>
            <div></div>
            <div className="">
              <button
                type="button"
                className="text-2xl inline-flex items-center rounded-full border border-transparent bg-green-600 p-3 text-white shadow-sm hover:bg-green-700"
                onClick={(e) => {e.preventDefault(); runScan();}}
              >
                Scan
                <MagnifyingGlassIcon className="ml-2 h-6 w-6" aria-hidden="true"/>
              </button>
            </div>
            <div></div>
          </div>
          }
          {loading && 
            <div className="flex justify-center pb-2">
              <img src={blocksGif} className='h-20 w-20'/>
            </div>
          }
          {noAddressDetected && analysisDone && !loading && 
          <>
            <div className='flex items-center ml-7'>
              <SignalSlashIcon className="m-2 h-8 w-8 text-gray-800 inline" aria-hidden="true" />
              <div className="text-lg font-semibold">
              No addresses detected
              </div>
            </div>
          </>
          }
          {/*!noAddressDetected && analysisDone && !loading */}
          {!noAddressDetected && analysisDone && !loading && 
          <>
            <div className="grid grid-cols-3 gap-0 pb-5">
              <div></div>
              {percent < 100 &&
              <div className='flex pl-1'>
                <Circle className='absolute h-[100px] w-[100px] mx-1' percent={percent} strokeWidth={8} strokeColor={pgColor} trailWidth={0.01} strokeLinecap="round"/>
                <div className={'pl-[30px] pt-[35px] z-10 font-bold text-2xl '+'text-['+pgColor+']'}>
                  {percent.toFixed(0)}%
                </div>
              </div>
              }
              {percent === 100 &&
              <div className='flex pl-1'>
                <Circle className='absolute h-[100px] w-[100px] mx-1' percent={percent} strokeWidth={8} strokeColor={pgColor} trailWidth={0.01} strokeLinecap="round"/>
                <div className={'pl-[24px] pt-[35px] z-10 font-bold text-2xl '+'text-['+pgColor+']'}>
                  {percent.toFixed(0)}%
                </div>
              </div>
              }
              <div></div>
            </div>
            <div className='text-lg font-semibold text-center pt-6'>
              Verified over {unverifiedContracts.length+verifiedContracts.length} contracts analysed.
            </div>
            <div className='text-center my-2 mx-2'>
              <dl className="mt-5 grid grid-cols-2 gap-1 sm:grid-cols-3">
                {unverifiedContracts.length > 0 &&
                <div className="rounded-md bg-red-200 border-[0.5px] shadow-md px-4 py-5 sm:p-6 hover:bg-red-100 hover:border-[0.5px] hover:border-red-500" onClick={(e) => {e.preventDefault();setShowUnverifiedContracts(!showUnverifiedContracts);}}>
                  <dt className="text-xs text-red-500">Unverified Contracts</dt>
                  <dd className="mt-1 text-sm font-semibold tracking-tight text-red-500">{unverifiedContracts.length}</dd>
                </div>
                }
                {verifiedContracts.length > 0 &&
                <div className="rounded-md bg-white border-[0.5px] shadow-md px-4 py-5 sm:p-6 hover:bg-blue-100 hover:border-[0.5px] hover:border-blue-500" onClick={(e) => {e.preventDefault();setShowVerifiedContracts(!showVerifiedContracts);}}>
                  <dt className="text-xs text-blue-500">Verified Contracts</dt>
                  <dd className="mt-1 text-sm font-semibold tracking-tight text-blue-500">{verifiedContracts.length}</dd>
                </div>
                }
                <div className="rounded-md bg-white border-[0.5px] shadow-md px-4 py-5 sm:p-6 hover:bg-blue-100 hover:border-[0.5px] hover:border-blue-500" onClick={(e) => {e.preventDefault();setShowTokens(!showTokens);}}> 
                  <dt className="text-xs text-blue-500">Verified ERC20s</dt>
                  <dd className="mt-1 text-sm font-semibold tracking-tight text-blue-500">{verifiedERC20s.length}</dd>
                </div>
                {nftTokens.length > 0 &&
                <div className="rounded-md bg-white border-[0.5px] shadow-md px-4 py-5 sm:p-6 hover:bg-blue-100 hover:border-[0.5px] hover:border-blue-500" onClick={(e) => {e.preventDefault();setShowNfts(!showNfts);}}>
                  <dt className="text-xs text-blue-500">NFT addresses</dt>
                  <dd className="mt-1 text-sm font-semibold tracking-tight text-blue-500">{nftTokens.length}</dd>
                </div>
                }
                <div className="rounded-md bg-white border-[0.5px] shadow-md px-4 py-5 sm:p-6 hover:bg-blue-100 hover:border-[0.5px] hover:border-blue-500" onClick={(e)=>{e.preventDefault();}}>
                  <dt className="text-xs text-blue-500">Other Addresses</dt>
                  <dd className="mt-1 text-sm font-semibold tracking-tight text-blue-500">{others.length}</dd>
                </div>
              </dl>
            </div>
          </>
          }
        </body>
      }
    </>
  );
}
export default App;
