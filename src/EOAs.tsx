import React, { useEffect } from 'react';
import {AddressCollection, ContractsPageProps, TabData} from './types/types';
import {XMarkIcon, ArrowDownTrayIcon,ArrowTopRightOnSquareIcon} from '@heroicons/react/20/solid';
import Header from './components/Header';


function saveToJsonAndDownload(tabData: TabData,contracts: AddressCollection[]){
  const json = JSON.stringify(contracts);
  const blob = new Blob([json], {type: 'application/json'});
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = tabData.title+'Eoas.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}



function EOAs(pageProps: ContractsPageProps) {

  useEffect(() => {
    //
  }, [pageProps]);

  return (
    <>
      <body className=''>
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
                    <div className="ml-7 text-lg flex col-span-3 text-center font-semibold">{pageProps.contracts.length} addresses</div>
                    <div></div>
                    <div>
                      <XMarkIcon className='w-5 h-5 ml-1.5 hover:text-gray-400' onClick={(e)=>{e.preventDefault();pageProps.setShowContracts(!pageProps.showContracts);}}/>
                    </div>
                  </div>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pageProps.contracts.length === 0 && <div className="text-center text-lg text-gray-500 mt-10">No contracts founds</div>}
                  {pageProps.contracts.map((contract) => (
                    <div className="grid grid-cols-7 items-center hover:bg-gray-400" key={contract.address}>
                      <div className="ml-2">
                      </div>
                      <div className="ml-7 text-lg mt-1 col-span-5 text-center">
                        {
                          contract.address.substring(0, 7) + '...' + contract.address.substring(contract.address.length - 5, contract.address.length)
                        }
                      </div>
                      <div>
                        <ArrowTopRightOnSquareIcon className='h-5 w-5 ml-2 hover:text-blue-500' onClick={(e)=>{e.preventDefault(),window.open('https://debank.com/profile/'+contract.address, '_blank');}}/>
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

export default EOAs;