import  request  from "request-promise";

const base = 'https://api.weixin.qq.com/cgi-bin/'
const api = {
    accessToken:base+'token?grant_type=client_credential&'
}
//将他作为微信整个异步场景的入口文件


export default class Wechat {
    constructor (opts) {
        this.opts = Object.assign({},opts)
        this.appID = opts.appID
        this.appSecret = opts.appSecret
        this.getAccessToken = opts.getAccessToken
        this.saveAccessToken = opts.saveAccessToken
        
        this.fetchAccessToken()
    }

    //所有的异步的函数都通过这个request的方法来进行统一管理
    async request (options) {
        options = Object.assign({},options,{json: true})  //让他总是返回json格式的数据
        console.log("options",options) //options { url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&&appid=undefined&secret=undefined',json: true }
        try { //try用来捕获异常
            const response = await request(options)
            //console.log("微信返回response",response)
            return response
        } catch(error) {
            console.error(error)
        }
    }

    //获取
    async fetchAccessToken () { 
        console.log("运行获取--->fetchAccessToken")
        //首先拿到当前的token
        let data = await this.getAccessToken()
        if (!this.isValidAccessToken(data)) { //如果不合法
            data =  await this.updateAccessToken()
        }
        await this.saveAccessToken(data)
        
        return data
    }

    //更新access_token 
    async updateAccessToken () {
        console.log("运行更新--->fetchAccessToken")
        
        const url = api.accessToken+'&appid='+this.appID+'&secret='+this.appSecret
        //console.log("url--->url=",url)
        
        const data = await this.request({url:url})

        const now = (new Date().getTime())
        const expiresIn = now +(data.expires_in- 20)*1000  //20s是缓冲器

        data.expires_in = expiresIn

        return data
    }

    //判断是否合法的方法
    isValidAccessToken (data) {
        console.log("运行判断--->isValidAccessToken")
        
        if(!data ||!data.access_token ||!data.expires_in){
            return false
        }
        const expires_in = data.expires_in
        const now = (new Data().getTime())

        if (now < expires_in) { //小于这个说明是在过期时间之内的
            return true
        } else {
            return false
        }

    }
}