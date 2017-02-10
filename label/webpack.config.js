var webpack = require ('webpack');

// 将共用React组件合并打包到指定文件common.js中;
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin ('common.js');
var autoprefixer = require('autoprefixer');
module.exports = {

    plugins: [commonsPlugin],
    entry: {
        "label" : "./view/label/label.jsx",
        "tgxq" : "./view/label/detail/detail.jsx",
    },
    output: {
        path: './dist/scripts',
        filename: '[name].js' // Template based on keys in entry above
    },
    module: {
        loaders: [
            {test: /\.jsx$/,    exclude: /node_modules/, loader: 'babel-loader'},
            {test: /\.(less)$/, exclude: /node_modules/,  loader: "style!css!postcss!less"},
            {test: /\.(css)$/, loader: "style!css!postcss"},
            {test: /.(svg|png|jpg|otf)$/, exclude: /node_modules/, loader: 'url-loader'}
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.less', '.css']
    }
    // ,
    // 插件配置: 此处使用共享插件
    // plugins: [commonsPlugin, new ExtractTextPlugin("[name].less")]
    // var ExtractTextPlugin = require("extract-text-webpack-plugin");
// { test: /\.(css|less)$/,  exclude: /node_modules/,  loader: ExtractTextPlugin.extract('style!css!less')},
// var  ExtractTextPlugin=new ExtractTextPlugin('all.css', {allChunks: true});
};
