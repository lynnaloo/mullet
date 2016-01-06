import { combineReducers } from 'redux';
import { CLICK_COLOR } from '../actions/actions';

function switchColor(state = "blue", action) {
  switch (action.type) {
    case CLICK_COLOR:
      return action.color
    default:
      return state
  }
};

const appReducer = combineReducers({
  switchColor
});

export default appReducer;
