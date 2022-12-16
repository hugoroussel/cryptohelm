import React, { useEffect, useState } from 'react';
import Header from './Header';
import { AccountPageProps } from './structs';
import Navbar from './Navbar';
import Logo from './Logo';
import axios from 'axios';

function Stats(pageProps :AccountPageProps) {


  const [found, setFound] = useState(false);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dappData, setDappData] = useState({} as any);


  useEffect(() => {
    async function getDefillamaData(){
      const res = await axios.get('https://api.llama.fi/protocols');
      console.log(res.data);
      // check if the current url is in the list of dapps
      const urlStripped = pageProps.tabData.url.replace('app.','');
      console.log('url stripped',urlStripped);
      for(let i = 0; i < res.data.length; i++){
        const urlCleaned = res.data[i].url.split('/').slice(0, 3).join('/');
        console.log('url cleaned',urlCleaned);
        if(urlCleaned == urlStripped){
          console.log('found',res.data[i]);
          setFound(true);
          setDappData(res.data[i]);
        }
      }
    }
    getDefillamaData();
  },[]);


  return (
    <body className='w-[380px] bg-gray-50'>
      <Header {...pageProps.tabData}/>
      <Navbar {...pageProps.navbarProps}/>
      <div className='flex flex-col items-center pb-4'>
        <div className='text-center -mt-2'>
          <h1 className='text-2xl font-bold text-gray-700'>Stats</h1>
          {found ? 
            (
              <div>
                <p className='text-lg text-gray-500'>Found on DeFi Llama</p>
                <p className='text-lg text-gray-500'>Name: {dappData.name}</p>
                <p className='text-lg text-gray-500'>TVL: {dappData.tvl}$</p>
                <p className='text-lg text-gray-500'>Audits: {dappData.audits}</p>
              </div>
            ) 
            : ('No Stats Found')}
        </div>
      </div>

    </body>
  );
}
export default Stats;

