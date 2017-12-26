const axios = require('axios')
const webpack = require('webpack')
const express = require('express')
const path = require('path')
const MemoryFileSystem = require("memory-fs")
const ReactDomServer = require('react-dom/server')
const setverConfig = require('../../build/webpack.config.server')
const proxy = require('http-proxy-middleware')

const getTemplate = () => {
return new Promise(((resolve, reject) => {
    axios.get('http://localhost:8888/public/index.html').then(response => {
        var res = response.data
        resolve(res)
    })
        .catch(reject)
}))
}

const Module = module.constructor

var mfs = new MemoryFileSystem() //fs基本用法

/*fs.mkdirpSync(path.join(__dirname, './a'))
fs.writeFileSync(path.join(__dirname, './a/file.txt'), "Hello World");
fs.readFileSync(path.join(__dirname, './a/file.txt', 'utf-8'))默认utf8 */

const setverCompiler = webpack(setverConfig)
setverCompiler.outputFileSystem = mfs
let serverBundle
setverCompiler.watch({}, (err, stats) => {
    if (err) throw err
    stats = stats.toJson()
    stats.errors.forEach(err => console.log(err))
    stats.warnings.forEach(warn => console.log(warn))

    const bundlePath = path.join(
        setverConfig.output.path,
        setverConfig.output.filename
    )
    const bundle = mfs.readFileSync(bundlePath, 'utf-8')
    const m = new Module()
    m._compile(bundle, 'server-entry.js')
    serverBundle = m.exports.default
})

module.exports = function (app) {
    app.use('/public', proxy({target: 'http://localhost:8888'}))
    app.get('*', function (req, res) {
        getTemplate().then(template => {
            const content = ReactDomServer.renderToString(serverBundle)
            res.send(template.replace('<!-- app -->', content))
        })
    })
    
}