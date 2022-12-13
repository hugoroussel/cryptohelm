export interface ContractsPageProps {
    contracts: AddressCollection[];
    showContracts: boolean;
    setShowContracts: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface AddressCollection {
    // _id: mongoDB.ObjectId;
    address: string;
    lastUpdated: number;
    isContract: boolean;
    existsOn : number[];
    verifiedon: number[];
    nonverifiedon: number[];
}

export interface ERC20sPageProps {
    showTokens: boolean;
    setShowTokens: React.Dispatch<React.SetStateAction<boolean>>;
    serverLive: boolean;
    erc20s: TokenListToken[];
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