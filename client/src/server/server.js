//Dependencies of Server
import express from 'express';
import { config } from '../../config';
import webpack from 'webpack';
import helmet from 'helmet';

//Dependencies of HotReloading
import webpackConfig from '../../webpack.config.dev';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

//Dependencies of SSR
import React from 'react';
import { renderToString } from 'react-dom/server';
//Router
import { StaticRouter } from 'react-router-dom/server';
import routes from '../routes';
//Redux
import { Provider } from 'react-redux';
import setStore from '../frontend/setStore.js';
import initialState from '../frontend/reducers/initialState';
//Get Hashes
import getHashManifest from './getHashManifest';
//App
import App from '../frontend/components/App';

const { env, port } = config;

const routesUrls = routes.map( route => route.path);

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
	const baseUrl = __dirname.replace(/\/client(.*)/,'');
	const fullURL = `${baseUrl}/client/build` ;
	app
		.use((req, res, next) => {
			if(!req.hashManifest) req.hashManifest = getHashManifest();
			next();
		})
		.use(express.static(fullURL))
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
	const mainStyles = manifest ? manifest['frontend.css'] : 'assets/app.css';
	const mainBuild = manifest ? manifest['frontend.js'] : 'assets/app.js';
	const vendorBuild = manifest ? manifest['vendors.js'] : 'assets/vendor.js';
	const manifestJson = manifest ? `<link rel="manifest" href="${manifest['manifest.json']}">` : '';

	return(`
    <!DOCTYPE html>
    <html lang="es">
        <head>
            <meta charset="UTF-8">
			<link rel="shortcut icon" href="favicon.ico">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
			<meta name="theme-color" content="#000000">
			${manifestJson}
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

const renderApp = (req, res, next) => {
	if(routesUrls.includes(req.url)){
		const store = setStore({ initialState });
		const preloadedState = store.getState();
		const html = renderToString(
			<Provider store={store}>
				<StaticRouter location={req.url}>
					<App />
				</StaticRouter>
			</Provider>
		);
		res.send(setResponse(html, preloadedState, req.hashManifest));
	}
	next();
};

app
	.get('*', renderApp);


app.listen(port, (err) => {
	if(err) console.error(err);
	else console.log(`Server running on port ${port}`);
});
