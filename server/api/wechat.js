//进行微信相关的api的调用

import {getWechat,getOAuth} from '../wechat' 

const client = getWechat() //调用这个方法  生成一个实例

//暴露出去一个异步函数

export async function getSignatureAsync (url){
    //1.获取token
    const data = await client.fetchAccessToken()//获取accesstoken
    const token = data.access_token
    console.log("获取票据前获取的token",token)
    //2.通过token获取js tiket临时票据
    const ticketData = await client.fetchTicket(token) //获取ticket
    const ticket = ticketData.ticket 

    let params = client.sign(ticket,url)
    params.appId = client.appID
    return params
    
}



export function getAuthorizeURL (...args) {
    console.log(...args)
    const oauth = getOAuth() //拿到实例
    
    return oauth.getAuthorizeURL(...args)
}
  
export async function getUserByCode (code) {
    const oauth = getOAuth() //拿到实例
  
    const data = await oauth.fetchAccessToken(code)
    const openid = data.openid
    const user = await oauth.getUserInfo(data.access_token, openid)
  
    return user
}