import Router from 'koa-router'
import config from '../config'
import reply from '../wechat/reply'
import wechatMiddle from '../wechat-lib/middleware'
import {resolve} from 'path'

import '../wechat'   //引入这个文件夹 就会去执行wechat/index.js里面的代码

export const router = app =>{
    console.log('我是传入的数组中的第一个路由router')
    const router = new Router()
    //all是不管get还是post都是从这里面过
    router.all('/wechat-hear',wechatMiddle(config.wechat,reply))
    //router.get('/wechat-hear',(ctx,next) =>{
    console.log("收到请求,引入wechat")
    require('../wechat')
    router.get('/upload',(ctx,next)=>{
        //let Wechat = require('../wechat-lib') //引入wechat-lib下面的index
        let mp = require('../wechat/')
        let client = mp.getWechat()  //拿到配置项

        //调用
        client.handle('uploadMaterial','image',resolve(__dirname,'../../dali.png'))
    })
    
    
    
    //})
    // router.post('/wechat-hear',(ctx,next) =>{
        
    // })
    app.use(router.routes())
       .use(router.allowedMethods())
    
}