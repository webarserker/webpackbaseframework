const path = require('path')
const webpack = require('webpack')
const htmlwebpackplugin = require('html-webpack-plugin')
const isDev = process.env.NODE_ENV === 'development'

let cleanOptions = {
    root: path.join(__dirname, '../'),
    verbose:  true
}

var config = {
    entry: {
        app: path.join(__dirname, '../client/app.js')
    },
    output: {
        filename: '[name].[hash].js',
        path: path.join(__dirname, '../dist'),
        publicPath: '/public/'
    },
    module: {
        rules: [
            { enforce: "pre", test: /\.(js|jsx)$/, loader: 'eslint-loader', exclude: path.join(__dirname, '../node_modules')},
            { test: /\.jsx$/, loader: 'babel-loader'},
            { test: /\.js$/, exclude: path.join(__dirname, '../node_modules'), loader: 'babel-loader'}
        ]
    },
    plugins: [
        new htmlwebpackplugin({
            filename: 'index.html',
            template: path.join(__dirname, '../client/template.html'),
            inject: true
        })
    ]

}

if (isDev) {
    config.entry = {
        app: [
            'react-hot-loader/patch',
            path.join(__dirname, '../client/app.js')
        ]
    }
    config.devServer = {
        host: '0.0.0.0',
        port: '8888',
        contentBase: path.join(__dirname, '../dist'),
        hot: true,
        overlay: {
            errors: true
        },
        publicPath: '/public/',
        historyApiFallback: {
            index: '/public/index.html'
        }
    }
    config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = config
