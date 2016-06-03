var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var autoprefixer = require('autoprefixer');


// definePlugin 接收字符串插入到代码当中, 所以你需要的话可以写上 JS 的字符串.
var definePlugin = new webpack.DefinePlugin({
    __ENV__: JSON.stringify(process.env.ENV || 'dev')
});

module.exports = {
    entry: {
        "traveler/bundle":         ["./client/js/traveler/app.js"],
        "hotelier/bundle":         ["./client/js/hotelier/app.js"]
    },
    output: {
        path: __dirname + '/dist/js',
        filename: "[name].js",
        publicPath: "/dist/js/",
        chunkFilename: "[name]_[id].js"
    },
    externals: {
        // require("jquery") is external and available
        //  on the global var jQuery
        "jquery": "jQuery"
    },
    module: {
        loaders: [{
            test: /\.less$/,
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!less-loader')
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader', 'autoprefixer-loader')
        }, {
            test: /\.png$/,
            loader: 'url?limit=8192&mimetype=image/png'
        }, {
            test: /\.jpe?g$/,
            loader: 'url?limit=8192&mimetype=image/jpg'
        }, {
            test: /\.gif$/,
            loader: 'url?limit=8192&mimetype=image/gif'
        }, {
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url?limit=8192&mimetype=image/svg+xml'
        }, {
            test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url?limit=8192&mimetype=application/font-woff2'
        }, {
            test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url?limit=8192&mimetype=application/font-woff'
        }, {
            test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url?limit=8192&mimetype=application/octet-stream'
        }, {
            test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'file'
        }, {
            test: /\.hbs$/,
            loader: "handlebars-template-loader",
            query: {
                prependFilenameComment: __dirname
            }
        }, {
            test: /\.json$/,
            loader: "json-loader"
        }, {
            test: /\.(html|temp)$/,
            loader: "html"
        }]
    },
    node: {
        fs: "empty" // avoids error messages
    },
    resolve: {
        root: [
            path.resolve('./client/js'),
            path.resolve('./client/js/lib'),
            path.resolve('./client/js/common'),
            path.resolve('./client/less')
        ]
    },
    plugins: [
        definePlugin,
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(".bower.json", ["main"])
        ),
        new ExtractTextPlugin("[name].css")
    ],
    postcss: [autoprefixer({
        browsers: ['last 2 versions']
    })],
    devtool: "source-map",
    devServer: {
        port: 8181,
        host: "0.0.0.0",
        proxy: {
            '/mock/*': {
                target: 'http://localhost:3000/mock',
                secure: false
            },
        }
    }
};