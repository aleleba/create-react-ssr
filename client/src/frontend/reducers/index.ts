import { combineReducers } from 'redux';
import testReducer, { ITestReducer } from './testReducer';

export interface IInitialState {
	testReducer?: ITestReducer | undefined
}

const rootReducer = combineReducers({
	// Here comes the reducers
	testReducer
});

export default rootReducer;
