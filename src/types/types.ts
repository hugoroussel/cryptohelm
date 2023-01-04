export interface PhishingWarningPageProps {
    showWarningPage : boolean;
    setShowWarningPage: React.Dispatch<React.SetStateAction<boolean>>;
    tab: chrome.tabs.Tab;
    tabData: TabData;
    description: string;
}


export interface AccountPageProps {
    // navbarProps: NavbarProps;
    tabData : TabData;
    navbarProps: NavbarProps;
}

export interface BetaPageProps {
    setShowBeta: React.Dispatch<React.SetStateAction<boolean>>;
    tabData : TabData;
}

export interface StatPageProps {
    // navbarProps: NavbarProps;
    tabData : TabData;
    navbarProps: NavbarProps;
    defillamaData: DefillamaData;
    foundDefillamaData: boolean;
}

export interface ExplorePageProps {
    // navbarProps: NavbarProps;
    tabData : TabData;
    navbarProps: NavbarProps;
}


export interface DefillamaData {
    tvl : number;
    fdv : number;
    mcap : number;
    name : string;
    logo : string;
    gecko_id : string;
    twitter : string;
    audits : number;
}

export interface NavbarProps {
    appTabs : AppTab[];
    setAppTabs: React.Dispatch<React.SetStateAction<AppTab[]>>;
    showAccount: boolean;
    setShowAccount: React.Dispatch<React.SetStateAction<boolean>>;
    showFAQ : boolean;
    setShowFAQ : React.Dispatch<React.SetStateAction<boolean>>;
    showStats : boolean;
    setShowStats : React.Dispatch<React.SetStateAction<boolean>>;
    showExplore : boolean;
    setShowExplore : React.Dispatch<React.SetStateAction<boolean>>;
}

export interface AppTab {
    name: string;
    icon: (props: React.ComponentProps<'svg'>) => JSX.Element;
    current: boolean;
}

export interface ContractsPageProps {
    contracts: AddressCollection[];
    showContracts: boolean;
    setShowContracts: React.Dispatch<React.SetStateAction<boolean>>;
    tabData : TabData;
}

export interface AddressCollection {
    // _id: mongoDB.ObjectId;
    address: string;
    lastUpdated: number;
    isContract: boolean;
    existsOn : number[];
    verifiedon: number[];
    unverifiedon: number[];
    tabData : TabData;
}

export interface ERC20sPageProps {
    showTokens: boolean;
    setShowTokens: React.Dispatch<React.SetStateAction<boolean>>;
    serverLive: boolean;
    erc20s: TokenListToken[];
    tabData : TabData;
}

export interface TabData {
    favIconUrl: string;
    title: string;
    url: string;
}
  
export interface TokenListToken {
    chainId: number;
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    logoURI: string;
}

export interface HeaderProps{
    tabData: TabData;
}