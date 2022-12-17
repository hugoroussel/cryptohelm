import { DOMMessage, DOMMessageResponse } from '../types/DOMMessages';
 
// Function called when a new message is received
const messagesFromReactAppListener = (
  msg: DOMMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: DOMMessageResponse) => void) => {
  const headlines = Array.from(document.getElementsByTagName<'h1'>('h1'))
    .map(h1 => h1.innerText);
  // Prepare the response object with information about the site
  const response: DOMMessageResponse = {
    title: document.title,
    headlines
  };
  sendResponse(response);
};
 
/**
* Fired when a message is sent from either an extension process or a content script.
*/
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);

/*
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  console.log('tab changed!', tabId, changeInfo, tab);
});
*/