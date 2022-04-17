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
import { StaticRouter } from "react-router-dom/server";
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

const setResponse = (html) => {
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
            <script src="assets/app.js" type="text/javascript"></script>
        </body>
    </html>
    `)
}

const renderApp = (req, res) => {
    const html = renderToString(
        <StaticRouter location={req.url}>
            <App />
        </StaticRouter>
    )
    res.send(setResponse(html));
};

app.get('*', renderApp)

app.listen(port, (err) => {
    if(err) console.error(err)
    else console.log(`Server running on port ${port}`);
});