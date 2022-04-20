import React from 'react';
import { hydrateRoot } from 'react-dom/client';
// Router
import { BrowserRouter as Router } from 'react-router-dom';
// History
import { createBrowserHistory } from 'history';
// Redux
import { createStore } from 'redux'; //, applyMiddleware
import { Provider } from 'react-redux';
import { composeWithDevTools as composeWithDevToolsWeb } from 'redux-devtools-extension';
import { config } from '../config';
import reducer from './reducers';

import App from './components/App';
import './styles/global.sass';

// Redux DevTools
/* declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
} */

const { env } = config;

const composeEnhancers = composeWithDevToolsWeb({
	// Specify here name, actionsBlacklist, actionsCreators and other options
});

const preloadedState = window.__PRELOADED_STATE__;

const store = env === 'development' ? createStore(
	reducer,
	preloadedState,
	composeEnhancers(),
) : createStore(
	reducer,
	preloadedState,
);

delete window.__PRELOADED_STATE__;

const container = document.getElementById('app');
const history = createBrowserHistory();

// add "const root" to be able to rerender.
hydrateRoot(container,
	<Provider store={store}>
		<Router history={history}>
			<App />
		</Router>
	</Provider>,
	// Add this comment to update later app and remove warning
	/* { 
        onRecoverableError: (error) => {
          console.error("recoverable", error);
        }
    }, */
);

// Use root.render to update later the app
/* root.render(
    <Provider store={store}>
        <Router history={history}>
            <App />
        </Router>
    </Provider>
); */

if (module.hot) {
	module.hot.accept();
}
