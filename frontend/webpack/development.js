const webpack = require( 'webpack' ),
  merge = require( 'webpack-merge' ),
  baseConfig = require( './base' ),
  MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

const HOST = 'localhost',
  PORT = 3333;

module.exports = merge( baseConfig, {
  mode: 'development',

  devServer: {
    clientLogLevel: 'warning',
    hot: true,
    contentBase: 'dist',
    compress: true,
    host: HOST,
    port: PORT,
    open: true,
    historyApiFallback: true,
    overlay: { warnings: false, errors: true },
    publicPath: '/',
    quiet: true,
    watchOptions: {
      poll: false,
      ignored: /node_modules/
    }
  },

  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [ MiniCssExtractPlugin.loader, 'css-loader' ]
      },
      // Scss compiler
      {
        test: /\.scss$/,
        use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ]
      }
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin( {
      filename: 'assets/css/[name].[hash:4].css'
    } )
  ]
} );
