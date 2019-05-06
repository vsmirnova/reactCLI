'use strict'
const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.common');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const env = require('../config/prod.env');

const webpackConfig = merge(
    baseWebpackConfig,
    {
        mode: 'production',
        devtool: config.build.productionSourceMap ? config.build.devtool : false,
        output: {
            path: config.build.assetsRoot,
            filename: utils.assetsPath('js/[name].[chunkhash].js'),
            chunkFilename: utils.assetsPath('js/[name].[chunkhash].js')
        },
        /*optimization: {
            splitChunks: {
                cacheGroups: {
                    vendors: {
                            name: 'vendor',
                            test: 'vendor',
                            chunks: 'all'
                    }
                }
            }
        },*/
        plugins: [
            new webpack.DefinePlugin({
                'process.env': env
            }),
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: {
                        warnings: false,
                        drop_console: true
                    }
                },
                sourceMap: config.build.productionSourceMap,
                parallel: true
            }),
            new ExtractTextPlugin({
                filename: utils.assetsPath('css/[name].[contenthash].css'),
                allChunks: true,
            }),
            new OptimizeCSSPlugin({
                cssProcessorOptions: config.build.productionSourceMap
                    ? {safe: true, map: {inline: false}}
                    : {safe: true}
            }),
            new HtmlWebpackPlugin({
                template: './src/index.html',
                filename: './index.html',
                inject: true,
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true
                },
                chunksSortMode: 'dependency'
            }),
            new webpack.HashedModuleIdsPlugin(),
            new CopyWebpackPlugin([
                {
                    from: path.resolve(__dirname, '../static'),
                    to: config.build.assetsSubDirectory,
                    ignore: ['.*']
                }
            ])
        ]
    });

if (config.build.productionGzip) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin')

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' +
                config.build.productionGzipExtensions.join('|') +
                ')$'
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    )
}

if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig;

