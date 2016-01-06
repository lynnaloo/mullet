import React, { Component} from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Container from './Container';
import appReducer  from '../reducers/appReducer'
import { clickColor } from '../actions/actions' 

let store = createStore(appReducer);

let rootElement = document.getElementById('facebook');
render(
  <Provider store={store}>
    <Container />
  </Provider>,
  rootElement
);
