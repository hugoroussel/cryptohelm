import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import { AccountPageProps } from './types/types';
import Navbar from './components/Navbar';
import Logo from './components/Logo';
import axios from 'axios';
import CountUp from 'react-countup';

function Stats(pageProps :AccountPageProps) {


  const [found, setFound] = useState(false);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dappData, setDappData] = useState({} as any);


  useEffect(() => {
    async function getDefillamaData(){
      const res = await axios.get('https://api.llama.fi/protocols');
      // check if the current url is in the list of dapps
      const urlStripped = pageProps.tabData.url.replace('app.','');
      // const urlStripped = 'https://apwine.fi';
      console.log('url stripped',urlStripped);
      for(let i = 0; i < res.data.length; i++){
        let urlCleaned = res.data[i].url.split('/').slice(0, 3).join('/');
        urlCleaned = urlCleaned.replace('www.', '');
        if(urlCleaned == urlStripped){
          console.log('found',res.data[i]);
          setFound(true);
          setDappData(res.data[i]);
        }
      }
    }
    getDefillamaData();
  },[]);


  function formatFunction(number :number) :string{
    console.log('number', number);
    if (number >= 1000000 && number < 1000000000){
      return (number/1000000).toFixed(2).toString()+'M';
    } else if(number > 1000000000) {
      return (number/1000000000).toFixed(2).toString()+'B';
    } else {
      return number.toLocaleString('en-US');
    }
  }

  return (
    <body className='w-[380px] bg-gray-50'>
      <Header {...pageProps.tabData}/>
      <Navbar {...pageProps.navbarProps}/>
      {found ? 
        (
          <div className=''>
            <h1 className='text-2xl font-bold text-gray-900 text-center'>{dappData.name}&apos;s Stats</h1>
            <div className="grid grid-cols-3 my-3">
              <div></div>
              <div>
                <img src={dappData.logo} className="h-14 w-14 ml-8"/>
              </div>
              <div></div>
            </div>

            <dl className="grid grid-cols-3 gap-1 mt-1 text-center px-1">
              <div key={1} className="rounded-lg bg-white px-4 py-5 shadow hover:bg-green-100">
                <dt className="text-md font-medium text-gray-500">TVL</dt>
                <dd className="mt-1 text-xl font-semibold tracking-tight text-gray-900">
                  <CountUp
                    start={0}
                    duration={1}
                    end={Number(dappData.tvl)}
                    preserveValue
                    formattingFn={formatFunction}
                    style={{
                      color: 'inherit'
                    }}
                    className='count-up jockey'
                  />$
                </dd>
              </div>

              <div key={1} className="rounded-lg bg-white px-4 py-5 shadow hover:bg-green-100">
                <dt className="text-md font-medium text-gray-500">Market Cap</dt>
                <dd className="mt-1 text-xl font-semibold tracking-tight text-gray-900">
                  <CountUp
                    start={0}
                    duration={1}
                    end={Number(dappData.mcap)}
                    preserveValue
                    formattingFn={formatFunction}
                    style={{
                      color: 'inherit'
                    }}
                    className='count-up jockey'
                  />$
                </dd>
              </div>
              <div key={1} className="rounded-lg bg-white px-4 py-5 shadow hover:bg-green-100">
                <dt className="text-md font-medium text-gray-500">FDV</dt>
                <dd className="mt-1 text-xl font-semibold tracking-tight text-gray-900"> 
                  <CountUp
                    start={0}
                    duration={1}
                    end={Number(dappData.fdv)}
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
                <a href={'https://www.coingecko.com/en/coins/'+dappData.gecko_id} target="_blank" rel="noreferrer">
                  <img src="https://static.coingecko.com/s/thumbnail-d5a7c1de76b4bc1332e48227dc1d1582c2c92721b5552aae76664eecb68345c9.png" className="h-8 w-8 mr-4"/>
                </a>
                <a href={'https://twitter.com/'+dappData.twitter} target="_blank" rel="noreferrer">
                  <img src="https://toppng.com/uploads/preview/twitter-logo-11549680523gyu1fhgduu.png" className="h-8 w-8 mt-0.5"/>
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
        ) 
        : (<div className='text-center text-lg py-5'>No Stats Found :(

          
        </div>)}
    </body>
  );
}
export default Stats;

