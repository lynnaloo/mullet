import React, { Component} from 'react';
import { connect } from 'react-redux';
import Facebook from './facebook';
import { changeColor } from '../actions/actions' 

function select(state) {
  return {
    currentColor: state.colorTypes
  }
};

export default class App extends Component {
  render() {
    const { dispatch, currentColor } = this.props;
    return (
      <Facebook
        title="Welcome to the Mullet Stack."
        subtitle="Facebook in the front. Walmart in the back."
        color={currentColor}
        changeColor={color => dispatch(changeColor(color))}
      />
    );
  }
};

export default connect(select)(App)
