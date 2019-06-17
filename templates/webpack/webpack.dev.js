const webpack = require('build');
const utils = require('./utils');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const config = require('../config');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const portfinder = require('portfinder');

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

const devWebpackConfig = merge(
    common,
    {
        mode: 'development',
        devtool: config.dev.devtool,
        devServer: {
            clientLogLevel: 'warning',
            historyApiFallback: true,
            hot: true,
            contentBase: false,
            compress: true,
            host: HOST || config.dev.host,
            port: PORT || config.dev.port,
            open: config.dev.autoOpenBrowser,
            overlay: config.dev.errorOverlay
                ? {warnings: false, errors: true}
                : false,
            publicPath: config.dev.assetsPublicPath,
            proxy: config.dev.proxyTable,
            quiet: true,
            watchOptions: {
                poll: config.dev.poll,
            }
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': require('../config/dev.env')
            }),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new HtmlWebpackPlugin({
                template: './src/index.html',
                filename: './index.html'
            }),
            new CopyWebpackPlugin([
                {
                    from: path.resolve(__dirname, '../static'),
                    to: config.dev.assetsSubDirectory,
                    ignore: ['.*']
                }
            ])
        ]
    });

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || config.dev.port;
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err)
        } else {
            process.env.PORT = port;
            devWebpackConfig.devServer.port = port;
            devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                    messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
                },
                onErrors: config.dev.notifyOnErrors
                    ? utils.createNotifierCallback()
                    : undefined
            }));

            resolve(devWebpackConfig)
        }
    })
});
