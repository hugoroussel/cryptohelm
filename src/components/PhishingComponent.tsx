import React from 'react';
import { CheckBadgeIcon, DocumentCheckIcon } from '@heroicons/react/20/solid';


function PhishingComponent(){
  return (
    <div>
      <div className="grid grid-cols-5 mr-12">
        <div className='flex col-start-3 col-span-3'>
          <CheckBadgeIcon className="h-7 w-7 text-blue-400"/>
          <span className='pt-1.5'>No phishing</span>
        </div>
      </div>
      <div className="grid grid-cols-5 mr-12">
        <div className='flex col-start-3 col-span-3'>
          <DocumentCheckIcon className="h-7 w-7 text-green-400"/>
          <span className='pt-1.5'>Found Audits</span>
        </div>
      </div>
    </div>
  );   
}
export default PhishingComponent;