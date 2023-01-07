import React, { useEffect } from 'react';
import { BetaPageProps } from './types/types';
import Logo from './components/Logo';
import { TypeAnimation } from 'react-type-animation';
import FadeIn from 'react-fade-in';


function Beta(pageProps :BetaPageProps) {


  useEffect(() => {
    if (localStorage.getItem('betaTest') === 'false') {
      pageProps.setShowBeta(false);
    }
  }, []);



  function checkBetaPassword(){
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    localStorage.setItem('betaTest', 'false');
    pageProps.setShowBeta(false);
  }

  return (
    <body className='w-[380px]'>
      <br/>
      <br/>
      <Logo/>
      <div className='text-center text-xl'>
        <FadeIn
          delay={0}
          transitionDuration={2000}
        >
          <div>Welcome to CryptoHelm</div>
        </FadeIn>
      </div>
      <br/>
      <div className='text-center text-lg'>
        <br/>
        <div>
          <div className="">
            <button
              type="button"
              className="inline-flex items-center rounded px-5 py-3 text-xl nm-flat-zinc-800 hover:nm-flat-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={(e)=>{e.preventDefault();checkBetaPassword();}}
            >
            Enter Beta
            </button>
            <br/>
            <br/>
            <span className="my-4">
            Tip 💡 
              <br/>
            Use ⌘/Ctrl + Shift + K
              <br/>
            to open the extension.      
            </span>
          </div>
        </div>
      </div>
    </body>
  );
}
export default Beta;

