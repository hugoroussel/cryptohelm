import React, { useEffect } from 'react';
import './index.css';
import {useState} from 'react';
import axios from 'axios';
import { SignalSlashIcon, ExclamationTriangleIcon} from '@heroicons/react/20/solid';
import {ContractsPageProps,TabData, TokenListToken,ERC20sPageProps,AddressCollection} from './structs';
import Tokens from './Tokens';
import Header from './Header';
import UnverifiedContracts from './UnverifiedContracts';
import VerifiedContracts from './VerifiedContracts';
import EOAs from './EOAs';
import blocksGif from './blocks.gif';
import { Circle } from 'rc-progress';
import {percentToColor, getChainsWithUnverifiedContracts,getImageOfLogoUsingChainId, getNameOfChainWithChainId} from './helpers';
import unverifiedPlaceholder from './unverifiedcontracts.json';
import logo from './logo192.png';

function getAddresses() {
  // get the inner html of the page
  const html = document.documentElement.innerHTML;
  console.log('html', html.length);
  const addressesFound: string[]= [];
  // find addresses in the inner html of the page
  const found = html.match(/0x[a-fA-F0-9]{40}/g);
  if (found !== null) {
    for (let i = 0; i < found.length; i++) {
      console.log('found address', found[i]);
      addressesFound.push(found[i]);
    }
  }
  const uniqueAddresses = new Set(addressesFound);
  const uniqueAddressesArray = Array.from(uniqueAddresses.values());
  console.log('found ', uniqueAddressesArray.length, ' addresses on the page');
  
  const scripts = document.getElementsByTagName('script');
  const sources = [] as string[];
  if (scripts !== undefined) {
    console.log('found ', scripts.length, ' scripts on the page');
    for (let i = 0; i < scripts.length; i++) {
      sources.push(scripts[i].src);
    }
  }

  chrome.runtime.sendMessage({scripts: sources, innerHtmlAddresses: uniqueAddressesArray});
}

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [indexingNecessary, setIndexingNecessary] = useState<boolean>(false);
  const [tabData, setTabData] = useState<TabData>({favIconUrl: 'https://i.imgur.com/8RetlRE.png', title: '', url: 'unknown'});
  const [serverLive, setServerLive] = useState<boolean>(false);
  const [noAddressDetected, setNoAddressDetected] = useState<boolean>(false);

  const [analysisDone, setAnalysisDone] = useState<boolean>(false);

  const [percent, setPercent] = useState<number>(100);
  const [pgColor, setPgColor] = useState<string>('#3498db');


  // Pages
  const [showUnverifiedContracts, setShowUnverifiedContracts] = useState<boolean>(false);
  const [showVerifiedContracts, setShowVerifiedContracts] = useState<boolean>(false);
  const [showTokens, setShowTokens] = useState<boolean>(false);
  const [showEOAs, setShowEOAs] = useState<boolean>(false);
  const [showNfts, setShowNfts] = useState<boolean>(false);

  // Data states
  const [allAddressesOfPage, setAllAddresesOfPage] = useState<string[]>([]);
  const [verifiedERC20s, setVerifiedERC20s] = useState<TokenListToken[]>([]);
  const [amountToIndex, setAmountToIndex] = useState<number>(0);
  const [others, setOthers] = useState<AddressCollection[]>([]);
  const [nftTokens, setNftTokens] = useState<TokenListToken[]>([]);
  const [chainsWithUnverifiedContracts, setChainsWithUnverifiedContracts] = useState<number[]>([]);

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
    console.log('running scan...');
    setLoading(true);
    runAnalysis(allAddressesOfPage);
  }

  useEffect(() => {
    getInjectedAddresses();
  }, [tabData]);


  useEffect(() => {
    runScan();
  }, [allAddressesOfPage]);


  function getInjectedAddresses(){
    if(activeTab.id === 0) {
      return;
    }
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
        console.log('got message from content script', request);
        setAllAddresesOfPage(request.innerHtmlAddresses);
        readAllScripts(request.scripts);
      }
    );
  }

  function readAllScripts(scripts: string[]){
    console.log('reading scripts of page to detect addresses...');
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
      // we do this to have also the addresses of the inner html without duplicates
      const newArray = Array.from(uniqueAddresses).concat(allAddressesOfPage);
      const uniqueAddresses2 = new Set(newArray);
      const uniqueAddressesArray = Array.from(uniqueAddresses2.values());
      console.log('uniqueAddresses', uniqueAddressesArray.length);
      setAllAddresesOfPage(uniqueAddressesArray );
    }
    fetchReadAndFindAddresses(scripts);
  }

  function runAnalysis(addresses : string[]){
    console.log('running analysis...');
    if (addresses.length === 0) {
      console.log('no addresses detected!');
      setLoading(false);
      setNoAddressDetected(true);
      setAnalysisDone(true);
      return;
    }
    console.log('running analysis with addresses', addresses.length);
    async function callServer(addresses : string[]) {
      const data = {addresses: addresses};
      const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/analyze`, data);

      if (res.data.amountToIndex > 0){
        setAnalysisDone(true);
        setLoading(false);
        setIndexingNecessary(true);
        setAmountToIndex(res.data.amountToIndex);
        return;
      }
      const sortedUnverifiedContracts = res.data.unverifiedContracts.sort((a :AddressCollection, b :AddressCollection) => {
        return a.unverifiedon[0] - b.unverifiedon[0];
      });
      setUnverifiedContracts(sortedUnverifiedContracts);
      console.log('sortedUnverifiedContracts', sortedUnverifiedContracts);
      const sortedVerifiedContracts = res.data.verifiedContracts.sort((a: AddressCollection, b :AddressCollection) => b.verifiedon[0] - a.verifiedon[0]);
      setVerifiedContracts(sortedVerifiedContracts);
      const sortedTokensByName = res.data.verifiedERC20s.sort((a: TokenListToken, b :TokenListToken) => a.name.localeCompare(b.name));
      setVerifiedERC20s(sortedTokensByName);


      setChainsWithUnverifiedContracts(getChainsWithUnverifiedContracts(res.data.unverifiedContracts));
      setOthers(res.data.eoas);
      const p = (1-(res.data.unverifiedContracts.length / (res.data.verifiedContracts.length + res.data.unverifiedContracts.length)))*100;
      setPercent(p);
      setPgColor(percentToColor(p));
      setLoading(false);
      setAnalysisDone(true);
      console.log('analysis done', loading, analysisDone);
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
    /*
    const placeHolderData = JSON.parse(JSON.stringify(unverifiedPlaceholder));
    setUnverifiedContracts(placeHolderData);
    setChainsWithUnverifiedContracts(getChainsWithUnverifiedContracts(placeHolderData));
    */
    
    async function tokenlistPlaceholder(){
      // get the 1inch tokenlist
      const res = await axios.get('https://tokens.1inch.eth.link');
      const tokens = res.data.tokens;
      setVerifiedERC20s(tokens);
    }
    tokenlistPlaceholder();
    
    
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
    tabData: tabData,
  };

  const nftsPageProps: ERC20sPageProps = {
    showTokens: showNfts,
    setShowTokens: setShowNfts,
    serverLive: serverLive,
    erc20s: nftTokens,
    tabData: tabData,
  };

  const unverifiedContractPageProps : ContractsPageProps = {
    contracts: unverifiedContracts,
    showContracts: showUnverifiedContracts,
    setShowContracts: setShowUnverifiedContracts,
    tabData: tabData,
  };

  const verifiedContractPageProps : ContractsPageProps = {
    contracts: verifiedContracts,
    showContracts: showVerifiedContracts,
    setShowContracts: setShowVerifiedContracts,
    tabData: tabData,
  };

  const EOAsPageProps : ContractsPageProps = {
    contracts: others,
    showContracts: showEOAs,
    setShowContracts: setShowEOAs,
    tabData: tabData,
  };

  return (
    <>
      {showTokens && <Tokens {...erc20PageProps}/>}
      {showNfts && <Tokens {...nftsPageProps}/>}
      {showEOAs && <EOAs {...EOAsPageProps}/>}
      {showUnverifiedContracts && <UnverifiedContracts {...unverifiedContractPageProps}/>}
      {showVerifiedContracts && <VerifiedContracts {...verifiedContractPageProps}/>}
      {!showEOAs && !showVerifiedContracts && !showUnverifiedContracts && !showNfts && !showTokens &&
        <body className='w-[340px] bg-slate-50'>
          <Header {...tabData}/>
          {
            <div className='grid grid-cols-3 pb-2'>
              <div></div>
              <div className="">
                <img src={logo} className='h-[90px] w-[80px] container mb-6'/>
              </div>
              <div></div>
            </div>
          }
          {loading && 
            <div className="flex justify-center pb-2">
              <img src={blocksGif} className='h-20 w-20'/>
            </div>
          }
          {!loading && allAddressesOfPage.length == 0 && analysisDone &&
          <>
            <div className='flex items-center ml-7'>
              <SignalSlashIcon className="m-2 h-8 w-8 text-gray-800 inline" aria-hidden="true" />
              <div className="text-lg font-semibold">
              No addresses detected
              </div>
            </div>
          </>
          }
          {/*!loading && indexingNecessary && analysisDone 
          */}
          { !loading && indexingNecessary && analysisDone &&
          <>
            <div className='text-lg font-semibold text-center p-2 flex'>
              <ExclamationTriangleIcon className='w-15 h-15'/>
              We discovered {amountToIndex} new addresses needing indexing out of total {allAddressesOfPage.length} addresses. Estimated waiting time ~5 minutes.
            </div>
          </>
          }
          {/*
          allAddressesOfPage.length !== 0 && analysisDone && !loading && !indexingNecessary 
          */}
          {allAddressesOfPage.length !== 0 && analysisDone && !loading && !indexingNecessary &&
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
            <div className='text-xs text-center'>Found unverified contracts on the following chains: <br/>
              {chainsWithUnverifiedContracts.map((chainId, index) => {

                if (index === chainsWithUnverifiedContracts.length-1) {
                  return (
                    <span key={chainId}>{getNameOfChainWithChainId(chainId)}</span>
                  );
                } else {
                  return (
                    <span key={chainId}>{getNameOfChainWithChainId(chainId)}, </span>
                  );
                }
              })}
            </div>
            <div className='text-center my-2 mx-2'>
              <dl className="mt-5 grid grid-cols-2 gap-1 sm:grid-cols-3">
                {unverifiedContracts.length > 0 &&
                <div className="rounded-md bg-red-200 border-[0.5px] shadow-md px-4 py-5 sm:p-6 hover:bg-red-100 hover:border-[0.5px] hover:border-red-500" onClick={(e) => {e.preventDefault();setShowUnverifiedContracts(!showUnverifiedContracts);}}>
                  <dt className="text-xs text-red-500">Unverified Contracts</dt>
                  <dd className="mt-1 text-sm font-bold tracking-tight text-red-500">{unverifiedContracts.length}</dd>
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
                  <div className='flex'>
                    {/*
                      verifiedERC20s.slice(8,15).map((token) => {
                        return (
                          <img src={token.logoURI} className="w-3 h-3 mr-0.5" key={token.address}/>);
                        })*/}
                  </div>     
                </div>
                {nftTokens.length > 0 &&
                <div className="rounded-md bg-white border-[0.5px] shadow-md px-4 py-5 sm:p-6 hover:bg-blue-100 hover:border-[0.5px] hover:border-blue-500" onClick={(e) => {e.preventDefault();setShowNfts(!showNfts);}}>
                  <dt className="text-xs text-blue-500">NFT addresses</dt>
                  <dd className="mt-1 text-sm font-semibold tracking-tight text-blue-500">{nftTokens.length}</dd>
                </div>
                }
                <div className="rounded-md bg-white border-[0.5px] shadow-md px-4 py-5 sm:p-6 hover:bg-blue-100 hover:border-[0.5px] hover:border-blue-500" onClick={(e)=>{e.preventDefault();setShowEOAs(!showEOAs);}}>
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
