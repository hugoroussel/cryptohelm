import React, { useEffect, useState } from 'react';
import Header from './Header';
import { AccountPageProps } from './structs';
import Navbar from './Navbar';
import Logo from './Logo';

function Account(pageProps :AccountPageProps) {


  const [urls, setUrls] = useState([] as string[]);
  const [unverifiedAmount, setUnverifiedAmount] = useState(0);


  useEffect(() => {
    // get the amount of url scanned by the user from the local storage
    const urlScanned = localStorage.getItem('urls');
    const total = JSON.parse(urlScanned || '[]');
    setUrls(total);
    // get the amount of unverified dapps from the local storage
    const unverified = localStorage.getItem('unverifiedContractsAmount');
    const unverifiedAmount = JSON.parse(unverified || '0');
    setUnverifiedAmount(unverifiedAmount);
  },[]);


  return (
    <body className='w-[380px] bg-gray-50'>
      <Header {...pageProps.tabData}/>
      <Navbar {...pageProps.navbarProps}/>
      <div className='flex flex-col items-center pb-4'>
        <div className='text-center -mt-2'>
          <h1 className='text-2xl font-bold text-gray-700'>Account</h1>
          <br/>
          <p className='text-lg text-gray-500'>You scanned <span className='font-bold'>{urls.length}</span> dapps so far
            <br/>&</p>
          <p className='text-lg text-gray-500'>detected <span className='font-bold'>{unverifiedAmount}</span> unverified contracts
            <br/>
            <br/>
            Well done!
          </p>
        </div>
      </div>

    </body>
  );
}
export default Account;

