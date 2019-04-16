const path = require( 'path' ),
  fs = require( 'fs' );

const publicPath = '/',
  appDirectory = fs.realpathSync( process.cwd() ),
  resolveApp = ( relativePath ) => path.resolve( appDirectory, relativePath );

const HtmlWebPackPlugin = require( 'html-webpack-plugin' ),
  CopyWebpackPlugin = require( 'copy-webpack-plugin' );

module.exports = {
  entry: {
    index: [ './src/index.js' ]
  },
  output: {
    path: resolveApp( 'dist' ),
    filename: 'assets/js/[name].[hash:4].js',
    chunkFilename: 'assets/js/[name].[hash:4].chunk.js',
    publicPath: publicPath
  },

  resolve: {
    alias: {
      Components: path.resolve( __dirname, '../src/components/' ),
      Containers: path.resolve( __dirname, '../src/containers/' ),
      Assets: path.resolve( __dirname, '../src/assets/' ),
      Util: path.resolve( __dirname, '../src/util/' ),
      Routes: path.resolve( __dirname, '../src/routes/' ),
      Constants: path.resolve( __dirname, '../src/constants/' ),
      Redux: path.resolve( __dirname, '../src/redux/' ),
      Data: path.resolve( __dirname, '../src/data/' )
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/env',
                {
                  modules: false,
                  targets: {
                    browsers: [ 'last 2 versions', 'safari >= 7' ]
                  }
                }
              ],
              '@babel/react'
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/syntax-dynamic-import',
              '@babel/transform-runtime'
            ]
          }
        }
      }
    ]
  },

  plugins: [
    new CopyWebpackPlugin( [
      { from: 'src/assets/img', to: 'assets/img' },
      { from: 'src/assets/fonts', to: 'assets/fonts' }
    ] ),

    new HtmlWebPackPlugin( {
      template: './public/index.html',
      filename: './index.html',
      favicon: './public/favicon.ico'
    } )
  ]
};
