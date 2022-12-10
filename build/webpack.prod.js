const { merge } = require('webpack-merge')
const baseConfig = require('./ webpack.base.js')
const CopyPlugin = require('copy-webpack-plugin')
//一般public文件夹都会放一些静态资源,可以直接根据绝对路径引入,比如图片,css,js文件等,不需要webpack进行解析,只需要打包的时候把public下内容复制到构建出口文件夹中
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const globAll = require('glob-all')
//需要glob-all来选择要检测哪些文件里面的类名和id还有标签名称
const path = require('path')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
//需要手动配置一下压缩css的插件
const TerserPlugin = require('terser-webpack-plugin')
//设置mode为production时,webpack会使用内置插件terser-webpack-plugin压缩js文件,该插件默认支持多线程压缩,但是上面配置optimization.minimizer压缩css后,js压缩就失效了
//需要手动再添加一下,webpack内部安装了该插件,由于pnpm解决了幽灵依赖问题,如果用的pnpm的话,需要手动再安装一下依赖。
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin')
//tree-shaking清理未使用css
const CompressionPlugin = require('compression-webpack-plugin')
//前端代码在浏览器运行,需要从服务器把html,css,js资源下载执行,下载的资源体积越小,页面加载速度就会越快。
//一般会采用gzip压缩,现在大部分浏览器和服务器都支持gzip,可以有效减少静态资源文件大小,压缩率在 70% 左右。
//nginx可以配置gzip: on来开启压缩,但是只在nginx层面开启,会在每次请求资源时都对资源进行压缩,压缩文件会需要时间和占用服务器cpu资源，
//更好的方式是前端在打包的时候直接生成gzip资源,服务器接收到请求,可以直接把对应压缩好的gzip文件返回给浏览器,节省时间和cpu。

module.exports = merge(baseConfig, {
  mode: 'production', // 生产模式,会开启tree-shaking和压缩代码,以及其他优化
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'),
          // 复制public下文件
          to: path.resolve(__dirname, '../dist'),
          // 复制到dist目录中
          filter: (source) => {
            return !source.includes('index.html')
            // 忽略index.html,因为html-webpack-plugin会以public下的index.html为模板生成一个index.html到dist文件下,所以不需要再复制该文件
          },
        },
      ],
    }),
    // 复制文件插件
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      // 抽离css的输出目录和名称
    }),
    // 抽离css插件
    new PurgeCSSPlugin({
      paths: globAll.sync([
        `${path.join(__dirname, '../src')}/**/*.tsx`,
        path.join(__dirname, '../public/index.html'),
      ]),
      // 检测src下所有tsx文件和public下index.html中使用的类名和id和标签名称
      // 只打包这些文件中用到的样式
      safelist: {
        standard: [/^ant-/], // 过滤以ant-开头的类名，哪怕没用到也不删除
      },
    }),
    // 清理无用css
    new CompressionPlugin({
      test: /.(js|css)$/, // 只生成css,js压缩文件
      filename: '[path][base].gz', // 文件命名
      algorithm: 'gzip', // 压缩格式,默认是gzip
      test: /.(js|css)$/, // 只生成css,js压缩文件
      threshold: 10240, // 只有大小大于该值的资源会被处理。默认值是 10k
      minRatio: 0.8, // 压缩率,默认值是 0.8
    }),
  ],
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
      // 压缩css
      new TerserPlugin({
        parallel: true,
        // 开启多线程压缩
        terserOptions: {
          compress: {
            pure_funcs: ['console.log'],
            // 删除console.log
          },
        },
      }),
      // 压缩js
    ],
    splitChunks: {
      // 分隔代码
      cacheGroups: {
        vendors: {
          // 提取node_modules代码
          test: /node_modules/, // 只匹配node_modules里面的模块
          name: 'vendors', // 提取文件命名为vendors,js后缀和chunkhash会自动加
          minChunks: 1, // 只要使用一次就提取出来
          chunks: 'initial', // 只提取初始化就能获取到的模块,不管异步的
          minSize: 0, // 提取代码体积大于0就提取出来
          priority: 1, // 提取优先级为1
        },
        commons: {
          // 提取页面公共代码
          name: 'commons', // 提取文件命名为commons
          minChunks: 2, // 只要使用两次就提取出来
          chunks: 'initial', // 只提取初始化就能获取到的模块,不管异步的
          minSize: 0, // 提取代码体积大于0就提取出来
        },
      },
    },
  },
})
