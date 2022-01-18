module.exports = {
  publicPath: '/',
  outputDir: 'dist', // 打包的目录
  lintOnSave: true, // 在保存时校验格式
  productionSourceMap: false, // 生产环境是否生成 SourceMap
  devServer: {
    //api---https://cli.vuejs.org/zh/config
    open: false, // 启动服务后是否打开浏览器
    overlay: { // 错误信息展示到页面
      warnings: true,
      errors: true
    },
    host: '0.0.0.0',
    port: 8066, // 服务端口
    https: false,
    hotOnly: false,
    proxy: {
      // 接口请求代理
      "/": {
        ws: true,      
        changOrigin: true,  //允许跨域
        target: 'http://192.168.8.144:3001/api'
      }
    },
  }
}