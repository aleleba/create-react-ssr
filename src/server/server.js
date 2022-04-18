//Dependencies of Server
import express from 'express';
import { config } from '../config';
import webpack from 'webpack';

//Dependencies of HotReloading
import webpackConfig from '../webpack.config.dev';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

//Dependencies of SSR
import React from 'react';
import { renderToString } from 'react-dom/server';
//Router
import { StaticRouter } from "react-router-dom/server";
//Redux
import { createStore } from 'redux'; //, applyMiddleware
import { Provider } from 'react-redux';
import reducer from '../frontend/reducers';
import initialState from '../frontend/reducers/initialState';
//App
import App from '../frontend/components/App';

const { env, port } = config

const app = express();

if(env === 'development'){
    console.log('Development Config')
    
    const compiler = webpack(webpackConfig);
    const serverConfig = { 
        serverSideRender: true,
        publicPath: webpackConfig.output.publicPath,
    };

    app
    .use(webpackDevMiddleware(compiler, serverConfig))
    .use(webpackHotMiddleware(compiler, {
        path: "/reload_wss",
        heartbeat: 1000,
    }));
}

const setResponse = (html, preloadedState) => {
    return(`
    <!DOCTYPE html>
    <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="assets/app.css" rel="stylesheet" type="text/css"></link>
            <title>App</title>
        </head>
        <body>
            <div id="app">${html}</div>
            <script>
                window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
            </script>
            <script src="assets/app.js" type="text/javascript"></script>
        </body>
    </html>
    `)
}

const renderApp = (req, res) => {
    const store = createStore(reducer, initialState)
    const preloadedState = store.getState();
    const html = renderToString(
        <Provider store={store}>
            <StaticRouter location={req.url}>
                <App />
            </StaticRouter>
        </Provider>
    )
    res.send(setResponse(html, preloadedState));
};

app.get('*', renderApp)

app.listen(port, (err) => {
    if(err) console.error(err)
    else console.log(`Server running on port ${port}`);
});