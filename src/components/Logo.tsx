import React from 'react';
import logo from '../logo192.png';

function Logo() {
  return(
    <div className='grid grid-cols-3 pb-2'>
      <div></div>
      <div className="">
        <img src={logo} className='h-[120px] w-[110px] container'/>
      </div>
      <div></div>
    </div>
  );
}

export default Logo;
    