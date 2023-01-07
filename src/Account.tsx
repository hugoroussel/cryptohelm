import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import { AccountPageProps } from './types/types';
import Navbar from './components/Navbar';
import axios from 'axios';

function nameToLogo(name :string){
  if (name === 'MetaMask') {
    return 'https://cdn.worldvectorlogo.com/logos/metamask.svg';
  }
  if (name === 'Frame Companion') {
    return 'https://pbs.twimg.com/profile_images/1356250468725510145/Nnzi4nHQ_400x400.jpg';
  }
}

const REACT_APP_SERVER_URL = 'https://cryptohelmnode-3npc2uvlhq-no.a.run.app';
// const REACT_APP_SERVER_URL = 'http://localhost:8080';

function Account(pageProps :AccountPageProps) {


  const [urls, setUrls] = useState([] as string[]);
  const [unverifiedAmount, setUnverifiedAmount] = useState(0);
  const [extensionsToDisplay, setExtensionsToDisplay] = useState([] as chrome.management.ExtensionInfo[]);
  const [latestVersion, setLatestVersion] = useState({} as {[key: string]: string});


  useEffect(() => {
    async function readChromeExtensions(){
      const infos = await chrome.management.getAll();
      const metamask = infos.find((info) => info.name === 'MetaMask');
      const framesh = infos.find((info) => info.name === 'Frame Companion');
      const result = [] as chrome.management.ExtensionInfo[];
      if (metamask) {
        result.push(metamask);
      }
      if (framesh) {
        result.push(framesh);
      }
      setExtensionsToDisplay(result);
    }
    readChromeExtensions();
    async function readChromeExtensionsVersions(){
      const res = await axios.get(`${REACT_APP_SERVER_URL}/extensions`);
      setLatestVersion(res.data);
    }
    readChromeExtensionsVersions();
    // get the amount of url scanned by the user from the local storage
    const urlScanned = localStorage.getItem('urls');
    const total = JSON.parse(urlScanned || '[]');
    setUrls(total);
    // get the amount of unverified dapps from the local storage
    const unverified = localStorage.getItem('unverifiedContractsAmount');
    const unverifiedAmount = JSON.parse(unverified || '0');
    setUnverifiedAmount(unverifiedAmount);
  },[]);

  const stats = [
    { name: 'Total Scanned', stat: urls.length },
    { name: 'Unverified', stat: unverifiedAmount },
  ];


  return (
    <>
      <body>
        <Header {...pageProps.tabData}/>
        <div>
          <h3 className="text-lg font-medium leading-6 m-3">Your Account</h3>
          <dl className="mt-5 grid grid-cols-2 m-3 gap-1">
            {stats.map((item) => (
              <div key={item.name} className="overflow-hidden rounded-lg px-4 py-5 sm:p-6 nm-inset-zinc-800">
                <dt className="truncate text-sm font-medium">{item.name}</dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight">{item.stat}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h3 className="text-lg font-medium leading-6 m-3">Your Extensions</h3>

          {extensionsToDisplay.map((extension) => (
            <dl className="grid grid-cols-1 gap-1 m-3" key={extension.id}>
              <div key={1} className="overflow-hidden rounded-lg px-4 py-5 sm:p-6 flex nm-inset-zinc-800">
                <img src={nameToLogo(extension?.name)} className='h-10 w-10 border-1 border-solid mt-5 mr-2'/>
                <div className='ml-2 flex text-lg'>
                  {extension?.name} &nbsp;<br/>
              Version {extension?.version} &nbsp;<br/>
                  {(extension?.version == latestVersion[extension?.name]) ? '✅ Up to Date' : '❌ Not Up to Date'}
                </div>
              </div>
            </dl>
          ))}



        
          {/*
        <dl className="grid grid-cols-1 gap-1 m-3">
          <div key={1} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-inner flex">
            <img src="https://pbs.twimg.com/profile_images/1356250468725510145/Nnzi4nHQ_400x400.jpg" className='h-10 w-10 border-1 border-solid mt-2'/>
            <div className='ml-2 text-lg'>
              {framesh?.name} &nbsp;<br/>
              Version {framesh?.version}
            </div>
          </div>
        </dl>
        */}
        </div>
        <br/>
        <Navbar {...pageProps.navbarProps}/>
      </body>
    </>
  );
}
export default Account;

