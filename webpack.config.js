const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
//const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
//const uglify_es = require('uglify-es');
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //webpack4 替代extract-text-webpack-plugin，将css单独提取打包
import { useRemoteApi } from './constants/webpackConst';

const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname),
    entry: {
        app:['./appWrapper/index.js'],
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: path.resolve(__dirname, 'dist')
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                antd: {
                    name: 'antd',
                    test: (module) => {
                        return /antd|ant-design/g.test(module.context);
                    },
                    chunks: 'initial',
                    priority: 10
                },
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'commons',
                    chunks: 'initial',
                    minChunks: 2,
                }
            },
        },
        minimizer: [
            new UglifyJsPlugin(),    // 代码压缩的关键插件
            //uglify_es
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({      //对css进行打包，webpack4推荐语法
            filename: "[name].css",
            chunkFilename: "[name].css"
        }),
        new webpack.DefinePlugin({
            'apiFromLocal': {
                PLACE: JSON.stringify(useRemoteApi ? 'remote' : 'local'),
            },
         })
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader', 
                        query: {
                            presets: [
                                '@babel/react', 
                                '@babel/preset-env'
                            ],
                            plugins: [
                                ['import', {                //这个是为了使用antd的样式
                                    libraryName: 'antd',
                                    //libraryDirectory: 'es',
                                    style: 'css' //'css'
                                }],
                                ['@babel/plugin-transform-runtime',
                                {
                                    "corejs": false,
                                    "helpers": true,
                                    "regenerator": true,
                                    "useESModules": false
                                }],
                                //'@babel/plugin-runtime',
                                "syntax-dynamic-import",    //  支持动态import，支持react-loadable
                                //'transform-decorators-legacy', //在这两个是为了支持es7的装饰器语法，如@observe等
                                ["@babel/plugin-proposal-decorators", { "legacy": true }],
                                '@babel/plugin-proposal-optional-chaining',
                                ['@babel/plugin-proposal-class-properties', { "loose": true }]
                            ]
                        },
                    }
                ]
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,  //自动提取出css
                    //'style-loader', // 不屏蔽的话会报错
                    'css-loader', 
                    'sass-loader',
                ]
            },
            {
                test: /\.less?$/,
                use: [
                    MiniCssExtractPlugin.loader,  //自动提取出css
                    'style-loader', // 不屏蔽的话会报错
                    'css-loader', 
                    'less-loader',
                ]
            }
        ]
    },

    resolve: {
        alias: {
            '@apiMap': path.resolve(__dirname, 'map/api'),
            '@constants': path.resolve(__dirname, 'constants'),
            '@tools': path.resolve(__dirname, 'tools'),
            '@UI': path.resolve(__dirname, 'UIwidgets')
        }
    },
    // externals: {
    //     'react': 'React',
    //     'react-dom': 'ReactDOM'
    // }
    //mode:"production",
    devtool: 'inline-source-map',
    mode:"development"

};