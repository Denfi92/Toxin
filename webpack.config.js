const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')


const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev
console.log(isDev)

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  }
    if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetsWebpackPlugin(),
      new TerserWebpackPlugin({
        extractComments: false,
      })
    ]
  }
  return config
}

const filename = ext => isDev ? `[name].[hash].${ext}` : `[name].${ext}`
const cssLoaders = extra => {
  const loaders = [
    isDev ? "style-loader" : MiniCssExtractPlugin.loader,
    "css-loader",
  ]
  if (extra) {
    loaders.push(extra)
  }
  return loaders
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: './index.js',
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist')
  },
  optimization: optimization(),
  devtool: isDev ? 'source-map' : false,
  plugins: [
    new HTMLWebpackPlugin({
      template: './index.html'
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/images/'),
          to: path.resolve(__dirname, 'dist/img')
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: filename('css')
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders()
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader')
      },
    ]
  }
}