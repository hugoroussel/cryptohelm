/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState } from 'react';
import Header from './components/Header';
import { AccountPageProps } from './types/types';
import Navbar from './components/Navbar';
import Logo from './components/Logo';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const faqs = [
  {
    question: 'What does this app do?',
    answer:
      'Crypto Helm detects contract addresses contained in the dapps you visit and checks them on the different block explorer. It also prevents you from getting phished.',
  }, 
  {
    question: 'What chains are supported?',
    answer:
      'The supported chains are Ethereum, Polygon, Optimism, Arbitrum, Celo, Fantom, BSC, Avalanche, Gnosis Chain, Moonbeam.',
  }, 
  {
    question: 'What is a "Verified" contract?',
    answer:
      'A contract is verified if the source code has been posted and "verified" on a block explorer.',
  },
  {
    question: 'Can a verified contract be malicious?',
    answer:
      'Yes, but at least everyone can read the source code. ',
  },
  {
    question: 'I have more questions..',
    answer:
      'Reach out to me on Twitter @theleoruss',
  },
  // More questions...
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function FAQ(pageProps :AccountPageProps) {

  const chainIds = [1, 56, 137, 250, 42161, 10, 100, 1284, 42220, 43114 ];

  const [open, setOpen] = useState<boolean>(false);

  return (
    <body className='w-[380px]'>
      <Header {...pageProps.tabData}/>
      <Navbar {...pageProps.navbarProps}/>
      <div className="">
        <div className="mx-auto max-w-7xl py-1 px-2">
          <Logo/>
          <div className="mx-auto max-w-3xl divide-y-2 divide-gray-200">
            <h2 className="text-center text-lg font-bold tracking-tight">
            Frequently asked questions
            </h2>
            <dl className="mt-3 space-y-6 divide-y divide-gray-200">
              {faqs.map((faq) => (
                <Disclosure as="div" key={faq.question} className="pt-6">
                  {({open}) => (
                    <>
                      <dt className="text-md">
                        <Disclosure.Button className="flex w-full items-start justify-between text-center ">
                          <span className="text-lg font-medium">{faq.question}</span>
                          <span className="ml-3 flex h-7 items-center">
                            <ChevronDownIcon
                              className={classNames(open ? '-rotate-180' : 'rotate-0', 'h-6 w-6 transform')}
                              aria-hidden="true"
                            />
                          </span>
                        </Disclosure.Button>
                      </dt>
                      <Disclosure.Panel as="dd" className="mt-2 pr-12">
                        <p className="text-base">{faq.answer}</p>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </dl>
          </div>
        </div>
        <br/>
        <div className='text-xs text-center py-3'>
          <span>Powered by</span>
          <br/>
          <a className="text-blue-800 font-bold hover:underline" href="https://etherscan.io" target="_blank" rel="noreferrer">Etherscan.io, </a>
          <a className="text-blue-800 font-bold hover:underline" href="https://bscscan.com" target="_blank" rel="noreferrer">Bscscan.com, </a>
          <a className="text-blue-800 font-bold hover:underline" href="https://polygonscan.com" target="_blank" rel="noreferrer">Polygonscan.com, </a>
          <a className="text-blue-800 font-bold hover:underline" href="https://arbiscan.io" target="_blank" rel="noreferrer">Arbiscan.io, </a>
          <a className="text-blue-800 font-bold hover:underline" href="https://snowtrace.io" target ="_blank" rel="noreferrer">Snowtrace.io, </a>
          <a className="text-blue-800 font-bold hover:underline" href="https://ftmscan.com" target="_blank" rel="noreferrer">Ftmscan.com, </a>
          <a className="text-blue-800 font-bold hover:underline" href="https://celoscan.io" target="_blank" rel="noreferrer">Celoscan.io, </a>
          <a className="text-blue-800 font-bold hover:underline" href="https://gnosisscan.io" target="_blank" rel="noreferrer">Gnosisscan.io, </a>
          <a className="text-blue-800 font-bold hover:underline" href="https://moonscan.io" target="_blank" rel="noreferrer">Moonscan.io</a>
          <br/>
            APIs
        </div>
      </div>
    </body>
  );
}
export default FAQ;

