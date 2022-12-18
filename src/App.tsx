import React, { useEffect } from 'react';
import './index.css';
import {useState} from 'react';
import axios from 'axios';
import { SignalSlashIcon, ExclamationTriangleIcon,ArrowTrendingUpIcon, ShieldCheckIcon, UserIcon, DocumentCheckIcon, CheckBadgeIcon} from '@heroicons/react/20/solid';
import {AccountPageProps,ContractsPageProps,TabData, TokenListToken,ERC20sPageProps,AddressCollection, AppTab, NavbarProps, PhishingWarningPageProps} from './types/types';
import Tokens from './Tokens';
import Header from './components/Header';
import Navbar from './components/Navbar';
import UnverifiedContracts from './UnverifiedContracts';
import VerifiedContracts from './VerifiedContracts';
import FAQ from './FAQ';
import EOAs from './EOAs';
import Stats from './Stats';
import Account from './Account';
import PhishingWarning from './PhishingWarning';
import blocksGif from './blocks.gif';
import { Circle } from 'rc-progress';
import {percentToColor, getChainsWithUnverifiedContracts, getNameOfChainWithChainId} from './helpers';
import Logo from './components/Logo';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import CountUp from 'react-countup';
import { tab } from '@testing-library/user-event/dist/tab';

const tabs = [
  { name: 'shield', href: '#', icon: ShieldCheckIcon, current: true },
  { name: 'stats', href: '#', icon: ArrowTrendingUpIcon, current: false },
  { name: 'account', href: '#', icon: UserIcon, current: false },
  { name: 'info', href: '#', icon: QuestionMarkCircleIcon, current: false },
];

function getAddresses() {
  // get the inner html of the page
  const html = document.documentElement.innerHTML;
  const addressesFound: string[]= [];
  // find addresses in the inner html of the page
  const found = html.match(/0x[a-fA-F0-9]{40}/g);
  if (found !== null) {
    for (let i = 0; i < found.length; i++) {
      addressesFound.push(found[i]);
    }
  }
  const uniqueAddresses = new Set(addressesFound);
  const uniqueAddressesArray = Array.from(uniqueAddresses.values());
  
  const scripts = document.getElementsByTagName('script');
  const sources = [] as string[];
  if (scripts !== undefined) {
    for (let i = 0; i < scripts.length; i++) {
      sources.push(scripts[i].src);
    }
  }

  chrome.runtime.sendMessage({scripts: sources, innerHtmlAddresses: uniqueAddressesArray});
}

function App() {

  // App state
  const [loading, setLoading] = useState<boolean>(true);
  const [indexingNecessary, setIndexingNecessary] = useState<boolean>(false);
  const [tabData, setTabData] = useState<TabData>({favIconUrl: 'https://i.imgur.com/8RetlRE.png', title: '', url: 'unknown'});
  const [serverLive, setServerLive] = useState<boolean>(false);
  const [noAddressDetected, setNoAddressDetected] = useState<boolean>(false);
  const [analysisDone, setAnalysisDone] = useState<boolean>(false);
  const [percent, setPercent] = useState<number>(100);
  const [pgColor, setPgColor] = useState<string>('#3498db');
  const [appTabs, setAppTabs] = useState<AppTab[]>([]);

  // Pages
  const [showUnverifiedContracts, setShowUnverifiedContracts] = useState<boolean>(false);
  const [showVerifiedContracts, setShowVerifiedContracts] = useState<boolean>(false);
  const [showTokens, setShowTokens] = useState<boolean>(false);
  const [showEOAs, setShowEOAs] = useState<boolean>(false);
  const [showNfts, setShowNfts] = useState<boolean>(false);
  const [showAccount, setShowAccount] = useState<boolean>(false);
  const [showFaq, setShowFaq] = useState<boolean>(false);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [showPhishingDetected, setShowPhishingDetected] = useState<boolean>(false);

  // Data states
  const [allAddressesOfPage, setAllAddresesOfPage] = useState<string[]>([]);
  const [verifiedERC20s, setVerifiedERC20s] = useState<TokenListToken[]>([]);
  const [amountToIndex, setAmountToIndex] = useState<number>(0);
  const [others, setOthers] = useState<AddressCollection[]>([]);
  const [nfts, setNfts] = useState<TokenListToken[]>([]);
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
    if(activeTab.id === 0) {
      return;
    }
    const urlCleaned = activeTab?.url?.split('/').slice(0, 3).join('/');
    const newTabData = {favIconUrl: activeTab?.favIconUrl, title: activeTab?.title, url: urlCleaned} as TabData;
    detectPhishing(urlCleaned || '');
    setTabData(newTabData);
  }

  function detectPhishing(url :string){
    async function callCryptoScamsDB(){
      // remove the http or https 
      url = url.replace('https://','');
      url = url.replace('http://','');
      const res = await axios.get('https://api.cryptoscamdb.org/v1/check/'+url);
      if(res.data.result.status === 'blocked'){
        warningPhishingPageProps.description = res.data.result.description;
        setShowPhishingDetected(true);
      }
    }
    callCryptoScamsDB();
  }

  function runScan(){
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
        // get cached addresses from the local storage
        const cache = localStorage.getItem('cache');
        const parsedCache = JSON.parse(cache || '[]');
        if(parsedCache.url === undefined || parsedCache.url !== tabData.url){
          setAllAddresesOfPage(request.innerHtmlAddresses);
          readAllScripts(request.scripts);
        } else {
          setAllAddresesOfPage(parsedCache.addresses);
        }
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
      setAllAddresesOfPage(uniqueAddressesArray );
      // save data in local storage
      const data = {addresses: uniqueAddressesArray, url: tabData.url};
      localStorage.setItem('cache', JSON.stringify(data));
    }
    fetchReadAndFindAddresses(scripts);
  }

  function runAnalysis(addresses : string[]){
    if (addresses.length === 0) {
      setLoading(false);
      setNoAddressDetected(true);
      setAnalysisDone(true);
      return;
    }
    setNoAddressDetected(false);
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
      const sortedVerifiedContracts = res.data.verifiedContracts.sort((a: AddressCollection, b :AddressCollection) => b.verifiedon[0] - a.verifiedon[0]);
      setVerifiedContracts(sortedVerifiedContracts);
      const sortedTokensByName = res.data.verifiedERC20s.sort((a: TokenListToken, b :TokenListToken) => a.name.localeCompare(b.name));
      setVerifiedERC20s(sortedTokensByName);
      const sortedNfts = res.data.nfts.sort((a: TokenListToken, b :TokenListToken) => a.name.localeCompare(b.name));
      setNfts(sortedNfts);
      setChainsWithUnverifiedContracts(getChainsWithUnverifiedContracts(res.data.unverifiedContracts));
      setOthers(res.data.eoas);
      const p = (1-(res.data.unverifiedContracts.length / (res.data.verifiedContracts.length + res.data.unverifiedContracts.length)))*100;
      setPercent(p);
      setPgColor(percentToColor(p));
      setLoading(false);
      setAnalysisDone(true);
      // add the url to the local storage
      const urls = JSON.parse(localStorage.getItem('urls') || '[]');
      let unverifiedContractsFoundSoFar = JSON.parse(localStorage.getItem('unverifiedContractsAmount') || '0');
      // check if the url is already in the list
      if (urls.includes(tabData.url)){
        return;
      }
      const newUrls = [...urls, tabData.url];
      localStorage.setItem('urls', JSON.stringify(newUrls));
      unverifiedContractsFoundSoFar += res.data.unverifiedContracts.length;
      localStorage.setItem('unverifiedContractsAmount', JSON.stringify(unverifiedContractsFoundSoFar));
    }
    callServer(addresses);
  }

  async function livenessCheck() {
    const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/ping`);
    if (res.data === 'Server is running') {
      setServerLive(true);
    }
  }

  function prepareTweet(){
    const chains = getChainsWithUnverifiedContracts(unverifiedContracts);
    const res = 'It%20seems%20'+tabData.url+'%20source%20code%20contains%20'+unverifiedContracts.length+'%20unverified%20contracts%20on%20'+chains.length+'%20different%20chains.%20To%20see%20the%20full%20list,%20download%20the%20Crypto%20Helm%20Chrome%20Extension.';
    return 'https://twitter.com/intent/tweet?text='+res; 
  }

  useEffect(() => {
    /*
    const placeHolderData = JSON.parse(JSON.stringify(unverifiedPlaceholder));
    setUnverifiedContracts(placeHolderData);
    setChainsWithUnverifiedContracts(getChainsWithUnverifiedContracts(placeHolderData)); 
    async function tokenlistPlaceholder(){
      // get the 1inch tokenlist
      const res = await axios.get('https://tokens.1inch.eth.link');
      const tokens = res.data.tokens;
      setVerifiedERC20s(tokens);
    }
    tokenlistPlaceholder();
    */
    setAppTabs(tabs);
    livenessCheck();
    // detectPhishing('metamaskconnect.online');
    chrome.tabs && chrome.tabs.query({
    }, (tabs) => {
      const activeTab = tabs.find((tab) => tab.active);
      if (activeTab) {
        setActiveTab(activeTab);
        refreshTabData(activeTab);
      }
    });
  }, []);

  const warningPhishingPageProps :PhishingWarningPageProps = {
    setShowWarningPage: setShowPhishingDetected,
    showWarningPage: showPhishingDetected,
    tab: activeTab,
    tabData: tabData,
    description: '',
  };

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
    erc20s: nfts,
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

  const NavbarProps : NavbarProps = {
    appTabs: appTabs,
    setAppTabs: setAppTabs,
    showAccount: showAccount,
    setShowAccount: setShowAccount,
    setShowFAQ: setShowFaq,
    showFAQ: showFaq,
    showStats: showStats,
    setShowStats: setShowStats,
  };

  const AccountPageProps : AccountPageProps = {
    tabData: tabData,
    navbarProps: NavbarProps,
  };

  const StatsPageProps : AccountPageProps = {
    tabData: tabData,
    navbarProps: NavbarProps,
  };

  return (
    <>
      {showTokens && <Tokens {...erc20PageProps}/>}
      {showNfts && <Tokens {...nftsPageProps}/>}
      {showEOAs && <EOAs {...EOAsPageProps}/>}
      {showUnverifiedContracts && <UnverifiedContracts {...unverifiedContractPageProps}/>}
      {showVerifiedContracts && <VerifiedContracts {...verifiedContractPageProps}/>}
      {showAccount && <Account {...AccountPageProps}/>}
      {showFaq && <FAQ {...AccountPageProps}/>}
      {showStats && <Stats {...StatsPageProps}/>}
      {showPhishingDetected && <PhishingWarning {...warningPhishingPageProps}/>}
      {!showPhishingDetected && !showStats && !showFaq && !showAccount && !showEOAs && !showVerifiedContracts && !showUnverifiedContracts && !showNfts && !showTokens &&
        <body className='w-[380px] bg-slate-50'>
          <Header {...tabData}/>
          <Navbar {...NavbarProps}/>
          {/* 
          
          */}
          { noAddressDetected &&
            <Logo/>
          }
          {loading && 
            <div className="flex justify-center pb-2">
              <img src={blocksGif} className='h-20 w-20'/>
            </div>
          }
          {/*
          
        */}
          {!loading && allAddressesOfPage.length == 0 && analysisDone && noAddressDetected &&
          <>
            <div className='flex items-center ml-14'>
              <SignalSlashIcon className="m-2 h-8 w-8 text-gray-800 inline" aria-hidden="true" />
              <div className="text-lg font-semibold">
              No addresses detected
              </div>
            </div>
          </>
          }
          {/**/}
          {!loading && indexingNecessary && analysisDone &&
          <>
            <div className='text-lg font-semibold text-center p-2'>
              <div className='grid grid-cols-3'>
                <div></div>
                <div><ExclamationTriangleIcon className='w-12 h-12 ml-6'/></div>
                <div></div>
              </div>
              Indexing {amountToIndex} new addresses out of {allAddressesOfPage.length} addresses. Expected wait time ~{Math.round((amountToIndex * 2) / 60)} minutes
            </div>
          </>
          }
          {/*
          
          */}
          { allAddressesOfPage.length !== 0 && analysisDone && !loading && !indexingNecessary &&
          <>

            <div className="grid grid-cols-3 gap-0 pb-5">
              <div></div>
              {percent < 100 &&
              <div className='flex pl-1'>
                <Circle className='absolute h-[100px] w-[100px] mx-1' percent={percent} strokeWidth={8} strokeColor={pgColor} trailWidth={0.01} strokeLinecap="round"/>
                <div className={'pl-[30px] pt-[35px] z-10 font-bold text-2xl '+'text-['+pgColor+']'}>
                  <CountUp
                    start={0}
                    duration={0.5}
                    end={Number(percent.toFixed(0))}
                    preserveValue
                    style={{
                      color: 'inherit'
                    }}
                    className='count-up jockey'
                  />
                  %
                </div>
              </div>
              }
              {percent === 100 &&
              <div className='flex pl-1'>
                <Circle className='absolute h-[100px] w-[100px] mx-1' percent={percent} strokeWidth={8} strokeColor={pgColor} trailWidth={0.01} strokeLinecap="round"/>
                <div className={'pl-[24px] pt-[35px] z-10 font-bold text-2xl '+'text-['+pgColor+']'}>
                  <CountUp
                    start={0}
                    duration={0.5}
                    end={Number(percent.toFixed(0))}
                    preserveValue
                    style={{
                      color: 'inherit'
                    }}
                    className='count-up jockey'
                  />
                  %
                </div>
              </div>
              }
              <div></div>
            </div>
            <div className='text-lg font-semibold text-center pt-6 py-4'>
              Found {unverifiedContracts.length} unverified contracts out of the {unverifiedContracts.length+verifiedContracts.length} contracts contained in the page.
            </div>
            <div className='text-xs text-center'>Found unverified contracts on the following chains: <br/>
              {chainsWithUnverifiedContracts.map((chainId, index) => {
                if (index === chainsWithUnverifiedContracts.length-1) {
                  return (
                    <span key={chainId} className="font-semibold">{getNameOfChainWithChainId(chainId)}</span>
                  );
                } else {
                  return (
                    <span key={chainId} className="font-semibold">{getNameOfChainWithChainId(chainId)}, </span>
                  );
                }
              })}
              
              <br/>

              <button
                type="button"
                className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-[#1DA1F2] hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <a className="twitter-share-button text-center" href={prepareTweet()} data-size="large" target="_blank" rel="noreferrer">Tweet</a>
              </button>
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
                { verifiedERC20s.length > 0 &&
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
                }
                {nfts.length > 0 &&
                <div className="rounded-md bg-white border-[0.5px] shadow-md px-4 py-5 sm:p-6 hover:bg-blue-100 hover:border-[0.5px] hover:border-blue-500" onClick={(e) => {e.preventDefault();setShowNfts(!showNfts);}}>
                  <dt className="text-xs text-blue-500">NFT addresses</dt>
                  <dd className="mt-1 text-sm font-semibold tracking-tight text-blue-500">{nfts.length}</dd>
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
