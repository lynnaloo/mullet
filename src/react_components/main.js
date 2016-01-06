'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Facebook from './facebook';

ReactDOM.render(
  <Facebook
    title="Welcome to the Mullet Stack."
    subtitle="Facebook in the front. Walmart in the back."
  />,
  document.getElementById('facebook')
);
