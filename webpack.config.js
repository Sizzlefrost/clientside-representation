const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	entry: {
		main: path.resolve(__dirname, "src", "index.jsx")
	},
	output: {
		path: path.resolve("/Dev","clientside-representation","clientside-representation","dist"),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "styles.css",
		}),
		new HTMLWebpackPlugin({
			template: path.resolve(__dirname, "src", "index.html"),
			filename: "index.html",
		}),
		new CleanWebpackPlugin({}),
	],
	devServer: {
		historyApiFallback: true,
		filename: 'bundle.js',
	}
};