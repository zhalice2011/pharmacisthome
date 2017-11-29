
//微信消息中间件
import sha1 from 'sha1'
import getRawBody from 'raw-body'  //这个模块可以拿到整个xml模块的数据包
import * as util from './util'

//暴露一个函数
export default function (opts, reply) {
    return async function wechatMiddle(ctx, next){
        const token = opts.token
        const{
            signature,
            nonce,
            timestamp,
            echostr
        } = ctx.query
        const str = [token,timestamp,nonce].sort().join('')
        const sha = sha1(str)

        //判断请求方法
        if(ctx.method === 'GET'){
            if(sha === signature){
                ctx.body = echostr   
            }else{
                ctx.body = "Failed"  
            }
        } else if(ctx.method === 'POST'){
            if(sha !== signature){
                ctx.body = "Failed"  
                return false
            }
            //拿到请求过来的数据包
            const data = await getRawBody(ctx.req,{
                length:ctx.length,
                limit:'1mb',
                encoding: ctx.charset
            })
            console.log("post请求得到的data",data)
            //解析数据包
            const content = await util.parseXML(data)
            console.log("解析出来的xml文件",content)
            //const message = util.formatMessage(content.xml)
            //将解析出来的数据挂载到ctx上面,这样后面的代码单元就能获取到这个数据了
            //ctx.weixin = message
            ctx.weixin = {}
            
            //解析之后把控制权交出去 给reply函数来回复
            await reply.apply(ctx,[ctx,next])  //让reply内部进行执行 执行的时候可以调用到现在的上下文

            //拿到回复内容
            const replyBody = ctx.body
            const msg = ctx.weixin
            console.log("replyBody:",replyBody)
            console.log("content.xml:",content.xml)
            console.log("content.xml:",content.xml)
            // 解析出来的xml文件 { xml:
            //     { ToUserName: [ 'gh_a4518b6b1d4a' ],
            //       FromUserName: [ 'o6CCOv07vBrYB5v1MvtlROyAXWAc' ],
            //       CreateTime: [ '1511914428' ],
            //       MsgType: [ 'text' ],
            //       Content: [ '你离' ],
            //       MsgId: [ '6493623023063788278' ] } }
            const xml = 
            `<xml>
            
            <ToUserName><![CDATA[${content.xml.FromUserName[0]}]]></ToUserName>
            
            <FromUserName><![CDATA[${content.xml.ToUserName[0]}]]></FromUserName>
            
            <CreateTime>12345678</CreateTime>
            
            <MsgType><![CDATA[text]]></MsgType>
            
            <Content><![CDATA[${replyBody}]]></Content>
            
            </xml>`
            //const xml = util.tpl(replyBody,msg) //转化成xml数据
            ctx.status = 200
            ctx.type = 'application/xml'
            ctx.body = xml
        }



    }
}