import React, { useEffect } from 'react';
import { BoltSlashIcon, BoltIcon, UserCircleIcon} from '@heroicons/react/20/solid';
import {QuestionMarkCircleIcon} from '@heroicons/react/24/outline';
import axios from 'axios';
import { TabData } from '../types/types';

function Header(pageProps :TabData){

  const [serverLive, setServerLive] = React.useState<boolean>(false);

  useEffect(() => {
    async function livenessCheck() {
      const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/ping`);
      if (res.data === 'Server is running') {
        setServerLive(true);
      }
    }
    livenessCheck();
  },[]);

  return(
    <div className="bg-slate-50 h-[60px] grid grid-cols-4 gap-8 rounded-sm">
      <div className="text-xs col-span-3 flex">
        <img src={pageProps.favIconUrl} className="h-6 w-6 ml-3 mt-1"/> 
        <span className="font-bold ml-1 mt-2 text-blue-500">{pageProps.url} </span>
      </div>

      <div className="flex justify-end">
        <div className="text-xs mr-1">
          {serverLive ? <BoltIcon className='text-green-400 mt-1 h-6 w-'/> : <BoltSlashIcon className='text-red-700 font-bold mt-1 h-6 w-6'/>}
        </div>
      </div>
    </div>
  );
}

export default Header;