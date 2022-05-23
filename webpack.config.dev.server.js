const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackNodeExternals = require('webpack-node-externals');
const path = require('path');
const ROOT_DIR = path.resolve(__dirname);
const resolvePath = (...args) => path.resolve(ROOT_DIR, ...args);
const BUILD_DIR = resolvePath('build');
const scriptExtensions = /\.(tsx|ts|js|jsx|mjs)$/;
const styleExtensions = /\.(css|less|styl|scss|sass|sss)$/;
const fontsExtensions = /\.(eot|otf|ttf|woff|woff2)$/;
const fontsAndImagesExtensions = /\.(png|jpg|jpeg|gif|svg|ico|mp4|avi|ttf|otf|eot|woff|woff2|pdf)$/;

module.exports = {
  target: 'node',
  mode: 'development',
  name: 'server',
  entry: {
    server: `${ROOT_DIR}/src/server/index.ts`,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    alias: {
      '@app': path.resolve(__dirname, 'src/frontend/components/App'),
			'@components': path.resolve(__dirname, 'src/frontend/components/'),
			'@styles': path.resolve(__dirname, 'src/frontend/styles/'),
		}
  },
  module: {
    rules: [
      { 
        test: /\.(tsx|ts)$/, loader: "ts-loader", 
        exclude: /node_modules/ 
      },
      {
        test: scriptExtensions,
        use: {
          loader: 'babel-loader',
        },
        exclude: [/node_modules/, /src\/frontend/],
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
          'css-loader',
          'sass-loader',
				],
      },
      {
        test: fontsAndImagesExtensions,
        loader: 'file-loader',
				options: {
					name: '/assets/media/[name].[ext]',
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
  ],
};