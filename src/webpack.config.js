const path = require('path');
const dotenv = require('dotenv').config();
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: './frontend/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'assets/app.js',
        publicPath: '/',
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            '@components': path.resolve(__dirname, 'src/components/'),
            '@styles': path.resolve(__dirname, 'frontend/styles/'),
        }
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
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
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'assets/app.css',
        }),
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(dotenv.parsed),
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin(),
        ],
    },
}
