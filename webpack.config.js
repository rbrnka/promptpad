const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/main.js',

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '',
        clean: true, // Clean the dist folder before each build
    },

    devtool: 'source-map',

    devServer: {
        static: './dist',
        open: true,
        port: 8081,
    },

    module: {
        rules: [
            // Use Babel for JS files
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            // CSS loader
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            // File loader for text assets
            {
                test: /\.(txt)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/[name][ext]',
                },
            },
        ],
    },

    plugins: [
        // Injects the bundle into index.html (template in root)
        new HtmlWebpackPlugin({
            template: './index.html',
        }),
        // Copies static files to the dist folder
        new CopyWebpackPlugin({
            patterns: [
                { from: 'style.css', to: 'style.css' },
                { from: 'assets', to: 'assets' },
            ],
        }),
    ],
};
