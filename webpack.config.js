const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //webpack4 替代extract-text-webpack-plugin，将css单独提取打包
import { useRemoteApi } from './constants/webpackConst';

module.exports = {
    context: path.resolve(__dirname),
    entry: {
        app:['./appWrapper/index.js'],
    },
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        //publicPath: path.resolve(__dirname, 'dist'),
        publicPath: './'
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
                vendor: {
                    name: "common",
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "initial",
                    minChunks: 1,   //  如果是2的话一个也抽不出来，因为好多只用了一次
                    priority: 8 // 优先级
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
                //PLACE: JSON.stringify('local'),
            },
         }),
         new HtmlWebpackPlugin({
             filename: '../views/index.html',
             template: './views/template.html',
             inject: 'body'
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
                            //"babelrc": false,
                            presets: [
                                '@babel/react', 
                                '@babel/preset-env'
                            ],
                            plugins: [
                                "@babel/plugin-syntax-dynamic-import",  //  这个是为了在浏览器的时候能够实现动态加载
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
                                'dynamic-import-webpack',   //  这个是为了在打包的时候能够识别异步加载的import写法
                                "syntax-dynamic-import",    //  支持动态import，支持react-loadable
                                //'transform-decorators-legacy', //在这两个是为了支持es7的装饰器语法，如@observe等
                                ["@babel/plugin-proposal-decorators", { "legacy": true }],
                                '@babel/plugin-proposal-optional-chaining',
                                ['@babel/plugin-proposal-class-properties', { "loose": true }],   
                            ],
                            comments: true
                        },
                    }
                ]
            },
            {
                test: /\.(scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,  //自动提取出css
                    'css-loader', 
                    'sass-loader'
                ]
            },
            {
                //  专门处理antd的css样式
                test: /\.css$/,
                include: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ],
            },
            {
                //  正常的css使用css module
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    //'css-loader',
                    'css-loader?modules&localIdentName=[name]__[local]--[hash:base64:5]'
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
    devtool: 'inline-source-map',
    mode:"development"

};