
const tip = '周达理\n' + '<a href="http://baidu.com">我真的是智障</a>'

//暴露出去一个异步的函数
export default async (ctx, next)=>{
    const message = ctx.weixin 
    // console.log("这里是reply拿到的微信",message)
    // ctx.body = tip
    console.log("这里是回复的策略-->message=:",message)
    let mp = require('../wechat')
    let client = mp.getWechat()  //拿到配置项




    if(message.MsgType === 'event'){ 
        if(message.Event === 'subscribe'){ //subscribe(订阅)
            ctx.body = tip
        }else if(message.Event === 'unsubscribe'){ //unsubscribe(取消订阅)
            console.log("取消关注")
        }else if(message.Event === 'LOCATION'){ //允许获取位置信息地理位置
            ctx.body = message.Latitude+":"+message.Longitude
        }
    }else if(message.MsgType === 'text'){  //测试  文本类型
        if(message.Content === '1'){
            const data = await client.handle('getUserInfo','o6CCOv07vBrYB5v1MvtlROyAXWAc')
            console.log("这是用户的方法",data)
        }
        ctx.body = message.Content
    }else if(message.MsgType === 'image'){ //测试  图片类型
        ctx.body = {
            type:'image',
            mediaId:message.MediaId
        }
    }else if(message.MsgType === 'voice'){  //测试  语音类型
        ctx.body = {
            type:'voice',
            mediaId:message.MediaId,
        }
    }else if(message.MsgType === 'video'){ //测试  视频类型
        ctx.body = {
            tittle:message.ThumbMediaId,
            type:'video',
            mediaId:message.MediaId,
        }
    }else if(message.MsgType === 'location'){ //测试  地理位置消息
        ctx.body = message.Location_X+':'+message.Location_Y+':'+message.Label
    }else if(message.MsgType === 'link'){ //测试  一个连接
        
        ctx.body = [{
            title:message.Title,
            description:message.Description,
            picUrl:'http://mmbiz.qpic.cn/mmbiz_jpg/evSnewkSotOEKTR0uwvXhZGhEgkjW4hPEep5osib6BCdU4YPJg1kgaJJa5g8IAxwah1QEPCc5uGDx6pl4EWgKZw/0',
            url:message.Url
        }]
    }

    // else if(message.MsgType === 'text'){ //测试  音乐类型
    //     ctx.body = message.Content
    // }else if(message.MsgType === 'text'){ //测试  图文类型
    //     ctx.body = message.Content
    // }

}

