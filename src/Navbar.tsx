import React, { useEffect } from 'react';
import { NavbarProps } from './structs';




function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function Navbar(pageProps :NavbarProps) {

  function changeTab(newTabName :string){
    const newTabs = [];
    for (let i = 0; i < pageProps.appTabs.length; i++) {
      if (pageProps.appTabs[i].name === newTabName) {
        newTabs[i] = pageProps.appTabs[i];
        newTabs[i].current = true;
      } else {
        newTabs[i] = pageProps.appTabs[i];
        newTabs[i].current = false;
      }
    }
    pageProps.setAppTabs(newTabs);
    if(newTabName === 'account'){
      pageProps.setShowAccount(!pageProps.showAccount);
      pageProps.setShowFAQ(false);
      pageProps.setShowStats(false);
    } else if (newTabName === 'info') {
      pageProps.setShowFAQ(true);
      pageProps.setShowAccount(false);
      pageProps.setShowStats(false);
    } else if (newTabName === 'shield') {
      pageProps.setShowAccount(false);
      pageProps.setShowFAQ(false);
      pageProps.setShowStats(false);
    } else if (newTabName === 'stats') {
      pageProps.setShowStats(true);
      pageProps.setShowAccount(false);
      pageProps.setShowFAQ(false);
    }
  }

  return (
    <>
      <hr className='-mt-6'/>
      <div className='grid grid-cols-4 py-1'>
        {pageProps.appTabs.map((tab, index) => {
          return(
            <div className='col-span-1' key={index}>
              <tab.icon
                className={classNames(
                  tab.current ? 'text-black' : 'text-gray-400',
                  'h-9 w-9 ml-6 hover:text-blue-200'
                )}
                aria-hidden="true"
                onClick={(e) => {e.preventDefault();
                  changeTab(tab.name);
                }}
              />
            </div>
          );
        })}
      </div>
      <hr className='mb-5'/>
    </>
  );
}

export default Navbar;