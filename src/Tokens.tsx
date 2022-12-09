import React from 'react';
import {ERC20sPageProps, TokenListToken} from './structs';
import {ArrowTopRightOnSquareIcon, XMarkIcon} from '@heroicons/react/20/solid';
import Header from './Header';


function returnLinkToBlockExplorer(token: TokenListToken) {
  switch (token.chainId) {
  case 1:
    return `https://etherscan.io/token/${token.address}`;
  case 3:
    return `https://ropsten.etherscan.io/token/${token.address}`;
  }
}

function ERC20s(pageProps: ERC20sPageProps) {

  return (
    <>
      <body className='w-[340px] h-[450px] bg-white'>
        <Header/>
        <div className="lg:-mx-8">
          <div className="lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-300 table-auto">
                <thead className="bg-gray-200">
                  <div className="grid grid-cols-7 items-center my-2">
                    <div></div>
                    <div></div>
                    <div className="ml-7 text-lg flex col-span-3 text-center font-bold">{pageProps.erc20s.length} tokens</div>
                    <div></div>
                    <div>
                      <XMarkIcon className='w-5 h-5 ml-1.5 hover:text-gray-400' onClick={(e)=>{e.preventDefault();pageProps.setShowTokens(!pageProps.showTokens);}}/>
                    </div>
                  </div>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white ">
                  {pageProps.erc20s.length === 0 && <div className="text-center text-lg text-gray-500 mt-10">No tokens found :(</div>}
                  {pageProps.erc20s.map((token) => (
                    <div className="grid grid-cols-7 items-center hover:bg-gray-100" key={token.address}>
                      <div className="ml-2">
                        <img src={token.logoURI} className="h-5 w-5"/>
                      </div>
                      <div className="ml-7 text-lg mt-1 col-span-5 text-center">
                        {token.name.length > 20 ? token.name.substring(0, 20) + '...' : token.name}
                      </div>
                      <div>
                        <ArrowTopRightOnSquareIcon className='h-5 w-5 ml-2 hover:text-blue-500' onClick={(e)=>{e.preventDefault(),window.open(returnLinkToBlockExplorer(token), '_blank');}}/>
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