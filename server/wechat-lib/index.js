import  request  from "request-promise";
import formstream from 'formstream'
import fs from 'fs'
import path from 'path'

const base = 'https://api.weixin.qq.com/cgi-bin/'
const api = {
    accessToken:base+'token?grant_type=client_credential&',
    temporary:{ //临时素材
        upload:base+'media/upload?', //上传临时素材
        fetch: base+'media/get?' //获取临时素材
    },
    permanent:{ //永久素材
        upload:base+'material/add_material?', 
        uploadNewsPic:base+'material/uploadimg?', //上传图片
        uploadNews:base+'material/add_news?',    //上传图文
        fetch: base+'material/get_material?', //获取永久素材
        del: base+'material/del_material?', //删除永久素材
        update: base+'material/update_news?', //更新(系应该)永久素材
        update: base+'material/get_materialcount?', //获取素材总数
        batch: base+'material/batch_material?' //获取素材列表
        
    }
}
//将他作为微信整个异步场景的入口文件

//读取文件大小的方法
function statFile (filepath){
    return new Promise((resolve, reject)=>{
        //通过fs上面的fs.stat方法读取文件路径,拿到err和stat
        fs.stat(filepath,(err,stat) => {
            if(err) reject(err)  //如果有错误就reject出去err
            else resolve(stat)
        })
    })
}


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
        const now = (new Date().getTime())

        if (now < expires_in) { //小于这个说明是在过期时间之内的
            return true
        } else {
            return false
        }

    }

    //上传的操作
    async handle (operation, ...args) { 
        const tokenData = await this.fetchAccessToken()
        const options = await this[operation](tokenData.accecc_token,...args)
        const data =  await this.request(options)
        return data
    }


    //上传素材(其实就是在构建表单)   // token(用户标识) type(类型)  material(路径)     permanent:素材的类型
    async uploadMaterial(token, type, material, permanent){  //配置上传的options
        let form ={}
        let url = api.temporary.upload

        if(permanent){ //判断素材的类型(永久或者非永久)
            url = api.permanent.upload

            _.extend(from,permanent)
        }
        if(type === 'pic'){
            url = api.permanent.uploadNewsPic
        }
        if(type === 'news'){
            url = api.permanent.uploadNews
            from = meterial
        }else{
            form = formstream()
            const stat = await statFile(material)  //拿到stat
            form.file('media',material,path.basename(material),stat.size)
        }
        //拼接上传的url
        let uploadUrl = url + 'accecc_token='+token

        //追加类型
        if(!permanent){ //如果不是永久类型
            uploadUrl+= '&type=' +type
        }else{
            form.filed('accecc_token',accecc_token)
        }
        //上传配置项
        const options = {
            method: 'POST',
            url: uploadUrl,
            json:true
        }
        if(type === 'new'){
            options.body = form
        }else{
            options.formData  = form            
        }
        return options
    }
}