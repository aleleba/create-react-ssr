const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
// const { config: { portDev, portReloadDev } } = require('./config');


module.exports = {
    entry: ['webpack-hot-middleware/client?path=/reload_wss&timeout=2000&overlay=false&reload=true', './frontend/index.js'],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'assets/app.js',
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.(js|jsx|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: { plugins: ['react-refresh/babel'] }
                },
            },
            {
                test: /\.(css|sass|scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ], 
            },
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new ReactRefreshWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'assets/app.css',
        }),
    ],
    /* devServer: {
        static: {
            directory: path.join(__dirname, 'build')
        },
        allowedHosts: "all",
        compress: true,
        port: portDev,
        hot: true,
        client: {
            reconnect: true,
            webSocketURL: {
                port: portReloadDev ? portReloadDev : portDev,
            }
        },
    }, */
}
