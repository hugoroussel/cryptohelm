export type DOMMessage = {
    type: 'GET_DOM';
    addresses: string;
}
  
export type DOMMessageResponse = {
    title: string;
    headlines: string[];
}