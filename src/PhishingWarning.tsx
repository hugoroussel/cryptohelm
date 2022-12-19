import React from 'react';
import {ExclamationTriangleIcon} from '@heroicons/react/20/solid';
import {PhishingWarningPageProps} from './types/types';
import Header from './components/Header';
import Logo from './components/Logo';

function PhishingWarning(pageProps :PhishingWarningPageProps){
  return(
    <body className='w-[380px] bg-black'>
      <Header {...pageProps.tabData}/>
      <Logo/>
      <div className="grid grid-cols-3 py-3">
        <div><div>
        </div>
        </div>
        <div><ExclamationTriangleIcon className='text-red-500 px-4'/></div>
      </div>
      <h1 className='px-4 text-lg font-bold text-white'>This website {`(${pageProps.tabData.url})`} is most likely a phishing or scam website. We strongly advise to not proceed. {pageProps.description !== '' ? (<><br/>Description: {pageProps.description}</>) : (<></>)} </h1>
      <br/>
      <div className="grid grid-cols-3">
        <div></div>
        <div>
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-white bg-black text-base font-bold text-white shadow-sm hover:bg-gray-400"
            onClick={(e)=>{e.preventDefault();
              if(pageProps.tab.id !== undefined){
                chrome.tabs.remove([pageProps.tab.id]);
              }
              pageProps.setShowWarningPage(!pageProps.showWarningPage);}}
          >
            Ok (this will close the current tab)
          </button>
        </div>
        <div></div>
      </div>
      <br/>
      
    </body>
  );
}

export default PhishingWarning;