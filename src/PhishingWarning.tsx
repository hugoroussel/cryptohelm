import React from 'react';
import {ExclamationCircleIcon} from '@heroicons/react/20/solid';
import {PhishingWarningPageProps} from './types/types';

function PhishingWarning(pageProps :PhishingWarningPageProps){
  return(
    <body className='w-[380px] bg-red-700'>
      <div className="grid grid-cols-3">
        <div></div>
        <div><ExclamationCircleIcon/></div>
        <div></div>
      </div>
      <h1 className='text-center text-3xl font-bold'>This has been flagged has a phishing/scam website. Do not interact.</h1>
      <br/>
      <div className="grid grid-cols-3">
        <div></div>
        <div>
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-6 py-3 text-base font-bold text-white shadow-sm hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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