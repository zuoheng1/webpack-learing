const path = require('path')
const { merge } = require('webpack-merge')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
//不需要刷新浏览器的前提下模块热更新,并且能够保留react组件的状态。
const baseConfig = require('./ webpack.base')

// 合并公共配置,并添加开发环境配置
module.exports = merge(baseConfig, {
  mode: 'development',
  // 开发模式,打包更加快速,省了代码优化步骤
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    port: 3333,
    // 服务端口
    compress: false,
    // gzip压缩,开发环境不开启,提升热更新速度
    hot: true,
    // 开启热更新
    historyApiFallback: true, // 解决history路由404问题
    static: {
      directory: path.join(__dirname, '../public'), //托管静态资源public文件夹
    },
  },
  devtool: 'eval-cheap-module-source-map',
  //本地开发首次打包慢点没关系,因为 eval 缓存的原因, 热更新会很快
  //开发中,我们每行代码不会写的太长,只需要定位到行就行,所以加上 cheap
  //我们希望能够找到源代码的错误,而不是打包后的,所以需要加上 module
  //打包环境推荐：none(就是不配置devtool选项了，不是配置devtool: 'none')
  plugins: [
    new ReactRefreshWebpackPlugin(),
    // 添加热更新插件
  ],
})
