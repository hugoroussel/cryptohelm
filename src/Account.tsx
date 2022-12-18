import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import { AccountPageProps } from './types/types';
import Navbar from './components/Navbar';

function Account(pageProps :AccountPageProps) {


  const [urls, setUrls] = useState([] as string[]);
  const [unverifiedAmount, setUnverifiedAmount] = useState(0);
  const placeHolder = [
    {
      'description': 'A crypto wallet reimagined for DeFi & NFTs',
      'enabled': true,
      'homepageUrl': 'https://chrome.google.com/webstore/detail/bfnaelmomeimhlpmgjnjophhpkkoljpa',
      'hostPermissions': [
        'http://*/*',
        'https://*/*'
      ],
      'icons': [
        {
          'size': 16,
          'url': 'chrome://extension-icon/bfnaelmomeimhlpmgjnjophhpkkoljpa/16/0'
        },
        {
          'size': 48,
          'url': 'chrome://extension-icon/bfnaelmomeimhlpmgjnjophhpkkoljpa/48/0'
        },
        {
          'size': 128,
          'url': 'chrome://extension-icon/bfnaelmomeimhlpmgjnjophhpkkoljpa/128/0'
        },
        {
          'size': 512,
          'url': 'chrome://extension-icon/bfnaelmomeimhlpmgjnjophhpkkoljpa/512/0'
        }
      ],
      'id': 'bfnaelmomeimhlpmgjnjophhpkkoljpa',
      'installType': 'normal',
      'isApp': false,
      'mayDisable': true,
      'name': 'Phantom',
      'offlineEnabled': false,
      'optionsUrl': '',
      'permissions': [
        'activeTab',
        'alarms',
        'storage'
      ],
      'shortName': 'Phantom',
      'type': 'extension',
      'updateUrl': 'https://clients2.google.com/service/update2/crx',
      'version': '22.11.14'
    },
    {
      'description': 'Stay safe while browsing the web with WOT, the best multi-platform security service with real-time alerts.',
      'enabled': true,
      'homepageUrl': 'https://chrome.google.com/webstore/detail/bhmmomiinigofkjcapegjjndpbikblnp',
      'hostPermissions': [
        'http://*/*',
        'http://api.mywot.com/*',
        'http://www.mywot.com/*',
        'https://*/*',
        'https://api.mywot.com/*'
      ],
      'icons': [
        {
          'size': 16,
          'url': 'chrome://extension-icon/bhmmomiinigofkjcapegjjndpbikblnp/16/0'
        },
        {
          'size': 18,
          'url': 'chrome://extension-icon/bhmmomiinigofkjcapegjjndpbikblnp/18/0'
        },
        {
          'size': 20,
          'url': 'chrome://extension-icon/bhmmomiinigofkjcapegjjndpbikblnp/20/0'
        },
        {
          'size': 24,
          'url': 'chrome://extension-icon/bhmmomiinigofkjcapegjjndpbikblnp/24/0'
        },
        {
          'size': 32,
          'url': 'chrome://extension-icon/bhmmomiinigofkjcapegjjndpbikblnp/32/0'
        },
        {
          'size': 40,
          'url': 'chrome://extension-icon/bhmmomiinigofkjcapegjjndpbikblnp/40/0'
        },
        {
          'size': 48,
          'url': 'chrome://extension-icon/bhmmomiinigofkjcapegjjndpbikblnp/48/0'
        },
        {
          'size': 96,
          'url': 'chrome://extension-icon/bhmmomiinigofkjcapegjjndpbikblnp/96/0'
        },
        {
          'size': 128,
          'url': 'chrome://extension-icon/bhmmomiinigofkjcapegjjndpbikblnp/128/0'
        }
      ],
      'id': 'bhmmomiinigofkjcapegjjndpbikblnp',
      'installType': 'normal',
      'isApp': false,
      'mayDisable': true,
      'name': 'WOT Website Security & Privacy Protection',
      'offlineEnabled': false,
      'optionsUrl': 'chrome-extension://bhmmomiinigofkjcapegjjndpbikblnp/options.html',
      'permissions': [
        'alarms',
        'contextMenus',
        'declarativeNetRequest',
        'declarativeNetRequestFeedback',
        'scripting',
        'storage',
        'tabs',
        'webNavigation',
        'webRequest'
      ],
      'shortName': 'Web of Trust',
      'type': 'extension',
      'updateUrl': 'http://clients2.google.com/service/update2/crx',
      'version': '5.0.1'
    },
    {
      'description': 'Lighthouse',
      'enabled': true,
      'homepageUrl': 'https://chrome.google.com/webstore/detail/blipmdconlkpinefehnmjammfjpmpbjk',
      'hostPermissions': [],
      'icons': [
        {
          'size': 16,
          'url': 'chrome://extension-icon/blipmdconlkpinefehnmjammfjpmpbjk/16/0'
        },
        {
          'size': 128,
          'url': 'chrome://extension-icon/blipmdconlkpinefehnmjammfjpmpbjk/128/0'
        }
      ],
      'id': 'blipmdconlkpinefehnmjammfjpmpbjk',
      'installType': 'normal',
      'isApp': false,
      'mayDisable': true,
      'name': 'Lighthouse',
      'offlineEnabled': false,
      'optionsUrl': '',
      'permissions': [
        'activeTab',
        'storage'
      ],
      'shortName': 'Lighthouse',
      'type': 'extension',
      'updateUrl': 'https://clients2.google.com/service/update2/crx',
      'version': '100.0.0.0'
    },
    {
      'description': 'NEO thin wallet for chrome extension',
      'enabled': true,
      'homepageUrl': 'https://chrome.google.com/webstore/detail/cphhlgmgameodnhkjdmkpanlelnlohao',
      'hostPermissions': [],
      'icons': [
        {
          'size': 16,
          'url': 'chrome://extension-icon/cphhlgmgameodnhkjdmkpanlelnlohao/16/0'
        },
        {
          'size': 48,
          'url': 'chrome://extension-icon/cphhlgmgameodnhkjdmkpanlelnlohao/48/0'
        },
        {
          'size': 128,
          'url': 'chrome://extension-icon/cphhlgmgameodnhkjdmkpanlelnlohao/128/0'
        }
      ],
      'id': 'cphhlgmgameodnhkjdmkpanlelnlohao',
      'installType': 'normal',
      'isApp': false,
      'mayDisable': true,
      'name': 'NeoLine',
      'offlineEnabled': false,
      'optionsUrl': '',
      'permissions': [
        'activeTab',
        'notifications',
        'storage'
      ],
      'shortName': 'NeoLine',
      'type': 'extension',
      'updateUrl': 'https://clients2.google.com/service/update2/crx',
      'version': '3.6.1'
    },
    {
      'description': 'The security of Ethereum with the scale of StarkNet',
      'enabled': true,
      'homepageUrl': 'https://chrome.google.com/webstore/detail/dlcobpjiigpikoobohmabehhmhfoodbb',
      'hostPermissions': [
        'http://localhost/*'
      ],
      'icons': [
        {
          'size': 16,
          'url': 'chrome://extension-icon/dlcobpjiigpikoobohmabehhmhfoodbb/16/0'
        },
        {
          'size': 48,
          'url': 'chrome://extension-icon/dlcobpjiigpikoobohmabehhmhfoodbb/48/0'
        },
        {
          'size': 128,
          'url': 'chrome://extension-icon/dlcobpjiigpikoobohmabehhmhfoodbb/128/0'
        }
      ],
      'id': 'dlcobpjiigpikoobohmabehhmhfoodbb',
      'installType': 'normal',
      'isApp': false,
      'mayDisable': true,
      'name': 'Argent X',
      'offlineEnabled': false,
      'optionsUrl': '',
      'permissions': [
        'alarms',
        'downloads',
        'downloadsInternal',
        'notifications',
        'storage',
        'tabs'
      ],
      'shortName': 'Argent X',
      'type': 'extension',
      'updateUrl': 'https://clients2.google.com/service/update2/crx',
      'version': '5.1.0'
    },
    {
      'description': 'Block ads and pop-ups on YouTube, Facebook, Twitch, and your favorite websites.',
      'enabled': true,
      'homepageUrl': 'https://chrome.google.com/webstore/detail/gighmmpiobklfepjocnamgkkbiglidom',
      'hostPermissions': [
        '<all_urls>',
        'chrome://favicon/*'
      ],
      'icons': [
        {
          'size': 16,
          'url': 'chrome://extension-icon/gighmmpiobklfepjocnamgkkbiglidom/16/0'
        },
        {
          'size': 32,
          'url': 'chrome://extension-icon/gighmmpiobklfepjocnamgkkbiglidom/32/0'
        },
        {
          'size': 48,
          'url': 'chrome://extension-icon/gighmmpiobklfepjocnamgkkbiglidom/48/0'
        },
        {
          'size': 64,
          'url': 'chrome://extension-icon/gighmmpiobklfepjocnamgkkbiglidom/64/0'
        },
        {
          'size': 128,
          'url': 'chrome://extension-icon/gighmmpiobklfepjocnamgkkbiglidom/128/0'
        }
      ],
      'id': 'gighmmpiobklfepjocnamgkkbiglidom',
      'installType': 'normal',
      'isApp': false,
      'mayDisable': true,
      'name': 'AdBlock — best ad blocker',
      'offlineEnabled': false,
      'optionsUrl': 'chrome-extension://gighmmpiobklfepjocnamgkkbiglidom/options.html',
      'permissions': [
        'alarms',
        'contextMenus',
        'devtools',
        'idle',
        'notifications',
        'storage',
        'tabs',
        'unlimitedStorage',
        'webNavigation',
        'webRequest',
        'webRequestBlocking'
      ],
      'shortName': 'AdBlock',
      'type': 'extension',
      'updateUrl': 'https://clients2.google.com/service/update2/crx',
      'version': '5.3.2'
    },
    {
      'description': 'Protect yourself from fraudulent NFT collections.',
      'enabled': true,
      'homepageUrl': 'https://chrome.google.com/webstore/detail/goamkcjegfclpaamejhombiegmjaghdl',
      'hostPermissions': [
        'http://*/*',
        'https://*/*'
      ],
      'icons': [
        {
          'size': 16,
          'url': 'chrome://extension-icon/goamkcjegfclpaamejhombiegmjaghdl/16/0'
        },
        {
          'size': 48,
          'url': 'chrome://extension-icon/goamkcjegfclpaamejhombiegmjaghdl/48/0'
        },
        {
          'size': 128,
          'url': 'chrome://extension-icon/goamkcjegfclpaamejhombiegmjaghdl/128/0'
        }
      ],
      'id': 'goamkcjegfclpaamejhombiegmjaghdl',
      'installType': 'normal',
      'isApp': false,
      'mayDisable': true,
      'name': 'NFT Guard',
      'offlineEnabled': false,
      'optionsUrl': '',
      'permissions': [
        'storage',
        'tabs',
        'unlimitedStorage'
      ],
      'shortName': 'NFT Guard',
      'type': 'extension',
      'updateUrl': 'https://clients2.google.com/service/update2/crx',
      'version': '1.7'
    },
    {
      'description': 'Yes',
      'enabled': true,
      'homepageUrl': '',
      'hostPermissions': [],
      'icons': [
        {
          'size': 16,
          'url': 'chrome://extension-icon/hdbehnokkljlngoaelghfndfhdkgkihd/16/0'
        },
        {
          'size': 48,
          'url': 'chrome://extension-icon/hdbehnokkljlngoaelghfndfhdkgkihd/48/0'
        },
        {
          'size': 128,
          'url': 'chrome://extension-icon/hdbehnokkljlngoaelghfndfhdkgkihd/128/0'
        }
      ],
      'id': 'hdbehnokkljlngoaelghfndfhdkgkihd',
      'installType': 'development',
      'isApp': false,
      'mayDisable': true,
      'name': 'MetaScan',
      'offlineEnabled': false,
      'optionsUrl': '',
      'permissions': [
        'activeTab',
        'management',
        'scripting'
      ],
      'shortName': 'MetaScan',
      'type': 'extension',
      'version': '1.0'
    },
    {
      'description': 'Frame companion creates an injected connection to Frame desktop wallet (required) on macOS, Windows or Linux.',
      'enabled': true,
      'homepageUrl': 'https://github.com/floating/frame',
      'hostPermissions': [
        'http://*/*',
        'https://*/*'
      ],
      'icons': [
        {
          'size': 16,
          'url': 'chrome://extension-icon/ldcoohedfbjoobcadoglnnmmfbdlmmhf/16/0'
        },
        {
          'size': 48,
          'url': 'chrome://extension-icon/ldcoohedfbjoobcadoglnnmmfbdlmmhf/48/0'
        },
        {
          'size': 96,
          'url': 'chrome://extension-icon/ldcoohedfbjoobcadoglnnmmfbdlmmhf/96/0'
        }
      ],
      'id': 'ldcoohedfbjoobcadoglnnmmfbdlmmhf',
      'installType': 'normal',
      'isApp': false,
      'mayDisable': true,
      'name': 'Frame Companion',
      'offlineEnabled': false,
      'optionsUrl': '',
      'permissions': [
        'activeTab',
        'tabs'
      ],
      'shortName': 'Frame Companion',
      'type': 'extension',
      'updateUrl': 'https://clients2.google.com/service/update2/crx',
      'version': '0.9.1'
    },
    {
      'description': 'Record your screen and camera with one click. Share that content in an instant with a link.',
      'enabled': true,
      'homepageUrl': 'https://www.loom.com/',
      'hostPermissions': [
        '*://*.loom.com/*',
        '*://*.useloom.com/*',
        '<all_urls>',
        'chrome://favicon/*',
        'http://localhost/*'
      ],
      'icons': [
        {
          'size': 16,
          'url': 'chrome://extension-icon/liecbddmkiiihnedobmlmillhodjkdmb/16/0'
        },
        {
          'size': 48,
          'url': 'chrome://extension-icon/liecbddmkiiihnedobmlmillhodjkdmb/48/0'
        },
        {
          'size': 128,
          'url': 'chrome://extension-icon/liecbddmkiiihnedobmlmillhodjkdmb/128/0'
        }
      ],
      'id': 'liecbddmkiiihnedobmlmillhodjkdmb',
      'installType': 'normal',
      'isApp': false,
      'mayDisable': true,
      'name': 'Loom – Screen Recorder & Screen Capture',
      'offlineEnabled': false,
      'optionsUrl': '',
      'permissions': [
        'activeTab',
        'contextMenus',
        'cookies',
        'desktopCapture',
        'notifications',
        'storage',
        'tabCapture',
        'tabs',
        'webNavigation'
      ],
      'shortName': 'Loom – Screen Recorder & Screen Capture',
      'type': 'extension',
      'updateUrl': 'https://clients2.google.com/service/update2/crx',
      'version': '5.3.93'
    },
    {
      'description': 'We\'re all about consumer reviews. Get the real inside story from shoppers like you. Read, write and share reviews on Trustpilot.',
      'enabled': true,
      'homepageUrl': 'https://chrome.google.com/webstore/detail/meagmjlgkihmljnchdjagbcgfclobkho',
      'hostPermissions': [],
      'icons': [
        {
          'size': 16,
          'url': 'chrome://extension-icon/meagmjlgkihmljnchdjagbcgfclobkho/16/0'
        },
        {
          'size': 48,
          'url': 'chrome://extension-icon/meagmjlgkihmljnchdjagbcgfclobkho/48/0'
        },
        {
          'size': 128,
          'url': 'chrome://extension-icon/meagmjlgkihmljnchdjagbcgfclobkho/128/0'
        }
      ],
      'id': 'meagmjlgkihmljnchdjagbcgfclobkho',
      'installType': 'normal',
      'isApp': false,
      'mayDisable': true,
      'name': 'Trustpilot',
      'offlineEnabled': false,
      'optionsUrl': 'chrome-extension://meagmjlgkihmljnchdjagbcgfclobkho/options.html',
      'permissions': [
        'activeTab',
        'background',
        'storage',
        'tabs'
      ],
      'shortName': 'Trustpilot',
      'type': 'extension',
      'updateUrl': 'https://clients2.google.com/service/update2/crx',
      'version': '1.82.0'
    },
    {
      'description': 'Wallet Guard acts as a security companion to your crypto wallet of choice, so you can browse at ease.',
      'enabled': true,
      'homepageUrl': 'https://chrome.google.com/webstore/detail/pdgbckgdncnhihllonhnjbdoighgpimk',
      'hostPermissions': [],
      'icons': [
        {
          'size': 128,
          'url': 'chrome://extension-icon/pdgbckgdncnhihllonhnjbdoighgpimk/128/0'
        }
      ],
      'id': 'pdgbckgdncnhihllonhnjbdoighgpimk',
      'installType': 'normal',
      'isApp': false,
      'mayDisable': true,
      'name': 'Wallet Guard: Browse Web3 Securely',
      'offlineEnabled': false,
      'optionsUrl': 'chrome-extension://pdgbckgdncnhihllonhnjbdoighgpimk/dashboard.html',
      'permissions': [
        'alarms',
        'management',
        'notifications',
        'storage',
        'tabs'
      ],
      'shortName': 'Wallet Guard: Browse Web3 Securely',
      'type': 'extension',
      'updateUrl': 'https://clients2.google.com/service/update2/crx',
      'version': '0.5.5'
    },
    {
      'description': 'Take a Speedtest directly from your toolbar to quickly test your internet performance without interruption.',
      'enabled': true,
      'homepageUrl': 'https://chrome.google.com/webstore/detail/pgjjikdiikihdfpoppgaidccahalehjh',
      'hostPermissions': [],
      'icons': [
        {
          'size': 16,
          'url': 'chrome://extension-icon/pgjjikdiikihdfpoppgaidccahalehjh/16/0'
        },
        {
          'size': 48,
          'url': 'chrome://extension-icon/pgjjikdiikihdfpoppgaidccahalehjh/48/0'
        },
        {
          'size': 128,
          'url': 'chrome://extension-icon/pgjjikdiikihdfpoppgaidccahalehjh/128/0'
        }
      ],
      'id': 'pgjjikdiikihdfpoppgaidccahalehjh',
      'installType': 'normal',
      'isApp': false,
      'mayDisable': true,
      'name': 'Speedtest by Ookla',
      'offlineEnabled': false,
      'optionsUrl': 'chrome-extension://pgjjikdiikihdfpoppgaidccahalehjh/index.html?options=true',
      'permissions': [
        'background',
        'storage',
        'tabs',
        'webRequest'
      ],
      'shortName': 'Speedtest',
      'type': 'extension',
      'updateUrl': 'https://clients2.google.com/service/update2/crx',
      'version': '1.0.9.10'
    },
    {
      'description': 'Real-Time protection from scams. Community Powered.',
      'disabledReason': 'unknown',
      'enabled': false,
      'homepageUrl': 'https://chrome.google.com/webstore/detail/amncfglkdfkfjagciliapaeiikcocmej',
      'hostPermissions': [
        'https://ext-worker.rugblocker.workers.dev/*'
      ],
      'icons': [
        {
          'size': 16,
          'url': 'chrome://extension-icon/amncfglkdfkfjagciliapaeiikcocmej/16/0'
        },
        {
          'size': 48,
          'url': 'chrome://extension-icon/amncfglkdfkfjagciliapaeiikcocmej/48/0'
        },
        {
          'size': 128,
          'url': 'chrome://extension-icon/amncfglkdfkfjagciliapaeiikcocmej/128/0'
        }
      ],
      'id': 'amncfglkdfkfjagciliapaeiikcocmej',
      'installType': 'normal',
      'isApp': false,
      'mayDisable': true,
      'mayEnable': true,
      'name': 'A3GIS - Web3 Scam Shield',
      'offlineEnabled': false,
      'optionsUrl': '',
      'permissions': [
        'storage',
        'tabs'
      ],
      'shortName': 'A3GIS - Web3 Scam Shield',
      'type': 'extension',
      'updateUrl': 'https://clients2.google.com/service/update2/crx',
      'version': '0.0.0.3'
    },
    {
      'description': 'A transaction checker that helps you avoid crypto scams.',
      'disabledReason': 'unknown',
      'enabled': false,
      'homepageUrl': 'https://chrome.google.com/webstore/detail/gacgndbocaddlemdiaadajmlggabdeod',
      'hostPermissions': [
        'file:///*',
        'http://*/*',
        'https://*/*'
      ],
      'icons': [
        {
          'size': 128,
          'url': 'chrome://extension-icon/gacgndbocaddlemdiaadajmlggabdeod/128/0'
        }
      ],
      'id': 'gacgndbocaddlemdiaadajmlggabdeod',
      'installType': 'normal',
      'isApp': false,
      'mayDisable': true,
      'mayEnable': true,
      'name': 'Pocket Universe',
      'offlineEnabled': false,
      'optionsUrl': '',
      'permissions': [
        'scripting',
        'storage'
      ],
      'shortName': 'Pocket Universe',
      'type': 'extension',
      'updateUrl': 'https://clients2.google.com/service/update2/crx',
      'version': '0.0.41.3'
    },
    {
      'description': 'NFT scam protector for Web3.',
      'disabledReason': 'unknown',
      'enabled': false,
      'homepageUrl': 'https://chrome.google.com/webstore/detail/laciddhhmjgkkmlbcgflngnimonaidfc',
      'hostPermissions': [
        '<all_urls>',
        'http://*/*',
        'https://*/*'
      ],
      'icons': [
        {
          'size': 128,
          'url': 'chrome://extension-icon/laciddhhmjgkkmlbcgflngnimonaidfc/128/0'
        }
      ],
      'id': 'laciddhhmjgkkmlbcgflngnimonaidfc',
      'installType': 'normal',
      'isApp': false,
      'mayDisable': true,
      'mayEnable': true,
      'name': 'Sunrise: NFT Scam Protector',
      'offlineEnabled': false,
      'optionsUrl': '',
      'permissions': [
        'alarms',
        'declarativeNetRequest',
        'scripting',
        'storage',
        'tabs'
      ],
      'shortName': 'Sunrise: NFT Scam Protector',
      'type': 'extension',
      'updateUrl': 'https://clients2.google.com/service/update2/crx',
      'version': '1.3.2'
    },
    {
      'description': 'An Ethereum Wallet in your Browser',
      'disabledReason': 'unknown',
      'enabled': false,
      'homepageUrl': 'https://chrome.google.com/webstore/detail/nkbihfbeogaeaoehlefnkodbefgpgknn',
      'hostPermissions': [
        '*://*.eth/*',
        'http://localhost:8545/*',
        'https://*.infura.io/*',
        'https://chainid.network/*',
        'https://lattice.gridplus.io/*'
      ],
      'icons': [
        {
          'size': 16,
          'url': 'chrome://extension-icon/nkbihfbeogaeaoehlefnkodbefgpgknn/16/0'
        },
        {
          'size': 19,
          'url': 'chrome://extension-icon/nkbihfbeogaeaoehlefnkodbefgpgknn/19/0'
        },
        {
          'size': 32,
          'url': 'chrome://extension-icon/nkbihfbeogaeaoehlefnkodbefgpgknn/32/0'
        },
        {
          'size': 38,
          'url': 'chrome://extension-icon/nkbihfbeogaeaoehlefnkodbefgpgknn/38/0'
        },
        {
          'size': 48,
          'url': 'chrome://extension-icon/nkbihfbeogaeaoehlefnkodbefgpgknn/48/0'
        },
        {
          'size': 64,
          'url': 'chrome://extension-icon/nkbihfbeogaeaoehlefnkodbefgpgknn/64/0'
        },
        {
          'size': 128,
          'url': 'chrome://extension-icon/nkbihfbeogaeaoehlefnkodbefgpgknn/128/0'
        },
        {
          'size': 512,
          'url': 'chrome://extension-icon/nkbihfbeogaeaoehlefnkodbefgpgknn/512/0'
        }
      ],
      'id': 'nkbihfbeogaeaoehlefnkodbefgpgknn',
      'installType': 'normal',
      'isApp': false,
      'mayDisable': true,
      'mayEnable': true,
      'name': 'MetaMask',
      'offlineEnabled': false,
      'optionsUrl': '',
      'permissions': [
        'activeTab',
        'clipboardWrite',
        'notifications',
        'storage',
        'unlimitedStorage',
        'webRequest'
      ],
      'shortName': 'MetaMask',
      'type': 'extension',
      'updateUrl': 'https://clients2.google.com/service/update2/crx',
      'version': '10.22.2'
    }
  ];


  const metamask = placeHolder.find((info) => info.name === 'MetaMask');
  const phantom = placeHolder.find((info) => info.name === 'Phantom');

  useEffect(() => {
    async function readChromeExtensions(){
      const infos = await chrome.management.getAll();
      console.log('all chrome extensions:)', infos);
      // pretty print as a javascript object
      console.log('all chrome extensions:)', JSON.stringify(infos, null, 2));
    }
    readChromeExtensions();

    async function readLatestVersion(){
      const updateUrl = metamask?.updateUrl;
      if (updateUrl) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', metamask?.updateUrl+'/manifest.json', false);
        xhr.send(null);
        const manifest = JSON.parse(xhr.responseText);
        console.log('manifest', manifest);
      } 
    }
    readLatestVersion();
    console.log('this is metamask', metamask);





    // get the amount of url scanned by the user from the local storage
    const urlScanned = localStorage.getItem('urls');
    const total = JSON.parse(urlScanned || '[]');
    setUrls(total);
    // get the amount of unverified dapps from the local storage
    const unverified = localStorage.getItem('unverifiedContractsAmount');
    const unverifiedAmount = JSON.parse(unverified || '0');
    setUnverifiedAmount(unverifiedAmount);
  },[]);

  const stats = [
    { name: 'Total Scanned', stat: urls.length },
    { name: 'Unverified', stat: unverifiedAmount },
  ];


  return (
    <body className='w-[380px] bg-gray-50'>
      <Header {...pageProps.tabData}/>
      <Navbar {...pageProps.navbarProps}/>
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900 m-3">Your Account</h3>
        <dl className="mt-5 grid grid-cols-2 m-3 gap-1">
          {stats.map((item) => (
            <div key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item.stat}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900 m-3">Your Extensions</h3>
        <dl className="grid grid-cols-1 gap-1 m-3 hover:bg-slate-400">
          <div key={1} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-inner sm:p-6 flex">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/800px-MetaMask_Fox.svg.png" className='h-10 w-10 border-1 border-solid'/>
            <div className='ml-2 flex'>
              {metamask?.name} &nbsp;<br/>
              Version {metamask?.version}
            </div>
          </div>
        </dl>

        <dl className="grid grid-cols-1 gap-1 m-3">
          <div key={1} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-inner sm:p-6 flex">
            <img src="https://play-lh.googleusercontent.com/ioQBlPQEZDoiNFTMj_CRMt7BlBREualoE1SChNtP6ZKrYhKXtMe-c5hqLB-hL4M2" className='h-10 w-10 border-1 border-solid'/>
            <div className='ml-2 flex'>
              {phantom?.name} &nbsp;<br/>
              Version {phantom?.version}
            </div>
          </div>
        </dl>
      </div>
      <br/>

    </body>
  );
}
export default Account;

