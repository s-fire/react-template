npm init -y

npm i typescript -D
//node 提供了npx命令直接通过tsc --init命令创建tsconfig.json
npx tsc --init

```
{
    "compilerOptions": {
        "rootDir": "./src",//源码目录
        "target": "es5", // 指定输出 ECMAScript 目标版本
        "module": "ESNext", //面向未来的ESM模块化
        "strict": true, // 开启所有的严格检查配置
        "esModuleInterop": true, // 允许 export = xxx 导出 ，并使用 import xxx form "module-name" 导入
        "outDir": "dist",
        /* 指定要包含在编译中的库文件——引用类库——即申明文件，如果输出的模块方式是 es5，就会默认引入 "dom","es5","scripthost" 。如果在 TS 中想要使用一些 ES6 以上版本的语法，就需要引入相关的类库 */
        "lib": [
            "webworker",
            "dom",
            "es5",
            "es2015",
            "es2016",
            "es2015.promise",
            "dom.iterable",
            "scripthost",
            "esnext",
        ], // 要包含在编译中的依赖库文件列表
        "allowJs": true, // 允许编译 JavaScript 文件
        // 检查 JS 文件
        "checkJs": true,
        "skipLibCheck": true, // 跳过所有声明文件的类型检查
        "allowSyntheticDefaultImports": true, // 允许从没有默认导出的模块进行默认导入
        "resolveJsonModule": true, // 允许使用 .json 扩展名导入的模块
        /* react 模式下：直接将 JSX 编译成 JS，会生成 React.createElement 的形式，在使用前不需要再进行转换操作了，输出文件的扩展名为 .js */
        /* preserve 模式下：不会将 JSX 编译成 JS，生成代码中会保留 JSX，以供后续的转换操作使用（比如：Babel）。 另外，输出文件会带有 .jsx 扩展名 */
        /* react-native 模式下：相当于 preserve，它也保留了所有的 JSX，但是输出文件的扩展名是 .js */
        "jsx": "react", // 在.tsx文件中支持JSX
        "sourceMap": true, // 生成相应的.map文件
        "declaration": true, // 生成相应的.d.ts文件
        "allowUmdGlobalAccess": true,
        "experimentalDecorators": true, // 启用对ES装饰器的实验性支持
        "moduleResolution": "node", // 将模块解析模式设置为node.js解析模式
        "baseUrl": "./",
        "incremental": true, // 通过从以前的编译中读取/写入信息到磁盘上的文件来启用增量编译
        "forceConsistentCasingInFileNames": true,
        /* 当目标是ES5或ES3的时候提供对for-of、扩展运算符和解构赋值中对于迭代器的完整支持 */
        "downlevelIteration": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noImplicitReturns": true,
        "noFallthroughCasesInSwitch": true,
        // 不允许使用隐式的 any 类型
        "noImplicitAny": false,
        // 不允许 this 有隐式的 any 类型，即 this 必须有明确的指向
        "noImplicitThis": false,
        // 不允许把 null、undefined 赋值给其他类型变量
        "strictNullChecks": false,
        "paths": {
            //别名
            "@/*": [
                "src/*"
            ],
            "@images/*": [
                "src/assets/images/*"
            ],
        }
    },
    "include": [
        "src"
    ],
    "exclude": [
        "node_modules",
        "dist"
    ] // *** 不进行类型检查的文件 ***
}

```
yarn i react@17 react-dom@17
npm i @types/react@17 @types/react-dom@17 -D 

src/index.tsx
```
import React from 'react'
import { render } from "react-dom";

try {
  const rootElement = document.getElementById('root')
  console.log('运行');
  const App =()=>{
    return <div className='hello'>Hello</div>
  }
  render(<App />,rootElement)
} catch (error) {
  console.log('error: ', error);
}
```

npm i webpack webpack-cli webpack-dev-server webpack-merge dotenv dotenv-webpack -D

创建webpack配置文件夹目录结构

webpackUtils webpack 工具类文件夹
base 基类webpack配置
dev 开发环境
prod 生产环境

webpack/webpackUtils/util.js
```
const fs = require('fs')
const packageConfig = require ('../../package.json')

function readFile(curPath) {
  const content = fs.readFileSync(curPath,'utf-8')
  return content
}

function getVersion() {
  return packageConfig.version || '1.0.0'
}

function getTestVersion() {
  return packageConfig.testVersion || '1.0.0'
}

function getEnv() {
  return process.env.NODE_ENV || 'dev'
}

module.exports = {
  readFile,
  getVersion,
  getTestVersion,
  getEnv
}
```
webpack/webpackUtils/variable.js
```
const path = require('path');
const webpackUtils = require('./util');
const dotenv = require('dotenv')

const {config:loadConfig} = dotenv

const NODE_ENV = webpackUtils.getEnv()

//构建目录
const DIST_PATH = path.resolve(__dirname, '../../', 'dist');
//源码目录
const SRC_PATH = path.resolve(__dirname, '../../', 'src');
//public 目录
const PUBLIC_PATH = path.resolve(__dirname, '../../', 'public');
//根节点目录
const ROOT_PATH = path.resolve(__dirname, '../../');
//是否是产线环境
const IS_PRO = NODE_ENV === 'prod';
//是否是开发环境
const IS_DEV = NODE_ENV === 'dev';

const version = webpackUtils.getVersion()

function getCDNPath() {
  return IS_PRO ? `${process.env.CDN_ROOT}/${version}/` : '/';
}

const ENV_CONFIG_PATH = path.resolve(ROOT_PATH,'env',`${NODE_ENV}.env`)

//webpack 读取env配置
loadConfig({
  path:ENV_CONFIG_PATH
})

module.exports = {
  DIST_PATH,
  SRC_PATH,
  PUBLIC_PATH,
  ROOT_PATH,
  IS_PRO,
  IS_DEV,
  getCDNPath,
  ENV_CONFIG_PATH,
}
```

webpack/webpackUtils/resolve.js
```
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
```
webpack.base.js
```
const path = require('path')
//变量配置工具类
const variable = require ('./webpackUtils/variable')
// 别名工具类
const resoveConfig = require ('./webpackUtils/resolve')
// 公用插件
const pliguns = require('./webpackUtils/plugins')

const { SRC_PATH, DIST_PATH, IS_DEV, IS_PRO, getCDNPath } = variable;

const config ={
  entry:{
    index:path.join(SRC_PATH,'index.jsx')
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
```
上面代码是一份基类配置，我们需要针对不同的开发环境增加不同的配置，我们可以通过 webpack-merge实现继承base配置。

webpack/webpack.dev.js（开发环境）
```
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
```

webpack.prod.js
```
const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const variable = require('./webpackUtils/variable');

const { DIST_PATH } = variable;

const config = {
  mode:'production',
  cache:{type:'filesystem',buildDependencies: { config: [__filename] }}, // 使用文件缓存
  optimization:{
    minimize:true,//开启压缩
    moduleIds:'deterministic', //单独模块id，名字是被哈希转化成的小位数值模块名
    splitChunks:{
      chunks:'all', // 匹配的块的类型：initial（初始块），async（按需加载的异步块），all（所有块）
      automaticNameDelimiter: '-', //文件名分隔符
      cacheGroups:{
        // 项目第三方组件
        vendor: {
          name: 'vendors',
          enforce: true, // ignore splitChunks.minSize, splitChunks.minChunks, splitChunks.maxAsyncRequests and splitChunks.maxInitialRequests
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
        },
        // 项目公共组件
        default: {
          minSize: 0, // 分离后的最小块文件大小默认3000
          name: 'common', // 用以控制分离后代码块的命名
          minChunks: 3, // 最小共用次数
          priority: 10, // 优先级，多个分组冲突时决定把代码放在哪块
          reuseExistingChunk: true,
        },
      }
    }
  }
}
const mergedConfig = webpackMerge.merge(baseConfig, config);
module.exports = mergedConfig;
```
由于我们用到了babel，先安装babel(支持装饰器，垫片包，ts,react)，具体每个babel的作用可以查看 babel中文网，这里不做过多解释。
@babel/core @babel/cli @babel/preset-env @babel/preset-typescript @babel/plugin-proposal-decorators @babel/preset-react @babel/plugin-transform-runtime @babel/runtime-corejs3 -D

babel.config.js
```
var isDev=false;
if(process.env.NODE_ENV==="dev"){
    isDev=true;
}

module.exports = function (api) {
    api.cache(true);
    const presets = [  [
        "@babel/preset-react",
        {
            "development": isDev
        }
    ],
    [
        "@babel/preset-env",
        {
            "targets": {
                "browsers": [
                    ">0.25%",
                    "not ie 11",
                    "not op_mini all"
                ]
            }
        }
    ],
    [
        "@babel/preset-typescript",
        {
            "isTSX": true,
            "allExtensions": true
        }
    ]];
    const plugins = [ [
        "@babel/plugin-proposal-decorators",
        {
            "legacy": true
        }
    ],
    [
        "@babel/plugin-transform-runtime",
        {
            "corejs": 3,
            "regenerator": true
        }
    ]];
    return {
      // 这个不设置的话，webpack 魔法注释会被删除，魔法注释用于分包
     "comments": true,
      presets,
      plugins
    };
  }
```

npm i html-webpack-plugin babel-loader -D

在public 文件夹下创建index.html

webpack/webpackUtils/plugins.js
```
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
```