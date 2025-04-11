import { combineReducers } from 'redux';
import testReducer from './testReducer';
export * from './initialState';

const rootReducer = combineReducers({
	// Here comes the reducers
	testReducer
});

export default rootReducer;
