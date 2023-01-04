import React, { useEffect } from 'react';
import {ERC20sPageProps, TokenListToken} from './types/types';
import {ArrowTopRightOnSquareIcon, XMarkIcon, ArrowDownTrayIcon} from '@heroicons/react/20/solid';
import Header from './components/Header';
import {getImageOfLogoUsingChainId, returnBlockchainExplorerLinkWithChainId } from './helpers';


function saveToJsonAndDownload(erc20s: TokenListToken[]){
  const json = JSON.stringify(erc20s);
  const blob = new Blob([json], {type: 'application/json'});
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = 'erc20s.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}




function ERC20s(pageProps: ERC20sPageProps) {
  useEffect(() => {
    pageProps.erc20s.sort((a, b) => {
      return a.name.localeCompare(b.name);
    }
    );
  }, []);

  return (
    <>
      <body className=''>
        <Header {...pageProps.tabData}/>
        <div className="lg:-mx-8">
          <div className="lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-300 table-auto">
                <thead className="">
                  <div className="grid grid-cols-7 items-center my-2">
                    <div>
                      <ArrowDownTrayIcon className='w-5 h-5 ml-1.5 hover:text-gray-400' onClick={(e)=>{e.preventDefault();saveToJsonAndDownload(pageProps.erc20s);}}/>
                    </div>
                    <div></div>
                    <div className="ml-7 text-lg flex col-span-3 text-center font-semibold">{pageProps.erc20s.length} tokens</div>
                    <div></div>
                    <div>
                      <XMarkIcon className='w-5 h-5 ml-1.5 hover:text-gray-400' onClick={(e)=>{e.preventDefault();pageProps.setShowTokens(!pageProps.showTokens);}}/>
                    </div>
                  </div>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pageProps.erc20s.length === 0 && <div className="text-center text-lg mt-10">No tokens found :(</div>}
                  {pageProps.erc20s.map((token) => (
                    <div className="grid grid-cols-7 items-center hover:bg-gray-400" key={token.address}>
                      <div className="ml-2 flex">
                        <img src={token.logoURI} className="h-5 w-5"/>
                        <img src={getImageOfLogoUsingChainId(token.chainId)} className="h-5 w-5 ml-0.5"/>
                      </div>
                      <div className="ml-7 text-lg mt-1 col-span-5 text-center">
                        {token.name.length > 20 ? token.name.substring(0, 20) + '...' : token.name}
                      </div>
                      <div>
                        <ArrowTopRightOnSquareIcon className='h-5 w-5 ml-2 hover:text-blue-500' onClick={(e)=>{e.preventDefault(),window.open(returnBlockchainExplorerLinkWithChainId(token.chainId)+'/token/'+token.address, '_blank');}}/>
                      </div>
                    </div>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </body>
    </>
  );
}

export default ERC20s;