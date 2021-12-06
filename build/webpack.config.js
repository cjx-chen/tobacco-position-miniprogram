const { resolve } = require('path')
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MpWebpackPlugin = require('./mp-webpack-plugin');
const MpRuntimePlugin = require('./mp-runtime-plugin');
const { uiComponents } = require('../build/config')
const copyPatternArray = uiComponents.map(item => {
  const path = resolve(__dirname, `../node_modules/${item}/dist`)
  return {
    from: path,
    to: '../dist/pages/uiComponents/@vant/weapp',
    globOptions: {
      ignore: ['**/*.d.ts', '**/*.md']
    }
  }
})

const debuggable = process.env.BUILD_TYPE !== 'prod'

module.exports = {
  context: resolve('src'),
  entry: './app.js',
  output: {
    path: resolve('dist'),
    filename: '[name].js',
    globalObject: 'wx'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(tsx?|jsx?)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      {
        test: /\.(tsx?|jsx?)$/,
        use: [
          'babel-loader?cacheDirectory=true',
          {
            loader: 'thread-loader',
            options: {
              workers: 3,
            },
          },
        ],
        exclude: [/node_modules/]
      },
      {
        test: /\.(less)$/,
        include: /src/,
        use: [
          {
            loader: 'file-loader',
            options: {
              useRelativePath: true,
              name: '[path][name].wxss',
              context: resolve('src'),
            },
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                paths: [resolve('src', 'styles'), resolve('src')],
              },
            },
          },
        ],
      },
      {
        test: /\.(scss)$/,
        include: /src/,
        use: [
          {
            loader: 'file-loader',
            options: {
              useRelativePath: true,
              name: '[path][name].wxss',
              context: resolve('src'),
            },
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                paths: [resolve('src', 'styles'), resolve('src')],
              },
            },
          },
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'common',
      minChunks: 2,
      minSize: 0,
    },
    runtimeChunk: {
      name: 'runtime'
    }
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    alias: {
      // '@/config$': process.env.BUILD_TYPE === 'prod'
      //   ? resolve('src/config/index.prod.ts')
      //   : (process.env.BUILD_TYPE === 'test'
      //       ? resolve('src/config/index.test.ts')
      //       : resolve('src/config/index.ts')),
      // '@': resolve('src'),
      // '@vant': 'pages/uiComponents/@vant/weapp'
    }
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '**/*',
          to: './',
          globOptions: {
            ignore: ['**/*.ts', '**/*.d.ts', '**/*.js', '**/*.less', '**/*.md', '**/*.scss']
          }
        },
        // {
        //   from: '../src/components/vant-weapp',
        //   to: '../dist/components/vant-weapp',
        //   globOptions: {
        //     ignore: ['**/*.d.ts', '**/*.md']
        //   }
        // },
        {
          from: '../project.config.json',
          to: './'
        },
        // {
        //   from: '../src/components/article/parser-min',
        //   to: '../dist/components/article/parser-min',
        //   globOptions: {
        //     ignore: []
        //   }
        // }
        ...copyPatternArray
      ],
    }),
    new MpWebpackPlugin({
      scriptExtensions: ['.ts', '.js'],
      assetExtensions: ['.less', '.scss']
    }),
    new MpRuntimePlugin(),
    new webpack.EnvironmentPlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV) || 'development',
      BUILD_TYPE: JSON.stringify(process.env.BUILD_TYPE) || 'dev',
    }),
  ],
  mode: debuggable ? 'none' : 'production',
  devtool: debuggable ? 'source-map' : 'false',
}
