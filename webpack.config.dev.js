const path = require('path');
const dotenv = require('dotenv').config();
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const PUBLIC_URL = process.env.PUBLIC_URL || '/';

module.exports = {
	entry: ['webpack-hot-middleware/client?path=/reload_wss&timeout=2000&reload=true&autoConnect=true', './src/frontend/index.tsx'],
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'assets/app.js',
		publicPath: PUBLIC_URL,
	},
	resolve: {
		extensions: ['.js', '.jsx','.ts','.tsx', '.json'],
		alias: {
			'@components': path.resolve(__dirname, 'src/frontend/components/'),
			'@styles': path.resolve(__dirname, 'src/frontend/styles/'),
		}
	},
	devtool: 'inline-source-map',
	mode: 'development',
	context: __dirname,
	module: {
		rules: [
			{
				test: /\.(js|jsx|ts|tsx)$/,
				use: {
					loader: 'babel-loader',
					options: { plugins: ['react-refresh/babel'] }
				},
				exclude: /node_modules/,
			},
			{
				test: /\.(css|sass|scss)$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'sass-loader',
				], 
			},
			{
				test: /\.(png|jpg|jpeg|gif|svg|ico|mp4|avi|ttf|otf|eot|woff|woff2|pdf)$/,
				loader: 'file-loader',
				options: {
					name: 'assets/media/[name].[ext]',
				},
			},
			{
				test: /\.(ttf|otf|eot|woff|woff2)$/,
				loader: 'url-loader',
				options: {
					name: 'assets/fonts/[name].[ext]',
					esModule: false,
				},
			},
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new ReactRefreshWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: 'assets/app.css',
		}),
		new ESLintPlugin(),
		new webpack.DefinePlugin({
			'process.env': JSON.stringify(dotenv.parsed),
			'process.env.PUBLIC_URL': JSON.stringify(PUBLIC_URL),
		}),
		new CopyPlugin({
			patterns: [
				{
					from: './public/manifest.json', to: '',
				},
				{
					from: './public/favicon.ico', to: '',
				},
				{
					from: './public/logo192.png', to: '',
				},
				{
					from: './public/logo512.png', to: '',
				},
			]
		}),
	],
	optimization: {
		splitChunks: {
			chunks: 'async',
			cacheGroups: {
				vendors: {
					name: 'vendors',
					chunks: 'all',
					reuseExistingChunk: true,
					priority: 1,
					filename: 'assets/vendor.js',
					enforce: true,
					test (module, chunks){
						const name = module.nameForCondition && module.nameForCondition();
						return chunks.name !== 'vendors' && /[\\/]node_modules[\\/]/.test(name);  
					},
				},
			},
		},
	},
};
