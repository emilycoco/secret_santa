var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, 'client/build');
var APP_DIR = path.resolve(__dirname, 'client/src');

var config = {
    entry: ['babel-polyfill', APP_DIR + '/scripts/index.js'],
    output: {
        path: path.resolve(__dirname, BUILD_DIR),
        publicPath: 'client/build/',
        filename: 'bundle.js'
    },
    stylus: {
        use: [require('jeet')()]
    },
    resolve: {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.json', '.js', '.jsx', '.css', '.styl']
    },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.styl$/,
                loader: ExtractTextPlugin.extract('css-loader!stylus-loader'),
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('styles.css')
    ]
};


module.exports = config;