const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
//webpack需要把最终构建好的静态资源都引入到一个html文件中,这样才能在浏览器中运行,html-webpack-plugin就是来做这件事情的,
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
//在开发环境我们希望css嵌入在style标签里面,方便样式热替换,但打包时我们希望把css单独抽离出来,方便配置缓存策略。

const isDev = process.env.NODE_ENV === 'development'
module.exports = {
  entry: path.join(__dirname, '../src/index.tsx'),
  //入口文件
  output: {
    filename: 'static/js/[name].[chunkhash:8].js',
    // 每个输出js的名称[见footer]
    path: path.join(__dirname, '../dist'),
    // 打包结果输出路径
    clean: true,
    // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    publicPath: '/',
    // 打包后文件的公共前缀路径
  },
  module: {
    rules: [
      {
        include: [path.resolve(__dirname, '../src')], //只对项目src文件的ts,tsx进行loader解析
        // include：只解析该选项配置的模块
        //exclude：不设置该选项配置的模块,优先级更高
        //其他loader也是相同的配置方式,如果除src文件外也还有需要解析的,就把对应的目录地址加上就可以了,比如需要引入antd的css,可以把antd的文件目录路径添加解析css规则到include里面。
        test: /.(ts|tsx)$/,
        // 匹配.ts, tsx文件
        use: ['thread-loader', 'babel-loader'],
        // 预设执行顺序由右往左,所以先处理ts,再处理jsx
        // 将此 'thread-loader'放置在其他 loader 之前。放置在此 loader 之后的 loader 会在一个独立的 worker 池中运行。
      },
      {
        include: [path.resolve(__dirname, '../src')],
        test: /.css$/,
        //匹配 css 文件
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          // 开发环境使用style-looader,打包模式抽离css
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        include: [path.resolve(__dirname, '../src')],
        test: /.less$/,
        //匹配less 文件
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
           // 开发环境使用style-looader,打包模式抽离css
          'css-loader',
          'postcss-loader',
          'less-loader',
        ],
      },
      //倒序遍历rules数组，如果文件后缀和test正则匹配到了，就会使用该rule中配置的loader依次对文件源代码进行处理
      //最终拿到处理后的sourceCode结果，可以通过避免使用无用的loader解析来提升构建速度，
      {
        test: /.(png|jpg|jpeg|gif|svg)$/,
        // 匹配图片文件
        type: 'asset',
        // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
            // 小于10kb转base64位
          },
        },
        generator: {
          filename: 'static/images/[name].[contenthash:8][ext]',
          // 文件输出目录和命名
        },
      },
      {
        test: /.(woff2?|eot|ttf|otf)$/,
        // 匹配字体图标文件
        type: 'asset',
        // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
            // 小于10kb转base64位
          },
        },
        generator: {
          filename: 'static/fonts/[name].[contenthash:8][ext]',
          //  文件输出目录和命名
        },
      },
      {
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
        generator: {
          filename: 'static/fonts/[name].[contenthash:8][ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.tsx', '.ts'],
    //extensions是webpack的resolve解析配置下的选项，在引入模块时不带文件后缀时，会来该配置数组里面依次添加后缀查找文件，因为ts不支持引入以 .ts, tsx为后缀的文件，所以要在extensions中配置，而第三方库里面很多引入js文件没有带后缀，所以也要配置下js
    alias: {
      '@': path.join(__dirname, '../src'),
    },
    //设置别名alias,设置别名可以让后续引用的地方减少路径的复杂度。
    modules: [path.resolve(__dirname, '../node_modules')],// 查找第三方模块只在本项目的node_modules中查找
    //使用require和import引入模块时如果有准确的相对或者绝对路径,就会去按路径查询,
    //如果引入的模块没有路径,会优先查询node核心模块,如果没有找到会去当前目录下node_modules中寻找,如果没有找到会查从父级文件夹查找node_modules,一直查到系统node全局模块。
    //这样会有两个问题,一个是当前项目没有安装某个依赖,但是上一级目录下node_modules或者全局模块有安装,就也会引入成功
    //但是部署到服务器时可能就会找不到造成报错,另一个问题就是一级一级查询比较消耗时间。可以告诉webpack搜索目录范围,来规避这两个问题。
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'), //模板取定义root节点的模板
      inject: true, // 自动注入静态资源
    }),
    new webpack.DefinePlugin({
      'process.env.BASE_ENV': JSON.stringify(process.env.BASE_ENV),
    }),
  ],
  cache: {
    type: 'filesystem',
  },
  // 使用文件缓存
}


//项目维护的时候,一般只会修改一部分代码,可以合理配置文件缓存,来提升前端加载页面速度和减少服务器压力,而hash就是浏览器缓存策略很重要的一部分。webpack打包的hash分三种：

//hash：跟整个项目的构建相关,只要项目里有文件更改,整个项目构建的hash值都会更改,并且全部文件都共用相同的hash值
//chunkhash：不同的入口文件进行依赖文件解析、构建对应的chunk,生成对应的哈希值,文件本身修改或者依赖文件修改,chunkhash值会变化
//contenthash：每个文件自己单独的 hash 值,文件的改动只会影响自身的 hash 值

