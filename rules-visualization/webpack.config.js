const webpack = require('webpack');
//const ExtractTextPlugin = require("extract-text-webpack-plugin");
//const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const prod = process.env.NODE_ENV === 'production';

module.exports = {
	entry: {
		bundle: ['./main.js']
	},
	resolve: {
		extensions: ['.html']
	},
	output: {
		path: __dirname,
		filename: '[name].js',
		chunkFilename: '[name].[id].js'
	},
	module: {
		rules: [
			{
				test: /\.html$/,
				exclude: /node_modules/,
				use: {
					loader: 'svelte-loader',
					options: {
						emitCss: false, //true,
						cascade: false,
						store: false	///true
					}
				}
			},
			// {
			// 	test: /\.css$/,
			// 	use: ExtractTextPlugin.extract({
			// 		fallback: 'style-loader',
			// 		use: [{ loader: 'css-loader', options: { sourceMap: !prod } }]
			// 	})
			// }
		]
	},
	plugins: [
		//new ExtractTextPlugin('bundle.css'),
		//prod && new webpack.optimize.ModuleConcatenationPlugin(),
		//prod && new UglifyJSPlugin()
	].filter(Boolean),
	devServer: {
		contentBase: './public'
	},
	devtool: prod ? false: 'inline-source-map'
};
