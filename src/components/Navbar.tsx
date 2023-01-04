import React from 'react';
import { NavbarProps } from '../types/types';




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
      pageProps.setShowExplore(false);
    } else if (newTabName === 'info') {
      pageProps.setShowFAQ(true);
      pageProps.setShowAccount(false);
      pageProps.setShowStats(false);
      pageProps.setShowExplore(false);
    } else if (newTabName === 'shield') {
      pageProps.setShowAccount(false);
      pageProps.setShowFAQ(false);
      pageProps.setShowStats(false);
      pageProps.setShowExplore(false);
    } else if (newTabName === 'stats') {
      pageProps.setShowStats(true);
      pageProps.setShowAccount(false);
      pageProps.setShowFAQ(false);
      pageProps.setShowExplore(false);
    } else if (newTabName === 'explore') {
      pageProps.setShowExplore(true);
      pageProps.setShowStats(false);
      pageProps.setShowAccount(false);
      pageProps.setShowFAQ(false);
    }
  }

  return (
    <>
      <div className='grid grid-cols-4 bg-inherit mt-2'>
        {pageProps.appTabs.map((tab, index) => {
          return(
            <div className='col-span-1' key={index}>
              <tab.icon
                className={classNames(
                  tab.current ? 'text-white' : 'text-zinc-500',
                  'h-9 w-9 mx-10 mb-2'
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
    </>
  );
}

export default Navbar;