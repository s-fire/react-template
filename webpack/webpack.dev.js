const webpack = require('webpack')

const webpackMerge = require('webpack-merge')

const baseConfig = require ('./weback.base.js')
const variable = require('./webpackUtils/variable')

const { DIST_PATH } = variable;

const config = {
  mode:'development',
  cache:{type:'memory'}, ////开发环境使用内存缓存
  devtool:'eval-cheap-module-source-map', //此选项控制是否生成，以及如何生成 source map。
  stats:'errors-only', //更精确地控制 bundle 信息该怎么显示  errors-only 只在发生错误时输出
  devServer:{
    open:'chrome'
  }
}
const mergedConfig = webpackMerge.merge(baseConfig,config)
module.exports = mergedConfig