import React, { useEffect } from 'react';
import {AddressCollection, ContractsPageProps, TabData} from './types/types';
import {ArrowTopRightOnSquareIcon, XMarkIcon, ArrowDownTrayIcon} from '@heroicons/react/20/solid';
import Header from './components/Header';
import { getImageOfLogoUsingChainId,returnBlockchainExplorerLinkWithChainId } from './helpers';


function saveToJsonAndDownload(tabData : TabData,contracts: AddressCollection[]){
  const json = JSON.stringify(contracts);
  const blob = new Blob([json], {type: 'application/json'});
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = tabData.title+' Unverified.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}



function UnverifiedContracts(pageProps: ContractsPageProps) {
  useEffect(() => {
    pageProps.contracts.sort((a, b) => {
      return a.unverifiedon[0] - b.unverifiedon[0];
    });
  }, []);

  return (
    <>
      <body className='w-[340px] h-[450px] bg-gray-50'>
        <Header {...pageProps.tabData}/>
        <div className="lg:-mx-8">
          <div className="lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y table-auto">
                <thead className="">
                  <div className="grid grid-cols-7 items-center my-2">
                    <div>
                      <ArrowDownTrayIcon className='w-5 h-5 ml-1.5 hover:text-gray-400' onClick={(e)=>{e.preventDefault();saveToJsonAndDownload(pageProps.tabData,pageProps.contracts);}}/>
                    </div>
                    <div></div>
                    <div className="ml-7 text-lg flex col-span-3 text-center font-semibold">{pageProps.contracts.length} contracts</div>
                    <div></div>
                    <div>
                      <XMarkIcon className='w-5 h-5 ml-1.5 hover:text-gray-400' onClick={(e)=>{e.preventDefault();pageProps.setShowContracts(!pageProps.showContracts);}}/>
                    </div>
                  </div>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white ">
                  {pageProps.contracts.length === 0 && <div className="text-center text-lg mt-10">No contracts founds</div>}
                  {pageProps.contracts.map((contract) => (
                    <div className="grid grid-cols-7 items-center hover:bg-gray-200" key={contract.address}>
                      <div className="ml-2">
                        <img src={getImageOfLogoUsingChainId(contract.unverifiedon[0])} className="h-5 w-5"/>
                      </div>
                      <div className="ml-7 text-lg mt-1 col-span-5 text-center">
                        {
                          contract.address.substring(0, 7) + '...' + contract.address.substring(contract.address.length - 5, contract.address.length)
                        }
                      </div>
                      <div>
                        <ArrowTopRightOnSquareIcon className='h-5 w-5 ml-2 hover:text-blue-500' onClick={(e)=>{e.preventDefault(),window.open(returnBlockchainExplorerLinkWithChainId(contract?.unverifiedon[0])+'/address/'+contract.address, '_blank');}}/>
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

export default UnverifiedContracts;