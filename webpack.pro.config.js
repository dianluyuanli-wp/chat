const baseWebpackConfig = require( './webpack.config');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');
import { useAnalyzer } from './constants/webpackConst';

module.exports = {
    ...baseWebpackConfig,
    plugins: [
        ...baseWebpackConfig.plugins,
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,       //一个正则表达式，指示应优化/最小化的资产的名称。提供的正则表达式针对配置中ExtractTextPlugin实例导出的文件的文件名运行，而不是源CSS文件的文件名。默认为/\.css$/g
            cssProcessor: require('cssnano'), //用于优化\最小化CSS的CSS处理器，默认为cssnano
            cssProcessorOptions: { safe: true, discardComments: { removeAll: true } }, //传递给cssProcessor的选项，默认为{}
            canPrint: true                   //一个布尔值，指示插件是否可以将消息打印到控制台，默认为true
        }),
        ...(useAnalyzer ? [new BundleAnalyzerPlugin({
            analyzerPort: 8899
        })] : []),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            },
         }),
    ],
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    },
    devtool: false,
    mode:"production"
}