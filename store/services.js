
//接口服务相关的


import axios from 'axios'

const baseUrl = ''

class Services {
    getWechatSignture(url){
        return axios.get(`${baseUrl}/wechat-signature?url=${url}`)
    }
    getUserByOAuth(url){
        return axios.get(`${baseUrl}/wechat-oauth?url=${url}`)
    }
}

export default new Services()