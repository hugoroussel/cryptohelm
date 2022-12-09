import React, { useEffect } from 'react';
import { ArrowPathIcon, BoltSlashIcon, BoltIcon} from '@heroicons/react/20/solid';
import axios from 'axios';

function Header(){

  const [serverLive, setServerLive] = React.useState<boolean>(false);

  useEffect(() => {
    async function livenessCheck() {
      const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/ping`);
      if (res.data === 'Server is running') {
        setServerLive(true);
      }
      console.log('livenesscheck', res.data);
    }
    livenessCheck();
  },[]);

  return(
    <div className="bg-[#979695] h-[31px] grid grid-cols-4 gap-4 rounded-sm">
      <div className="flex">
        <div className="text-lg pt-0.5 pl-2 border-[#21325b]">Metascan</div>
      </div>
      <div></div>
      <div></div>
      <div className="flex justify-end">
        <ArrowPathIcon className="h-6 w-6 mt-1 mr-1 text-gray-900 hover:text-gray-400" aria-hidden="true" onClick={(e)=>{e.preventDefault();}} />
        <div className="text-xs mr-1">
          {serverLive ? <BoltIcon className='text-green-400 font-bold mt-1 h-6 w-6'/> : <BoltSlashIcon className='text-red-700 font-bold mt-1 h-6 w-6'/>}
        </div>
      </div>
    </div>
  );
}

export default Header;