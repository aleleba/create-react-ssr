import React from 'react';
import { createRoot } from 'react-dom/client';
//Router
import { BrowserRouter as Router } from 'react-router-dom';
//History
import { createBrowserHistory } from 'history';
//Redux
import { createStore } from 'redux'; //, applyMiddleware
import { Provider } from 'react-redux';
import { composeWithDevTools as composeWithDevToolsWeb } from 'redux-devtools-extension';
import { config } from '../config';
import reducer from './reducers';
import initialState from './reducers/initialState';

import App from './components/App';
import './styles/global.sass';

//Redux DevTools
/* declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
} */

const { env } = config

const composeEnhancers = composeWithDevToolsWeb({
    // Specify here name, actionsBlacklist, actionsCreators and other options
});

const store = env === 'development' ? createStore(
    reducer,
    initialState,
    composeEnhancers(),
) : createStore(
    reducer,
    initialState,
)

const container = document.getElementById('app');
const root = createRoot(container);
const history = createBrowserHistory()

root.render(
    <Provider store={store}>
        <Router history={history}>
            <App tab="home" />
        </Router>
    </Provider>
);

if (module.hot) {
    module.hot.accept();
}