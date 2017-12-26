var path = require('path')
var webpack = require('webpack')

module.exports = {
    target: 'node',
    entry: {
        "server-entry": path.join(__dirname, '../client/server-entry.js')
    },
    output: {
        filename: 'server-entry.js',
        path: path.join(__dirname, '../dist'),
        publicPath: '/public',
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            { enforce: 'pre', test: /\.(js!jsx)$/, loader: 'eslint-loader', exclude: path.join(__dirname, '../node_modules')},
            { test: /\.jsx$/, loader: 'babel-loader'},
            { test: /\.js$/, exclude: path.join(__dirname, '../node_modules'), loader: 'babel-loader'}
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            "React": 'React',
            'window.React': 'React'
        })
    ]
}