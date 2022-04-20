//Dependencies of Server
import express from 'express';
import { config } from '../config';
import webpack from 'webpack';
import helmet from 'helmet';

//Dependencies of HotReloading
import webpackConfig from '../webpack.config.dev';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

//Dependencies of SSR
import React from 'react';
import { renderToString } from 'react-dom/server';
//Router
import { StaticRouter } from 'react-router-dom/server';
//Redux
import { createStore } from 'redux'; //, applyMiddleware
import { Provider } from 'react-redux';
import reducer from '../frontend/reducers';
import initialState from '../frontend/reducers/initialState';
//Get Hashes
import getHashManifest from './getHashManifest';
//App
import App from '../frontend/components/App';

const { env, port } = config;

const app = express();

if(env === 'development'){
	const compiler = webpack(webpackConfig);
	const serverConfig = { 
		serverSideRender: true,
		publicPath: webpackConfig.output.publicPath,
	};

	app
		.use(webpackDevMiddleware(compiler, serverConfig))
		.use(webpackHotMiddleware(compiler, {
			path: '/reload_wss',
			heartbeat: 1000,
		}));
}else{
	app
		.use((req, res, next) => {
			if(!req.hashManifest) req.hashManifest = getHashManifest();
			next();
		})
		.use(express.static(`${__dirname}/../build`))
		.use(helmet())
		.use(helmet.permittedCrossDomainPolicies())
		.use(helmet({
			contentSecurityPolicy: {
				directives: {
					...helmet.contentSecurityPolicy.getDefaultDirectives(),
					'script-src': ['\'self\'', '\'unsafe-inline\''],//"example.com"
				},
			},
		}))
		.disable('x-powered-by');
}

const setResponse = (html, preloadedState, manifest) => {
	const mainStyles = manifest ? manifest['main.css'] : 'assets/app.css';
	const mainBuild = manifest ? manifest['main.js'] : 'assets/app.js';
	const vendorBuild = manifest ? manifest['vendors.js'] : 'assets/vendor.js';

	return(`
    <!DOCTYPE html>
    <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="${mainStyles}" rel="stylesheet" type="text/css"></link>
            <title>App</title>
        </head>
        <body>
            <div id="app">${html}</div>
            <script>
                window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
            </script>
            <script src="${mainBuild}" type="text/javascript"></script>
            <script src="${vendorBuild}" type="text/javascript"></script>
        </body>
    </html>
    `);
};

const renderApp = (req, res) => {
	const store = createStore(reducer, initialState);
	const preloadedState = store.getState();
	const html = renderToString(
		<Provider store={store}>
			<StaticRouter location={req.url}>
				<App />
			</StaticRouter>
		</Provider>
	);
	res.send(setResponse(html, preloadedState, req.hashManifest));
};

app.get('*', renderApp);

app.listen(port, (err) => {
	if(err) console.error(err);
	else console.log(`Server running on port ${port}`);
});
