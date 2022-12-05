require('dotenv').config();

require('ignore-styles');

require('@babel/register')({
	'presets': [
		['@babel/preset-env', {'targets': {'node': 'current'}}],
		'@babel/preset-react',
		'@babel/preset-typescript',
	]
});

require('./server');
