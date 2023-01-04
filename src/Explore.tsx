import React from 'react';
import Header from './components/Header';
import { ExplorePageProps } from './types/types';
import Navbar from './components/Navbar';



const exploreLinks = [
  {emoji: '🔄', description: 'I want to swap', option1link: 'https://app.1inch.io/#/1/unified/swap/ETH/DAI', option1name: '1inch', option2link: 'https://app.paraswap.io/#/?network=ethereum', option2name: 'Paraswap'},
  {emoji: '🌉', description: 'I want to bridge', option1link: 'https://bungee.exchange/', option1name: 'Bungee', option2link: 'https://app.multichain.org', option2name: 'Multichain'},
  {emoji: '💳', description: 'I want to buy with cc', option1link: 'https://www.mtpelerin.com/', option1name: 'MtPelerin', option2link: 'https://ramp.ondefy.com', option2name: 'Ondefy'},
  {emoji: '💰', description: 'I want to lend', option1link: 'https://app.aave.com/', option1name: 'Aave', option2link: 'https://www.morpho.xyz', option2name: 'Morpho'},
  {emoji: '📈', description: 'I want leverage', option1link: 'https://app.gmx.io/#/trade', option1name: 'GMX', option2link: 'https://gains.trade/trading', option2name: 'Gains'},
  {emoji: '🦍', description: 'I want NFTs', option1link: 'https://opensea.io/', option1name: 'OpenSea', option2link: 'https://app.uniswap.org/#/nfts', option2name: 'Uniswap'},
  /*{emoji: '👨‍🏫', description: 'I want to learn to code', option1link: 'https://cryptozombies.io/', option1name: 'CZombies', option2link: 'https://nodeguardians.io/', option2name: 'NGuardians'},*/
];

function Explore(pageProps :ExplorePageProps) {

  return (
    <>
      <body>
        <Header {...pageProps.tabData}/>
        <div className='grid grid-cols-3 gap-1 px-1'>
          {exploreLinks.map((data, index) => (
            <div key={index} className="rounded-md px-3 py-3 nm-inset-zinc-800 text-center">
              <dt className="text-lg">{data.emoji}</dt>
              <dt className="text-lg">{data.description}</dt>
              <dd className="text-lg">
                <a href={data.option1link} className="text-blue-500 hover:text-blue-700" target='_blank' rel="noreferrer" >{data.option1name}</a>
                <br/>
                or
                <br/>
                <a href={data.option2link} className="text-blue-500 hover:text-blue-700" target='_blank' rel="noreferrer" >{data.option2name}</a>
              </dd>
            </div>
          ))}


        </div>





        
        <Navbar {...pageProps.navbarProps}/>
      </body>
    </>
  );
}
export default Explore;

