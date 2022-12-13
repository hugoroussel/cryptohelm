export function getImageOfLogoUsingChainId(chainId: number) {
  switch (chainId) {
  case 1:
    return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png';
  case 10:
    return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png';
  case 137:
    return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png';
  case 42161:
    return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png';
  case 43114:
    return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchec/info/logo.png';
  case 56:
    return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png';
  case 250:
    return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/fantom/info/logo.png';
  case 42220:
    return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/celo/info/logo.png';
  case 1284:
    return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/moonbeam/info/logo.png';
  case 100:
    return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/xdai/info/logo.png';  
  }
}

export function returnBlockchainExplorerLinkWithChainId(chainId: number) {
  switch (chainId) {
  case 1:
    return 'https://etherscan.io';
  case 3:
    return 'https://ropsten.etherscan.io';
  case 42:  
    return 'https://kovan.etherscan.io';
  case 5:
    return 'https://goerli.etherscan.io';
  case 10:
    return 'https://optimistic.etherscan.io';
  case 137:
    return 'https://polygonscan.com';
  case 42161:
    return 'https://arbiscan.io';
  case 43114:
    return 'https://snowtrace.io';
  case 56:
    return 'https://bscscan.com';
  case 250:
    return 'https://ftmscan.com';
  case 42220:
    return 'https://celoscan.io';
  case 1284:
    return 'https://moonbeam.moonscan.io';
  case 100:
    return 'https://gnosisscan.io/';  
  }
}



export function percentToColor(p: number) :string{
  if (p>=95){
    return '#29e83c';
  } else if (p>=90){
    return '#b6e829';
  } else if (p>=85) {
    return '#E8E029';
  } else if (p >=80) {
    return '#E8C929';
  } else if (p >=75) {
    return '#E8A729';
  } else if (p >=70) {
    return '#E87929';
  } else {
    return '#E84029';
  }

}