import path from 'path';
import * as dotenv from 'dotenv';
import webpack, {Configuration} from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

const dotEnvToParse = dotenv.config();

const ROOT_DIR = path.resolve(__dirname);
const resolvePath = (...args: string[]) => path.resolve(ROOT_DIR, ...args);
const BUILD_DIR = resolvePath('build');
const PUBLIC_URL = process.env.PUBLIC_URL || '/';

const config: Configuration = {
	entry: ['webpack-hot-middleware/client?path=/reload_wss&timeout=2000&reload=true&autoConnect=true', `${ROOT_DIR}/../src/frontend/index.tsx`],
	output: {
		path: BUILD_DIR,
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
			'process.env': JSON.stringify(dotEnvToParse.parsed),
			'process.env.PUBLIC_URL': JSON.stringify(PUBLIC_URL),
		}),
		new CopyPlugin({
			patterns: [
				{
					from: `${ROOT_DIR}/../public/manifest.json`, to: '',
				},
				{
					from: `${ROOT_DIR}/../public/favicon.ico`, to: '',
				},
				{
					from: `${ROOT_DIR}/../public/logo192.png`, to: '',
				},
				{
					from: `${ROOT_DIR}/../public/logo512.png`, to: '',
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
					test (module: { nameForCondition: () => any; }, chunks: { name: string; }){
						const name = module.nameForCondition && module.nameForCondition();
						return chunks.name !== 'vendors' && /[\\/]node_modules[\\/]/.test(name);  
					},
				},
			},
		},
	},
};

export default config
