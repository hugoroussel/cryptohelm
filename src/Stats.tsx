import React from 'react';
import Header from './components/Header';
import { StatPageProps } from './types/types';
import Navbar from './components/Navbar';
import CountUp from 'react-countup';


function Stats(pageProps :StatPageProps) {



  function formatFunction(number :number) :string{
    if (number >= 1000000 && number < 1000000000){
      return (number/1000000).toFixed(2).toString()+'M';
    } else if(number > 1000000000) {
      return (number/1000000000).toFixed(2).toString()+'B';
    } else {
      return number.toLocaleString('en-US');
    }
  }

  return (
    <body className='w-[380px]'>
      <Header {...pageProps.tabData}/>
      <Navbar {...pageProps.navbarProps}/>
      { pageProps.foundDefillamaData &&
        (
          <div className=''>
            <h1 className='text-2xl font-bold text-center'>{pageProps.defillamaData.name}&apos;s Stats</h1>
            <div className="grid grid-cols-3 my-3">
              <div></div>
              <div>
                <img src={pageProps.defillamaData.logo} className="h-14 w-14 ml-8"/>
              </div>
              <div></div>
            </div>


            <dl className="grid grid-cols-3 gap-1 mt-1 text-center px-1">
              <div key={1} className="rounded-lg bg-white px-4 py-5 shadow hover:bg-green-100">
                <dt className="text-md font-medium ">TVL</dt>
                <dd className="mt-1 text-xl font-semibold tracking-tight">
                  <CountUp
                    start={0}
                    duration={1}
                    end={Number(pageProps.defillamaData.tvl)}
                    preserveValue
                    formattingFn={formatFunction}
                    style={{
                      color: 'inherit'
                    }}
                    className='count-up jockey'
                  />$
                </dd>
              </div>

              <div key={1} className="rounded-lg bg-white px-4 py-5 shadow-inner hover:bg-green-100">
                <dt className="text-md font-medium">Market Cap</dt>
                <dd className="mt-1 text-xl font-semibold tracking-tight">
                  <CountUp
                    start={0}
                    duration={1}
                    end={Number(pageProps.defillamaData.mcap)}
                    preserveValue
                    formattingFn={formatFunction}
                    style={{
                      color: 'inherit'
                    }}
                    className='count-up jockey'
                  />$
                </dd>
              </div>
              <div key={1} className="rounded-lg bg-white px-4 py-5 shadow-inner hover:bg-green-100">
                <dt className="text-md font-medium">FDV</dt>
                <dd className="mt-1 text-xl font-semibold tracking-tight"> 
                  <CountUp
                    start={0}
                    duration={1}
                    end={Number(pageProps.defillamaData.fdv)}
                    preserveValue
                    formattingFn={formatFunction}
                    style={{
                      color: 'inherit'
                    }}
                    className='count-up jockey'
                  />$
                </dd>
              </div>
            </dl>
            <div className='grid grid-cols-3 text-center py-3'>
              <div></div>
              <div className="flex ml-5">
                <a href={'https://www.coingecko.com/en/coins/'+pageProps.defillamaData.gecko_id} target="_blank" rel="noreferrer">
                  <img src="https://static.coingecko.com/s/thumbnail-d5a7c1de76b4bc1332e48227dc1d1582c2c92721b5552aae76664eecb68345c9.png" className="h-8 w-8 mr-4"/>
                </a>
                <a href={'https://twitter.com/'+pageProps.defillamaData.twitter} target="_blank" rel="noreferrer">
                  <img src="https://cdn.freebiesupply.com/logos/large/2x/twitter-3-logo-png-transparent.png" className="h-8 w-8"/>
                </a>

                <br/>
                <br/>
              </div>
              <div></div>
            </div>
            <div className='grid grid-cols-5 py-1'>
              <div></div>
              <div className='flex col-span-3 ml-10'>Powered by &nbsp; <img src="https://mdtacademy.com/wp-content/uploads/2022/08/DeFiLlama-Logo.png" className="h-6 pb-2"/></div>
              <div></div>
            </div>
          </div>
        )}
      {!pageProps.foundDefillamaData && (
        <div className='text-center text-lg py-5'>No Stats Found </div>
      )
      }
    </body>
  );
}
export default Stats;

