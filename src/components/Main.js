import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './App';
import reducer  from '../reducers/reducer';

let store = createStore(reducer);

let rootElement = document.getElementById('facebook');
render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);
