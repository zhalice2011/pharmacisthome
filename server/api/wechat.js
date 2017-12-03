//进行微信相关的api的调用

import {getWechat} from '../wechat' 

const client = getWechat() //调用这个方法  生成一个实例

//暴露出去一个异步函数

export async function getSinatureAsync (){
    //1.获取token
    const data = await client.fetchAccessToken()//获取accesstoken
    const token = data.access_token
    //2.通过token获取js tiket临时票据
    const ticketData = await client.fetchTicket(tokek) //获取ticket
    const ticket = ticketData.ticket 

    let params = client.sign(ticket,url)
    params.appId = client.appID
    return params
    
}


