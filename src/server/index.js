require('dotenv').config();

require('ignore-styles');

//require('webpack-node-externals')();

require('@babel/register')({
	'presets': [
		['@babel/preset-env', {'targets': {'node': 'current'}}],
		'@babel/preset-react',
		'@babel/preset-typescript',
	]
});

require('asset-require-hook')({
	extensions: [
		// images
		'jpg',
		'png',
		'svg',
		'gif',
		'ico',
		// videos
		'mp4',
		'avi',
		// files
		'pdf',
	],
	name: '/assets/media/[name].[ext]',
});

require('asset-require-hook')({
	extensions: [
		// typography
		'ttf',
		'otf',
		'eot',
		'woff',
		'woff2',
	],
	name: '/assets/fonts/[name].[ext]',
});

require('./server');
