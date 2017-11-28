
//对微信异步场景的函数进行初始化操作

import mongoose from 'mongoose'

import config from '../config'

import Wechat from '../wechat-lib/'

const Token = mongoose.model('Token')
console.log("我是wechat 我被引入了")

const wechatConfig = {
        wechat: {
            appID:config.wechat.appID,
            appSecret:config.wechat.appSecret,
            token:config.wechat.token,
            getAccessToken:async()=> await Token.getAccessToken(),
            saveAccessToken:async(data)=> await Token.saveAccessToken(data)
        }
}

export const getWechat =()=>{
    console.log("我们传入的是wechatConfig.wechat",wechatConfig.wechat)
    const wechatClient = new Wechat(wechatConfig.wechat)

    return wechatClient
}

getWechat()