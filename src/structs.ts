


export interface AddressCollection {
    // _id: mongoDB.ObjectId;
    address: string;
    lastUpdated: number;
    isContract: boolean;
    existsOn : number[];
    verifiedOn: number[];
    NonVerifiedOn: number[];
}



export interface NewPageProps {
    showStart: boolean;
    setShowStart: React.Dispatch<React.SetStateAction<boolean>>;
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