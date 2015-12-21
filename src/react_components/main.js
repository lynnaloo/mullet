import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Facebook from './facebook';

export default class Main extends Component {
  render() {
    return (
      <Facebook
        title="Welcome to the Mullet Stack."
        subtitle="Facebook in the front. Walmart in the back."
      />
    );
  }
}

ReactDOM.render(
  <Main />,
  document.getElementById('facebook')
);
