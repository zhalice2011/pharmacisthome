
const tip = '周达理\n' + '<a href="http://baidu.com">我真的是智障</a>'

//暴露出去一个异步的函数
export default async (ctx, next)=>{
    const message = ctx.weixin 
    console.log("这里是reply拿到的微信",message)
    ctx.body = tip
}
