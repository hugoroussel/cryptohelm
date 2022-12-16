import React, { useEffect, useState } from 'react';
import Header from './Header';
import { AccountPageProps } from './structs';
import Navbar from './Navbar';
import Logo from './Logo';
import { getImageOfLogoUsingChainId } from './helpers';

function FAQ(pageProps :AccountPageProps) {

  const chainIds = [1, 56, 137, 250, 42161, 10, 100, 1284, 42220, 43114 ];

  return (
    <body className='w-[380px] bg-gray-50'>
      <Header {...pageProps.tabData}/>
      <Navbar {...pageProps.navbarProps}/>
      <Logo/>
      <div className='flex flex-col items-center pb-4'>
        <div className='text-center -mt-5'>
          <h1 className='text-2xl font-semibold text-gray-700'>FAQ</h1>
          <div className='text-lg text-gray-700 px-3'>We help you detect if smart contract addresses injected in the pages you visit are verified on the corresponding block explorer.</div>
          <h1 className='text-xl font-semibold text-gray-700'>Supported chains</h1>
          <div className='flex pl-2 ml-6 pt-2'>
            {
              chainIds.map((token) => {
                return (
                  <img src={getImageOfLogoUsingChainId(token)} className="w-7 h-7 mr-0.5" key={token}/>);
              })}
          </div>   
          <h1 className='text-xl font-semibold text-gray-700'>Follow us on Twitter</h1>
          <h1 className='text-xl font-semibold text-gray-700'>Give feedback</h1>
          <br/>
          <div className='text-xs text-gray-700'>
            <span>Powered by</span>
            <br/>
            <a className="text-blue-800 font-bold hover:underline" href="https://etherscan.io" target="_blank" rel="noreferrer">Etherscan.io, </a>
            <a className="text-blue-800 font-bold hover:underline" href="https://bscscan.com" target="_blank" rel="noreferrer">Bscscan.com, </a>
            <a className="text-blue-800 font-bold hover:underline" href="https://polygonscan.com" target="_blank" rel="noreferrer">Polygonscan.com, </a>
            <a className="text-blue-800 font-bold hover:underline" href="https://arbiscan.io" target="_blank" rel="noreferrer">Arbiscan.io, </a>
            <a className="text-blue-800 font-bold hover:underline" href="https://snowtrace.io" target ="_blank" rel="noreferrer">Snowtrace.io, </a>
            <a className="text-blue-800 font-bold hover:underline" href="https://ftmscan.com" target="_blank" rel="noreferrer">Ftmscan.com, </a>
            <a className="text-blue-800 font-bold hover:underline" href="https://celoscan.io" target="_blank" rel="noreferrer">Celoscan.io, </a>
            <a className="text-blue-800 font-bold hover:underline" href="https://gnosisscan.io" target="_blank" rel="noreferrer">Gnosisscan.io, </a>
            <a className="text-blue-800 font-bold hover:underline" href="https://moonscan.io" target="_blank" rel="noreferrer">Moonscan.io</a>
            <br/>
            APIs
          </div>
            
        </div>
      </div>

    </body>
  );
}
export default FAQ;

