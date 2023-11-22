import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpackNodeExternals from 'webpack-node-externals';
import WebpackShellPluginNext from 'webpack-shell-plugin-next';
import { resolveTsAliases } from 'resolve-ts-aliases';
import path from 'path';
import { Configuration } from 'webpack';
const ROOT_DIR = path.resolve(__dirname);
const resolvePath = (...args: string[]) => path.resolve(ROOT_DIR, ...args);
const BUILD_DIR = resolvePath('build');
const scriptExtensions = /\.(tsx|ts|js|jsx|mjs)$/;
const styleExtensions = /\.(css|less|styl|scss|sass|sss)$/;
const fontsExtensions = /\.(eot|otf|ttf|woff|woff2)$/;
const fontsAndImagesExtensions = /\.(png|jpg|jpeg|gif|svg|ico|mp4|avi|ttf|otf|eot|woff|woff2|pdf)$/;
const alias = resolveTsAliases(path.resolve('tsconfig.json'));

const config: Configuration = {
	target: 'node',
	mode: 'development',
	name: 'server',
	entry: {
		server: `${ROOT_DIR}/src/server/index.ts`,
	},
	resolve: {
		extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
		alias,
	},
	module: {
		rules: [
			{
				test: scriptExtensions,
				use: {
					loader: 'babel-loader',
				},
				exclude: /node_modules/,
			},
			{
				// Preprocess our own style files
				test: styleExtensions,
				exclude: /node_modules/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							emit: false,
						}
					},
					{
						'loader': 'css-loader',
						'options': {
							modules: {
								auto: /\.module\.\w+$/i,
							}
						},
					},
					'sass-loader',
				],
			},
			{
				test: fontsAndImagesExtensions,
				loader: 'file-loader',
				options: {
					name: 'assets/[name].[ext]',
					emitFile: false,
				},
			},
			{
				test: fontsExtensions,
				loader: 'url-loader',
				options: {
					name: 'assets/fonts/[name].[ext]',
					esModule: false,
				},
			}
		]
	},
	output: {
		path: BUILD_DIR,
		filename: '[name].js',
		libraryTarget: 'commonjs2',
	},
	node: false,
	externals: [webpackNodeExternals()],
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'assets/app.css',
		}),
		new WebpackShellPluginNext({
			onBuildEnd: {
				scripts: ['node build/server.js'],
				blocking: false,
				parallel: true
			}
		})
	],
};

export default config;
