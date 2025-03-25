/* eslint-disable @typescript-eslint/ban-ts-comment */
//Dependencies of Server
import express from 'express';
import webpack from 'webpack';
import helmet from 'helmet';
import { config } from '@config';

//Dependencies of HotReloading
import webpackConfig from '../../webpack.config.dev';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

//Dependencies of SSR
import React from 'react';
import { renderToString } from 'react-dom/server';
//Router
import { StaticRouter } from 'react-router-dom';
import routes from '../routes';
//Redux
import { Provider } from 'react-redux';
import setStore from '../frontend/setStore';
import initialState from '../frontend/reducers/initialState';
//Get Hashes
import { getHashManifest, haveVendorsCss } from './utilsServer';
//App
import App from '../frontend/components/App';

const { ENV, PORT, PREFIX_URL, ONLY_EXACT_PATH } = config;

const routesUrls = routes.map( route => route.path );

const isWin = process.platform === 'win32';

const app = express();

// @ts-ignore:next-line
const compiler = webpack(webpackConfig);
if(ENV === 'development'){
	const serverConfig = { 
		serverSideRender: true,
		publicPath: webpackConfig.output?.publicPath,
	};

	app
		.use(webpackDevMiddleware(compiler, serverConfig))
		.use(webpackHotMiddleware(compiler, {
			path: '/reload_wss',
			heartbeat: 1000,
		}));
}else{
	const baseUrl = __dirname.replace(/\/server(.*)/,'');
	const baseUrlWin = __dirname.replace(/\\server(.*)/,'');
	const fullURL = `${baseUrl}` ;
	const fullURLWin = `${baseUrlWin}` ;
	app
		.use((req, res, next) => {
			if(!req.hashManifest) req.hashManifest = getHashManifest();
			next();
		})
		.use(express.static(isWin ? fullURLWin : fullURL))
		.use(helmet())
		.use(helmet.permittedCrossDomainPolicies())
		.use(helmet({
			contentSecurityPolicy: {
				directives: {
					...helmet.contentSecurityPolicy.getDefaultDirectives(),
					'script-src': ['\'self\'', '\'unsafe-inline\''], //"example.com"
					'connectSrc': ['\'self\'', '\'unsafe-inline\'', 'localhost:*']
				},
			},
		}))
		.disable('x-powered-by');
}

const setResponse = (html, preloadedState, manifest) => {
	const mainStyles = manifest ? `/${manifest['frontend.css']}` : '/assets/main.css';
	const vendorStyles = manifest ? `/${manifest['vendors.css']}` : '/assets/vendors.css';
	const mainBuild = manifest ? `/${manifest['frontend.js']}` : '/assets/app.js';
	const vendorBuild = manifest ? `/${manifest['vendors.js']}` : '/assets/vendor.js';
	const manifestJson = manifest ? `<link rel="manifest" href="${manifest['manifest.json']}">` : '';
	const memoryFs = compiler.outputFileSystem;
	const haveVendor = haveVendorsCss(manifest, memoryFs);

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
			${haveVendor ? `<link href="${vendorStyles}" rel="stylesheet" type="text/css"></link>` : ''}
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
	const store = setStore({ initialState });
	const preloadedState = store.getState();
	const html = renderToString(
		// @ts-ignore:next-line
		<Provider store={store}>
			<StaticRouter location={`${PREFIX_URL}${req.url}`} basename={PREFIX_URL}>
				<App />
			</StaticRouter>
		</Provider>
	);
	if(ONLY_EXACT_PATH){
		if(routesUrls.includes(req.url)){
			res.send(setResponse(html, preloadedState, req.hashManifest));
		}
	} else {
		res.send(setResponse(html, preloadedState, req.hashManifest));
	}
	next();
};

app
	.get('*', renderApp);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
