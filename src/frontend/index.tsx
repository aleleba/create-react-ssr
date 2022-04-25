import React from 'react';
import { hydrateRoot } from 'react-dom/client';
// Router
import { BrowserRouter as Router } from 'react-router-dom';
// Redux
import { Provider } from 'react-redux';
import { IInitialState } from './reducers/index.js';
import setStore from './setStore.js';
import { config } from '../config';

import './styles/global.sass';
import App from './components/App';
import serviceWorkerRegistration from '../serviceWorkerRegistration';

declare global {
	interface Window {
		__PRELOADED_STATE__?: IInitialState;
	}
}

declare global {
	interface NodeModule {
		hot?: IHot;
	}
}

interface IHot {
	accept: any
}

const { env } = config;

const preloadedState = window.__PRELOADED_STATE__;
const store = setStore({ initialState: preloadedState });

delete window.__PRELOADED_STATE__;

const container = document.getElementById('app')!;

// add "const root" to be able to rerender.
hydrateRoot(container,
	<Provider store={store}>
		<Router>
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
        <Router>
            <App />
        </Router>
    </Provider>
); */

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
//serviceWorker.register();

if((env) && (env === 'production')){
	serviceWorkerRegistration();
}

if(module.hot){
	module.hot.accept();
}
