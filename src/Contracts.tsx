import React, { useEffect } from 'react';
import {AddressCollection, ContractsPageProps, TokenListToken} from './structs';
import {ArrowTopRightOnSquareIcon, XMarkIcon, ArrowDownTrayIcon} from '@heroicons/react/20/solid';
import Header from './Header';

function returnLinkToBlockExplorer(token: TokenListToken) {
  switch (token.chainId) {
  case 1:
    return `https://etherscan.io/token/${token.address}`;
  case 3:
    return `https://ropsten.etherscan.io/token/${token.address}`;
  }
}

function saveToJsonAndDownload(contracts: AddressCollection[]){
  const json = JSON.stringify(contracts);
  const blob = new Blob([json], {type: 'application/json'});
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = 'contracts.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


function getImageOfLogoUsingChainId(chainId: number) {
  switch (chainId) {
  case 1:
    return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png';
  case 10:
    return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png';
  case 137:
    return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/matic/info/logo.png';
  case 42161:
    return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png';
  case 43114:
    return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchec/info/logo.png';
  case 56:
    return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png';
  case 250:
    return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/fantom/info/logo.png';
  case 42220:
    return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/celo/info/logo.png';
  case 1284:
    return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/moonbeam/info/logo.png';
  case 100:
    return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/xdai/info/logo.png';  
  }
}

function returnBlockchainExplorerLinkWithChainId(chainId: number) {
  switch (chainId) {
  case 1:
    return 'https://etherscan.io';
  case 10:
    return 'https://optimistic.etherscan.io';
  case 137:
    return 'https://polygonscan.com';
  case 42161:
    return 'https://arbiscan.io';
  case 43114:
    return 'https://snowtrace.io';
  case 56:
    return 'https://bscscan.com';
  case 250:
    return 'https://ftmscan.com';
  case 42220:
    return 'https://celoscan.io';
  case 1284:
    return 'https://moonbeam.moonscan.io';
  case 100:
    return 'https://gnosisscan.io/';  
  }
}



function Contracts(pageProps: ContractsPageProps) {

  useEffect(() => {
    console.log('contracts', pageProps.contracts);
    // filter the contract into different lists depending on the unverfiedOn array
  }, []);

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
                    <div>
                      <ArrowDownTrayIcon className='w-5 h-5 ml-1.5 hover:text-gray-400' onClick={(e)=>{e.preventDefault();saveToJsonAndDownload(pageProps.contracts);}}/>
                    </div>
                    <div></div>
                    <div className="ml-7 text-lg flex col-span-3 text-center font-bold">{pageProps.contracts.length} contracts</div>
                    <div></div>
                    <div>
                      <XMarkIcon className='w-5 h-5 ml-1.5 hover:text-gray-400' onClick={(e)=>{e.preventDefault();pageProps.setShowContracts(!pageProps.showContracts);}}/>
                    </div>
                  </div>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white ">
                  {pageProps.contracts.length === 0 && <div className="text-center text-lg text-gray-500 mt-10">No contracts founds</div>}
                  {pageProps.contracts.map((contract) => (
                    <div className="grid grid-cols-7 items-center hover:bg-gray-100" key={contract.address}>
                      <div className="ml-2">
                        <img src={getImageOfLogoUsingChainId(contract.nonverifiedon[0])} className="h-5 w-5"/>
                      </div>
                      <div className="ml-7 text-lg mt-1 col-span-5 text-center">
                        {
                          contract.address.substring(0, 7) + '...' + contract.address.substring(contract.address.length - 5, contract.address.length)
                        }
                      </div>
                      <div>
                        <ArrowTopRightOnSquareIcon className='h-5 w-5 ml-2 hover:text-blue-500' onClick={(e)=>{e.preventDefault(),window.open(returnBlockchainExplorerLinkWithChainId(contract?.nonverifiedon[0])+'/address/'+contract.address, '_blank');}}/>
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

export default Contracts;