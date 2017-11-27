import Router from 'koa-router'
import config from '../config'
import sha1 from 'sha1'

export const router = app =>{
    console.log('我是传入的数组中的第一个路由router')
    const router = new Router()
    router.get('/wechat-hear',(ctx,next) =>{
        const token = config.wechat.token
        console.log("token:",token)
        const{
            signature,
            nonce,
            timestamp,
            echostr
        } = ctx.query
        const str = [token,timestamp,nonce].sort().join('')
        const sha = sha1(str)
        if(sha === signature){
            ctx.body = echostr   
            console.log("有人嘛3")
        }else{
            ctx.body = "Failed"  
            console.log("有人4")
        }
    })
    // router.post('/wechat-hear',(ctx,next) =>{
        
    // })
    app.use(router.routes())
    app.use(router.allowedMethods())
    console.log("有人嘛")
    
}