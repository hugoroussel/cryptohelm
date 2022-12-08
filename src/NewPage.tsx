import React from 'react';
import {NewPageProps} from './structs';

function NewPage(pageProps: NewPageProps ) {

  return (
    <>
      <body className='w-[340px] h-[450px] bg-gray-900'>
        <div className="text-white">
          <h1>New Page</h1>
          <p>Here is a new page</p>
          <button onClick={(e) => {e.preventDefault();pageProps.setShowStart(!pageProps.showStart);}}>Back to Home</button>
        </div>
      </body>
    </>
  );
}

export default NewPage;