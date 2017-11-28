import Koa from 'koa'
import { Nuxt, Builder } from 'nuxt'
import R from 'ramda'  //函数的排列 数据的传递变得容易
import {resolve} from 'path'

let config = require('../nuxt.config.js')
config.dev = !(process.env === 'production')

//定义一个r函数  传入一个path 返回的是当前标准目录
const r = path => resolve(__dirname,path)
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000
//定义一个我们将来需要用的中间件数组
const MIDDLEWARES = ['database','router']

class Server{  //定义一个Server类
  constructor () {
    this.app = new Koa()
    this.useMiddleWares(this.app)(MIDDLEWARES)

  }
  useMiddleWares (app){ //加载不同的中间件 R.map遍历一个数组
    return R.map(R.compose(  //右侧函数的结果是左侧的参数
      R.map(i => i(app)),
      require,
      i => `${r('./middlewares')}/${i}`   //这里是一个函数
    ))
  }
  async start() {  //在这个里面启动服务器
      console.log("我在这啊")
      const nuxt = new Nuxt(config)
      // Build in development
      if (config.dev) {  //如果是开发环境的话就实时编译这个程序
        const builder = new Builder(nuxt)  
        await new Builder(nuxt).build()
      }
    
      this.app.use(async (ctx, next) => {
        await next()
        ctx.status = 200 // koa defaults to 404 when it sees that status is unset
        return new Promise((resolve, reject) => {
          ctx.res.on('close', resolve)
          ctx.res.on('finish', resolve)
          nuxt.render(ctx.req, ctx.res, promise => {
            // nuxt.render passes a rejected promise into callback on error.
            promise.then(resolve).catch(reject)
          })
        })
      })
    
      this.app.listen(port, host)
      console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
  }
}
console.log('周达理 我在哪') // eslint-disable-line no-console

const app = new Server()
app.start()
