import  request  from "request-promise";
import formstream from 'formstream'
import fs from 'fs'
import * as _ from 'lodash'
import path from 'path'
import {sign} from './util'


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
    },
    tag: {
        create: base + 'tags/create?',
        fetch: base + 'tags/get?',
        update: base + 'tags/update?',
        del: base + 'tags/delete?',
        fetchUsers: base + 'user/tag/get?',
        batchTag: base + 'tags/members/batchtagging?',
        batchUnTag: base + 'tags/members/batchuntagging?',
        getTagList: base + 'tags/getidlist?'
      },
      user: {
        remark: base + 'user/info/updateremark?',  //设置用户名字
        info: base + 'user/info?',  //获取用户基本信息  ----用得最多的
        batchInfo: base + 'user/info/batchget?', //批量获取用户基本信息
        fetchUserList: base + 'user/get?', //获取用户关注着列表
        getBlackList: base + 'tags/members/getblacklist?', //获取黑名单列表
        batchBlackUsers: base + 'tags/members/batchblacklist?', //批量获取黑名单列表
        batchUnblackUsers: base + 'tags/members/batchunblacklist?'  //拉黑用户
      },
      menu: {
        create: base + 'menu/create?',  //创建菜单
        get: base + 'menu/get?',
        del: base + 'menu/delete?',
        addCondition: base + 'menu/addconditional?',  //创建个性化菜单
        delCondition: base + 'menu/delconditional?',  //删除个性化菜单
        getInfo: base + 'get_current_selfmenu_info?'  //获取个性化菜单
      },
      ticket: {
        get: base + 'ticket/getticket?'
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
        this.getTicket = opts.getTicket
        this.saveTicket = opts.saveTicket
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

    //获取AccessToke
    async fetchAccessToken () { 
        console.log("运行获取--->fetchAccessToken")
        //首先拿到当前的token
        let data = await this.getAccessToken()
        console.log("首先拿到当前的token",data)
        if (!this.isValidToken(data,"access_token")) { //如果不合法
            console.log("当前的token不合法")
            data =  await this.updateAccessToken()
        }
        console.log("当前的token合法保存然后返回",data)
        await this.saveAccessToken(data)
        
        return data
    }
    //获取Ticket
    async fetchTicket (token) { 
        //首先拿到当前的token
        let data = await this.getTicket()
        console.log("fetchTicket---拿到data",data)
        if (!this.isValidToken(data,'ticket')) { //如果不合法
            console.log("当前的token不合法")
            data =  await this.updateTicket(token)
        }
        console.log("当前的token合法保存然后返回",data)
        await this.saveTicket(data)
        
        return data
    }

    //更新access_token 
    async updateAccessToken () {
        console.log("运行更新--->updateAccessToken")
        
        const url = api.accessToken+'&appid='+this.appID+'&secret='+this.appSecret
        //console.log("url--->url=",url)
        
        const data = await this.request({url:url})

        const now = (new Date().getTime())
        const expiresIn = now +(data.expires_in- 20)*1000  //20s是缓冲器

        data.expires_in = expiresIn

        return data
    }
    //更新Ticket
    async updateTicket (token) {
        const url = api.ticket.get + '&access_token=' + token + '&type=jsapi'
    
        let data = await this.request({url: url})
        const now = (new Date().getTime())
        const expiresIn = now + (data.expires_in - 20) * 1000
    
        data.expires_in = expiresIn
    
        return data
    }

    //判断是否合法的方法
    isValidToken (data,name) {
        console.log("判断是否合法--->isValidToken")
        
        if(!data || !data[name] ||!data.expires_in){
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
        //console.log("周达理",operation)
        const tokenData = await this.fetchAccessToken()
        const options = await this[operation](tokenData.access_token,...args) //传入的是uploadMaterial ,则表示运行下面的上传diamante

        console.log("周达理 这是请求之前的options",JSON.stringify(options))
        
        const data =  await this.request(options)
        return data
    }


    //上传素材(其实就是在构建表单)   // token(用户标识) type(类型)  material(路径)     permanent:素材的类型
    async uploadMaterial(token, type, material, permanent){  //配置上传的options
        let form ={}
        let url = api.temporary.upload
        console.log("token, type, material, permanent",token, type, material, permanent)
        if(permanent){ //判断素材的类型(永久或者非永久)
            url = api.permanent.upload

            _.extend(form,permanent)
        }
        if(type === 'pic'){
            url = api.permanent.uploadNewsPic
        }
        if(type === 'news'){
            url = api.permanent.uploadNews
            form = material
        }else{
            //form = formstream()
            form.media = fs.createReadStream(material)
            // const stat = await statFile(material)  //拿到stat
            // form.file('media',material,path.basename(material),stat.size)
        }
        //拼接上传的url
        let uploadUrl = url + 'access_token='+token

        //追加类型是否永久
        if(!permanent){ //如果不是永久类型
            uploadUrl+= '&type=' +type
        }else{
            if(type!=='news'){
                form.access_token = token                
            }
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
            options.formData  = JSON.stringify(form)            
        }
        return options
    }


    //获取素材
    fetchMaterial (token, mediaId, type, permanent) {
        let form = {}
        let fetchUrl = api.temporary.fetch

        if (permanent) {
            fetchUrl = api.permanent.fetch
        }

        let url = fetchUrl + 'access_token=' + token
        let options = {method: 'POST', url: url}

        if (permanent) {
            form.media_id = mediaId
            form.access_token = token
            options.body = form
        } else {
            if (type === 'video') {
            url = url.replace('https://', 'http://')
            }

            url += '&media_id=' + mediaId
        }

        return options
    }
    //删除永久素材
    deleteMaterial (token, mediaId) {
        const form = {
          media_id: mediaId
        }
        const url = api.permanent.del + 'access_token=' + token + '&media_id' + mediaId
    
        return {method: 'POST', url: url, body: form}
    }
    //更新素材
    updateMaterial (token, mediaId, news) {
        const form = {
          media_id: mediaId
        }
    
        _.extend(form, news)
        const url = api.permanent.update + 'access_token=' + token + '&media_id=' + mediaId
    
        return {method: 'POST', url: url, body: form}
    }
    //素材树木
    countMaterial (token) {
        const url = api.permanent.count + 'access_token=' + token
    
        return {method: 'POST', url: url}
    }
    //素材分组
    batchMaterial (token, options) {
        options.type = options.type || 'image'
        options.offset = options.offset || 0
        options.count = options.count || 10
    
        const url = api.permanent.batch + 'access_token=' + token
    
        return {method: 'POST', url: url, body: options}
    }

    //用户标签管理---------------------------------

    //创建标签
    createTag (token, name) {
        const form = {
          tag: {
            name: name
          }
        }
        const url = api.tag.create + 'access_token=' + token
    
        return {method: 'POST', url: url, body: form}
    }
    //获取标签
    fetchTags (token) {
        const url = api.tag.fetch + 'access_token=' + token
    
        return {url: url}
    }
    //更新标签
    updateTag (token, tagId, name) {
        const form = {
          tag: {
            id: tagId,
            name: name
          }
        }
    
        const url = api.tag.update + 'access_token=' + token
    
        return {method: 'POST', url: url, body: form}
    }
    //删除标签
    delTag (token, tagId) {
        const form = {
          tag: {
            id: tagId
          }
        }
    
        const url = api.tag.del + 'access_token=' + token
    
        return {method: 'POST', url: url, body: form}
    }
    
    fetchTagUsers (token, tagId, openId) {
        const form = {
          tagid: tagId,
          next_openid: openId || ''
        }
        const url = api.tag.fetchUsers + 'access_token=' + token
    
        return {method: 'POST', url: url, body: form}
    }
    // unTag true|false
    batchTag (token, openIdList, tagId, unTag) {
        const form = {
        openid_list: openIdList,
        tagid: tagId
        }
        let url = api.tag.batchTag

        if (unTag) {
        url = api.tag.batchUnTag
        }

        url += 'access_token=' + token

        return {method: 'POST', url: url, body: form}
    }

    getTagList (token, openId) {
        const form = {
        openid: openId
        }
        const url = api.tag.getTagList + 'access_token=' + token

        return {method: 'POST', url: url, body: form}
    }

    //用户--------------------------------
    //获取用户基本信息
    getUserInfo (token, openId, lang) {
        const url = `${api.user.info}access_token=${token}&openid=${openId}&lang=${lang || 'zh_CN'}`
    
        return {url: url}
    }  
    //批量用户基本信息
    batchUserInfo (token, userList) {
        const url = api.user.batchInfo + 'access_token=' + token
        const form = {
          user_list: userList
        }
    
        return {method: 'POST', url: url, body: form}
    }
    //获取用户列表
    fetchUserList (token, openId) {
        const url = `${api.user.fetchUserList}access_token=${token}&next_openid=${openId || ''}`
    
        return {url: url}
    }  

    //菜单 ---------------------------------------------
    //创建菜单
    createMenu (token, menu) {
        const url = api.menu.create + 'access_token=' + token
        
        return {method: 'POST', url: url, body: menu}
    }
    
    getMenu (token) {
        const url = api.menu.get + 'access_token=' + token
    
        return {url: url}
    }
    
    delMenu (token) {
        const url = api.menu.del + 'access_token=' + token
    
        return {url: url}
    }
    //穿件个性化菜单
    addConditionMenu (token, menu, rule) {
        const url = api.menu.addCondition + 'access_token=' + token
        const form = {
          button: menu,
          matchrule: rule
        }
    
        return {method: 'POST', url: url, body: form}
    }
    
    delConditionMenu (token, menuId) {
        const url = api.menu.delCondition + 'access_token=' + token
        const form = {
          menuid: menuId
        }
    
        return {method: 'POST', url: url, body: form}
    }

    getCurrentMenuInfo (token) {
        const url = api.menu.getInfo + 'access_token=' + token

        return {url: url}
    }

    sign (ticket, url) {
        return sign(ticket, url)
    }
}