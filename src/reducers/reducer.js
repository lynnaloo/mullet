import { combineReducers } from 'redux';
import { CHANGE_COLOR } from '../actions/actions';

function colorTypes(state = "blue", action) {
  switch (action.type) {
    case CHANGE_COLOR:
      return action.color
    default:
      return state
  }
};

const reducer = combineReducers({
  colorTypes
});

export default reducer;
