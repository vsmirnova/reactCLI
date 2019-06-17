const path = require('path');
const utils = require('./utils');
const config = require('../config');

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    context: path.resolve(__dirname, '../'),
    performance: { hints: false },
    entry: {
        app: [
            'babel-polyfill',
            './src/index.js'
        ]
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [resolve('src')],
                use: {loader: 'babel-loader'}
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: utils.assetsPath('fonts/[name][hash].[ext]')
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['styles-loader', 'css-loader']
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            limit: 10000,
                            name: utils.assetsPath('css/[name].[ext]')
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            limit: 10000,
                            name: utils.assetsPath('css/[name].[ext]')
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {name: utils.assetsPath('img/[name].[ext]')}
                    }
                ]
            }
        ]
    },
    node: {
        setImmediate: false,
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    }
};
