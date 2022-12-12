import React, { useEffect } from 'react';
import './index.css';
import {useState} from 'react';
import axios from 'axios';
import { SignalSlashIcon, CheckBadgeIcon, MagnifyingGlassIcon, ShieldExclamationIcon} from '@heroicons/react/20/solid';
import {ContractsPageProps,TabData, TokenListToken,ERC20sPageProps,AddressCollection} from './structs';
import NewPage from './Tokens';
import Header from './Header';
import Contracts from './Contracts';
import unverifiedPlaceholder from './unverifiedcontracts.json';
import blocksGif from './blocks.gif';
import { Circle } from 'rc-progress';
import {percentToColor} from './helpers';
import ERC20s from './Tokens';


function getAddresses() {
  const scripts = document.getElementsByTagName('script');
  console.log('scripts', scripts);
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
  const [tabData, setTabData] = useState<TabData| null>({favIconUrl: 'https://static.debank.com/image/matic_nft/local_url/5df849b06af0e9ea7bcbb8c1804304a4/59211315b16c0553e7e63bb5f536d37e.png', title: '', url: 'unknown'});
  const [serverLive, setServerLive] = useState<boolean>(false);
  const [noAddressDetected, setNoAddressDetected] = useState<boolean>(false);
  const [revealDetailedAnalysis, setRevealDetailedAnalysis] = useState<boolean>(false);

  const [analysisDone, setAnalysisDone] = useState<boolean>(false);

  const [percent, setPercent] = useState<number>(100);
  const [pgColor, setPgColor] = useState<string>('#3498db');



  const [verifiedERC20s, setVerifiedERC20s] = useState<TokenListToken[]>([]);


  const [indexingNecessary, setIndexingNecessary] = useState<boolean>(false);

  const [showTokens, setShowTokens] = useState<boolean>(false);
  const [showNfts, setShowNfts] = useState<boolean>(false);
  const [showUnverifiedContracts, setShowUnverifiedContracts] = useState<boolean>(false);
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
      function(request, sender) {
        console.log('sender object:', sender);
        // console.log('messages received', request.noAddressDetected);
        console.log('scripts', request.scripts);
        readAllScripts(request.scripts);
      }
    );
  }

  function readAllScripts(scripts: string[]){
    console.log('readAllScripts() called', scripts.length);
    console.log('readAllScripts() called', scripts[0]);
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
    setLoading(false);
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

  return (
    <>
      {showTokens && <NewPage {...erc20PageProps}/>}
      {showNfts && <NewPage {...nftsPageProps}/>}
      {showUnverifiedContracts && <Contracts {...unverifiedContractPageProps}/>}
      {!showUnverifiedContracts && !showNfts &&!showTokens &&
        <body className='w-[340px] bg-white border-2'>
          <Header/>
          <div className='py-2'>
            <img src={tabData?.favIconUrl} alt="favicon" className='w-10 h-10 container'/>
            <div className="text-sm text-gray text-center py-2">
            Connected to: <a className="text-blue-400" href={tabData?.url} target="_blank" rel="noreferrer">{tabData?.url}</a>
            </div>
          </div>
          {!analysisDone && !loading &&
          <div className='grid grid-cols-3 py-2'>
            <div></div>
            <div className="ml-1">
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
            <div className="flex justify-center">
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
          <div className="grid grid-cols-3 gap-0">{/* Content goes here */}
            <div className='flex pl-5'>
              <Circle className='absolute h-[80px] w-[80px] mx-1' percent={percent} strokeWidth={9} strokeColor={pgColor} trailWidth={0.01} strokeLinecap="round"/>
              <div className="pl-[22px] pt-[25.5px] z-10 font-bold text-lg" color='red'>
                {percent.toFixed(0)}%
              </div>
            </div>
            <div className='text-lg font-semibold col-span-2 pt-6'>
              verified over {unverifiedContracts.length+verifiedContracts.length} contracts analysed.
              <div
                className='text-blue-700 cursor-pointer underline text-sm py-3 font-bold'
                onClick={(e) => {e.preventDefault(); setRevealDetailedAnalysis(!revealDetailedAnalysis);}}
              >
                {!revealDetailedAnalysis? ('Reveal') : ('Hide')} detailed analysis
              </div>
            </div>
          </div>
          }
          {revealDetailedAnalysis && !noAddressDetected && analysisDone && !loading && 
            <div className='text-center my-2 mx-2'>
              <dl className="mt-5 grid grid-cols-2 gap-1 sm:grid-cols-3">
                <div className="rounded-md bg-white border-[0.5px] shadow-md px-4 py-5 sm:p-6 hover:bg-blue-100 hover:border-[0.5px] hover:border-blue-500" onClick={(e) => {e.preventDefault();setShowUnverifiedContracts(!showUnverifiedContracts);}}>
                  <dt className="text-xs text-blue-500">Unverified Contracts</dt>
                  <dd className="mt-1 text-sm font-semibold tracking-tight text-blue-500">{unverifiedContracts.length}</dd>
                </div>
                <div className="rounded-md bg-white border-[0.5px] shadow-md px-4 py-5 sm:p-6 hover:bg-blue-100 hover:border-[0.5px] hover:border-blue-500" onClick={(e) => {e.preventDefault();setShowTokens(!showTokens);}}> 
                  <dt className="text-xs text-blue-500">Verified ERC20s</dt>
                  <dd className="mt-1 text-sm font-semibold tracking-tight text-blue-500">{verifiedERC20s.length}</dd>
                </div>
                <div className="rounded-md bg-white border-[0.5px] shadow-md px-4 py-5 sm:p-6 hover:bg-blue-100 hover:border-[0.5px] hover:border-blue-500" onClick={(e) => {e.preventDefault();setShowNfts(!showNfts);}}>
                  <dt className="text-xs text-blue-500">NFT addresses</dt>
                  <dd className="mt-1 text-sm font-semibold tracking-tight text-blue-500">{nftTokens.length}</dd>
                </div>
                <div className="rounded-md bg-white border-[0.5px] shadow-md px-4 py-5 sm:p-6 hover:bg-blue-100 hover:border-[0.5px] hover:border-blue-500" onClick={(e)=>{e.preventDefault();}}>
                  <dt className="text-xs text-blue-500">Other Addresses</dt>
                  <dd className="mt-1 text-sm font-semibold tracking-tight text-blue-500">{others.length}</dd>
                </div>
              </dl>
            </div>
          }
          {/*{!loading && activeAddresses.length > 0 && !indexingNecessary && 
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
            { !loading && activeAddresses.length > 0 && indexingNecessary && 
            <div className='ml-5 flex items-center'>
              <MagnifyingGlassIcon className="m-1 h-8 w-8 text-red-800 inline" aria-hidden="true" />
              <div className="text-lg font-semibold">
              Indexing.. Please wait a few minutes and refresh.
              </div>
            </div>
            }
          </div>
          <hr/>
        */}
          <div className='pl-1 py-1 text-center text-xs font-light'>
          Metascan all rights reserved.
          </div>     
        </body>
      }
    </>
  );
}
export default App;
