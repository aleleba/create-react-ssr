import path  from 'path';
import * as dotenv from 'dotenv';
import webpack from 'webpack';
import CompressionWebpackPlugin from 'compression-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

const dotEnvToParse = dotenv.config();

const ROOT_DIR = path.resolve(__dirname);
const resolvePath = (...args) => path.resolve(ROOT_DIR, ...args);
const BUILD_DIR = resolvePath('build');
const { InjectManifest } = require('workbox-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const PUBLIC_URL = process.env.PUBLIC_URL || '/';

const frontendConfig = {
	entry: {
		frontend: `${ROOT_DIR}/src/frontend/index.tsx`,
	},
	output: {
		path: BUILD_DIR,
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
			'process.env': JSON.stringify(dotEnvToParse.parsed),
			'process.env.PUBLIC_URL': JSON.stringify(PUBLIC_URL),
		}),
		new CopyPlugin({
			patterns: [
				{
					from: `${ROOT_DIR}/public/manifest.json`, to: '',
				},
				{
					from: `${ROOT_DIR}/public/favicon.ico`, to: '',
				},
				{
					from: `${ROOT_DIR}/public/logo192.png`, to: '',
				},
				{
					from: `${ROOT_DIR}/public/logo512.png`, to: '',
				},
			]
		}),
		new InjectManifest({
			swSrc: './service-worker.ts',
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
		server: './src/server/index.ts',
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
			'process.env': JSON.stringify(dotEnvToParse.parsed),
			'process.env.PUBLIC_URL': JSON.stringify(PUBLIC_URL),
		}),
		new InjectManifest({
			swSrc: './service-worker.ts',
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
  
export default [frontendConfig, serverConfig];
