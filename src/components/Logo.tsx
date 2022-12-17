import React from 'react';
import logo from '../logo192.png';

function Logo() {
  return(
    <div className='grid grid-cols-3 pb-2'>
      <div></div>
      <div className="">
        <img src={logo} className='h-[90px] w-[80px] container mb-6'/>
      </div>
      <div></div>
    </div>
  );
}

export default Logo;
    