import express from 'express';
import { config } from '../config';
import webpack from 'webpack';

const { env, port } = config

const app = express();

if(env === 'development'){
    console.log('Development Config')
    const webpackConfig = require('../webpack.config.dev');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
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

app.get('*', (req, res) => {
    res.send({ hello: 'express'});
})

app.listen(port, (err) => {
    if(err) console.error(err)
    else console.log(`Server running on port ${port}`);
});