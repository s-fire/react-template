const HtmlWebpackPlugin = require('html-webpack-plugin')
const variable = require('./variable');
const path = require('path');

const { PUBLIC_PATH, DIST_PATH, ENV_CONFIG_PATH, IS_DEV, SRC_PATH } = variable

function getHtmlPlugins() {
  const indexHtmlPlugin = new HtmlWebpackPlugin({
    template:path.join(PUBLIC_PATH,'index.html'),
    filename:'index.html',
    inject:true, //true 插入body底部，head:插入head标签，false:不生成js文件
    title:'',
    minify:{
      removeComments:true,// 删除注释
      collapseWhitespace: true,
      minifyCSS:true, // 压缩 HTML 中出现的 CSS 代码
      minifyJS:true // 压缩 HTML 中出现的 JS 代码
    }
  })
  return [indexHtmlPlugin]
}
function getPlugins() {
  return [...getHtmlPlugins()]
}
module.exports = {
  getPlugins
}