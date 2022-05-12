const path = require('path')
//变量配置工具类
const variable = require ('./webpackUtils/variable')
// 别名工具类
const resoveConfig = require ('./webpackUtils/resolve')
// 公用插件
const pliguns = require('./webpackUtils/plugins')

const { SRC_PATH, DIST_PATH, IS_DEV, IS_PRO, getCDNPath } = variable;
console.log('getCDNPath: ', getCDNPath());

const config ={
  entry:{
    index:path.join(SRC_PATH,'index.tsx')
  },
  output:{
    path:DIST_PATH,
    filename:IS_DEV ? 'js/[name].bundle.js' : 'js/[name].[contenthash:8].bundle.js',
    publicPath:getCDNPath(),
    globalObject:'this', // 为了使 UMD 构建在浏览器和 Node.js 上均可用，应将 output.globalObject 选项设置为 'this'。对于类似 web 的目标，默认为 self。
    chunkFilename:IS_DEV ? 'js/[name].bundle.js' : 'js/[name].[contenthash:8].bundle.js',
    assetModuleFilename:'assets/[hash]/[ext][query]', //与 output.filename 相同，不过应用于 Asset Modules。
    clean:true // clean：true在生成文件之前清空output目录
  },
  module:{
    //loader规则配置
    rules:[
      {
        test: /\.(tsx?|js)$/,
        include: [SRC_PATH],
        use: [
          
          {
            loader: 'babel-loader', // 这是一个webpack优化点，使用缓存
            options: {
              cacheDirectory: true,
            },
          },
        ],
        exclude: [/node_modules/, /public/, /(.|_)min\.js$/],
      },
    ]
  },
  resolve:resoveConfig,
  plugins:pliguns.getPlugins()
}
module.exports = config