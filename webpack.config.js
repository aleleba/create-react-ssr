const path = require('path');
const dotenv = require('dotenv').config();
const webpack = require('webpack');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const PUBLIC_URL = process.env.PUBLIC_URL || '/';

const frontendConfig = {
	entry: {
		frontend: './src/frontend/index.tsx',
	},
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'assets/app-[name]-[fullhash].js',
		publicPath: PUBLIC_URL,
	},
	resolve: {
		extensions: ['.js', '.jsx','.ts','.tsx', '.json'],
		alias: {
			'@components': path.resolve(__dirname, 'src/frontend/components/'),
			'@styles': path.resolve(__dirname, 'src/frontend/styles/'),
		}
	},
	mode: 'production',
	module: {
		rules: [
			{
				test: /\.(js|jsx|ts|tsx)$/,
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
		],
	},
	plugins: [
		new CompressionWebpackPlugin({
			test: /\.(js|css)$/,
			filename: '[path][base].gz',
		}),
		new MiniCssExtractPlugin({
			filename: 'assets/app-[fullhash].css',
		}),
		new WebpackManifestPlugin({
			fileName: 'assets/manifest-hash.json',
		}),
		new CleanWebpackPlugin({
			cleanOnceBeforeBuildPatterns: [
				'**/*',
				'!server/**',
			],
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
		new InjectManifest({
			swSrc: './service-worker.js',
			swDest: 'service-worker.js',
		}),
	],
	optimization: {
		minimize: true,
		minimizer: [
			new CssMinimizerPlugin(),
			new TerserPlugin(),
		],
		splitChunks: {
			chunks: 'async',
			cacheGroups: {
				vendors: {
					name: 'vendors',
					chunks: 'all',
					reuseExistingChunk: true,
					priority: 1,
					filename: 'assets/vendor-[name]-[fullhash].js',
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

const serverConfig = {
	entry: {
		server: './src/server/index.js',
	},
	target: "node",
	externals: [nodeExternals()],
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'server/app-[name].js',
		publicPath: PUBLIC_URL,
	},
	resolve: {
		extensions: ['.js', '.jsx','.ts','.tsx', '.json'],
		alias: {
			'@components': path.resolve(__dirname, 'src/frontend/components/'),
			'@styles': path.resolve(__dirname, 'src/frontend/styles/'),
		}
	},
	mode: 'production',
	module: {
		rules: [
			{
				test: /\.(js|jsx|ts|tsx)$/,
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
		],
	},
	plugins: [
		new CompressionWebpackPlugin({
			test: /\.(js|css)$/,
			filename: '[path][base].gz',
		}),
		new MiniCssExtractPlugin({
			filename: 'assets/app-[fullhash].css',
		}),
		new WebpackManifestPlugin({
			fileName: 'assets/manifest-hash.json',
		}),
		new CleanWebpackPlugin(),
		new ESLintPlugin(),
		new webpack.DefinePlugin({
			'process.env': JSON.stringify(dotenv.parsed),
			'process.env.PUBLIC_URL': JSON.stringify(PUBLIC_URL),
		}),
		new InjectManifest({
			swSrc: './service-worker.js',
			swDest: 'service-worker.js',
		}),
	],
	optimization: {
		minimize: true,
		minimizer: [
			new CssMinimizerPlugin(),
			new TerserPlugin(),
		],
		splitChunks: {
			chunks: 'async',
			cacheGroups: {
				vendors: {
					name: 'vendors',
					chunks: 'all',
					reuseExistingChunk: true,
					priority: 1,
					filename: 'assets/vendor-[name]-[fullhash].js',
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
  
  module.exports = [frontendConfig, serverConfig];
