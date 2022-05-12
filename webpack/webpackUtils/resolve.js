const path = require ('path')
const variable = require('./variable')
const {SRC_PATH,ROOT_PATH}=variable
module.exports={
  extensions: ['.tsx', '.ts', '.js', '.json'], //解析这些后缀名
  modules: [path.resolve(ROOT_PATH, 'node_modules')], //解析模块时应该搜索的目录
  // 查找 package.json main
  mainFields: ['index'], // 解析目录时要使用的文件名
  alias: {
    '@': SRC_PATH,
    '@images': path.resolve(SRC_PATH, 'assets/images'),
  },
}