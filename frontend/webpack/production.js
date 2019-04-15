const merge = require( 'webpack-merge' ),
  baseConfig = require( './base' ),
  MiniCssExtractPlugin = require( 'mini-css-extract-plugin' ),
  UglifyJsPlugin = require( 'uglifyjs-webpack-plugin' ),
  OptimizeCSSAssetsPlugin = require( 'optimize-css-assets-webpack-plugin' ),
  FilterWarningsPlugin = require( 'webpack-filter-warnings-plugin' ),
  CleanWebpackPlugin = require( 'clean-webpack-plugin' );

let pathsToClean = [ 'dist' ],
  cleanOptions = {
    root: __dirname,
    verbose: false, // Write logs to console.
    dry: false
  };

module.exports = merge( baseConfig, {
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyJsPlugin( {
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: false,
          ecma: 6,
          mangle: true
        },
        sourceMap: true
      } ),
      new OptimizeCSSAssetsPlugin( {} )
    ]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ MiniCssExtractPlugin.loader, 'css-loader' ]
      },
      // Scss compiler
      {
        test: /\.scss$/,
        use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader?indentedSyntax' ]
      }
    ]
  },
  performance: {
    hints: 'warning'
  },
  plugins: [
    new CleanWebpackPlugin( pathsToClean, cleanOptions ),
    new MiniCssExtractPlugin( {
      filename: 'assets/css/[name].[hash:4].css'
    } ),
    new FilterWarningsPlugin( {
      exclude: /mini-css-extract-plugin[^]*Conflicting order between:/
    } )
  ]
} );
