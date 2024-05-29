const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: "./src/index.tsx",
    output: {
        path: path.join(__dirname, '/dist'),
        filename: "bundle.js",
        // assetModuleFilename: path.join('img', '[name].[contenthash][ext]'),
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
    },
    devServer: {
        historyApiFallback: true
    },
    performance: {
        maxAssetSize: 1024 * 1024,
        maxEntrypointSize: 1024 * 1024
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader",
                },
            },
            {
                test: /\.(s(a|c)ss)$/,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test: /\.(png|jpe?g)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'img/[name].[contenthash][ext]',
                }
            },
            {
                test: /\.(ttf|otf|eot|woff|woff2|svg)$/,
                type: 'asset/resource',
                dependency: {
                    not: ['url']
                },
                generator: {
                    filename: 'fonts/[name].[contenthash][ext]',
                }
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        })
    ]
}