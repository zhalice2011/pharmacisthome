import Router from 'koa-router'
import config from '../config'
import reply from '../wechat/reply'
import wechatMiddle from '../wechat-lib/middleware'
import {resolve} from 'path'


import { signature,redirect,oauth} from '../controllers/wechat'

//  import '../wechat'   //引入这个文件夹 就会去执行wechat/index.js里面的代码

export const router = app =>{
    //console.log('我是传入的数组中的第一个路由router')
    const router = new Router()
    //all是不管get还是post都是从这里面过
    router.all('/wechat-hear',wechatMiddle(config.wechat,reply))

    router.get('/wechat-signature',signature)  //截获
    router.get('/wechat-redirect',redirect)  //跳转
    router.get('/wechat-oauth',oauth)  //跳转
    
    
    
    //})
    // router.post('/wechat-hear',(ctx,next) =>{
        
    // })
    app.use(router.routes())
       .use(router.allowedMethods())
    
}