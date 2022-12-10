const prodConfig = require('./webpack.prod')
// 引入打包配置
const speedMeasurePlugin = require('speed-measure-webpack-plugin')
//知道时间都花费在哪些步骤上
const sup = new speedMeasurePlugin()
// 实例化分析插件
const { merge } = require('webpack-merge')
// 引入合并webpack配置方法
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
// 引入分析打包结果插件
module.exports = sup.wrap(
  // 使用smp.wrap方法,把生产环境配置传进去,由于后面可能会加分析配置,所以先留出合并空位
  merge(prodConfig, {
    plugins: [new BundleAnalyzerPlugin()],
    // 配置分析打包结果插件
  }),
)
