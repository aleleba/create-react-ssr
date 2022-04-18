require('dotenv').config();

require('ignore-styles');

require('@babel/register')({
    "presets": [
        "@babel/preset-env",
        "@babel/preset-react"
    ]
});

require('asset-require-hook')({
    extensions: [
        //images
        'jpg',
        'png',
        'svg',
        'gif',
        //videos
        'mp4',
        'avi',
        //typography
        'ttf',
        'otf',
        'eot',
        //files
        'pdf'
    ],
    name: '/assets/[hash].[ext]',
});

require('./server');