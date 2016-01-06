import React, { Component} from 'react';
import { connect } from 'react-redux';
import Facebook from './facebook';
import { clickColor } from '../actions/actions' 

function select(state) {
  return {
    currentColor: state.switchColor
  }
};

export default class Container extends Component {
  render() {
    const { dispatch, currentColor } = this.props;
    return (
      <Facebook
        title="Welcome to the Mullet Stack."
        subtitle="Facebook in the front. Walmart in the back."
        color={currentColor}
        clickColor={color => dispatch(clickColor(color))}
      />
    );
  }
};

export default connect(select)(Container)
