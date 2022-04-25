// Redux
import { createStore } from 'redux'; //, applyMiddleware
// import { Provider } from 'react-redux';
import { composeWithDevTools as composeWithDevToolsWeb } from 'redux-devtools-extension';
import { config } from '../../config';
import reducer from './reducers';

const { env } = config;

const composeEnhancers = composeWithDevToolsWeb({
	// Specify here name, actionsBlacklist, actionsCreators and other options
});

const setStore = ({ initialState }) => {
	const store = env === 'development' ? createStore(
		reducer,
		initialState,
		composeEnhancers(),
	) : createStore(
		reducer,
		initialState,
	);
	return store;
};

export default setStore;
