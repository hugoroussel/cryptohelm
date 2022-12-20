import React from 'react';
import { BetaPageProps } from './types/types';
import Logo from './components/Logo';
import { TypeAnimation } from 'react-type-animation';
import FadeIn from 'react-fade-in';


function Beta(pageProps :BetaPageProps) {
  function checkBetaPassword(){
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const password = (document.getElementById('password') as HTMLInputElement).value;
    if (password === 'vario'){
      pageProps.setShowBeta(false);
      localStorage.setItem('betaTest', 'false');
    }
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
          <div>Welcome to the beta anon.</div>
        </FadeIn>
      </div>
      <br/>
      <div className='text-center text-lg'>
        <TypeAnimation
          sequence={[() => {
            return new Promise((resolve) => setTimeout(resolve, 2000));
          },'Use ⌘ + Shift + k to open the app.', 500]}
          speed={70} 
          wrapper="h2"
          repeat={0}
          cursor={false}
        />
        <TypeAnimation
          sequence={[
            () => {
              return new Promise((resolve) => setTimeout(resolve, 3000));
            },
            'Please enter the beta password to continue.', 500]}
          speed={80} 
          wrapper="h2"
          repeat={0}
          cursor={false}
        />
        <br/>
        <div>
          <div className="mt-1">
            <input
              type="password"
              name="password"
              id="password"
              className="container block w-1/2 rounded-md border-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder=""
            />
            <br/>
            <button
              type="button"
              className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={(e)=>{e.preventDefault();checkBetaPassword();}}
            >
            Enter Beta
            </button>
            <br/>
            <br/>
          </div>
        </div>
      </div>
    </body>
  );
}
export default Beta;

