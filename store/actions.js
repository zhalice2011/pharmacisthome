import Services from './services'
export default {
    getWechatSignture({commit},url){  //通过他来进行请求签名值的操作
        return Services.getWechatSignture(url)
    },

    getUserByOAuth({commit},url){  //通过他来进行请求网页授权
        return Services.getUserByOAuth(url)
    }

}