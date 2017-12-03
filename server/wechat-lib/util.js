
//解析xml 和 合成xml的自定义工具类

import xml2js from 'xml2js'
import template from './tpl'
//暴露出去一个解析xml的函数
function parseXML (xml){
    console.log("我是parseXML函数")
    return new Promise((resolve,reject) =>{
        xml2js.parseString(xml,{trim:true},(err,content)=>{
            if(err) reject(err)
            else resolve(content)  //解析没错直接返回content
        })
    })
}
function formatMessage (result) {
    console.log("我是formatMessage函数")
    
    let message = {}

    if (typeof result === 'object'){ //如果是对象就对他进行遍历
        const keys = Object.keys(result) //拿到对象所有的key

        for  (let i = 0; i<keys.length; i++){
            let item = result[keys[i]]  //这是value
            let key = keys[i]       //这是key
            console.log("item的长度:",item.length)
            if(!(item instanceof Array  || item.length ===0)){ //如果对应的value不是数组 或者长度为0
                continue  //继续往下进行

            }
            
            if(item.length === 1) {
                let val = item[0]
                if (typeof val === 'object') {
                    message[key] = formatMessage(val)
                } else {
                    message[key] = (val || '').trim()
                }
            }else{  //对应的value长度大于1
                message[key] = []
                for (let j=0;j<item.length;j++){
                    message[key].push(formatMessage(item[j]))
                }
            }
        }

    }

    return message
}

function tpl (content, message) { //content是回复的内容  message是解析后的微信消息
    // console.log("传入的数据是content:",content)
    // console.log("传入的数据是message:",message)
    //     传入的数据是content: { type: 'image',
    //     mediaId: '8kFfktPg6UiuJ42BKKjihm2ZkaKW5_CKsLVak_oPAoLSBvKEJaKSt17quZCP8LCC' }
    //     传入的数据是message: { ToUserName: 'gh_a4518b6b1d4a',
    //     FromUserName: 'o6CCOv07vBrYB5v1MvtlROyAXWAc',
    //     CreateTime: '1511972973',
    //     MsgType: 'image',
    //     PicUrl: 'http://mmbiz.qpic.cn/mmbiz_jpg/evSnewkSotOEKTR0uwvXhZGhEgkjW4hPnLZWoeoqRa40GKF2dEc9r33q0IcAdot4FZLtOWj4YlZrSr57DYMLuw/0',
    //     MsgId: '6493874471924158573',
    //     MediaId: '8kFfktPg6UiuJ42BKKjihm2ZkaKW5_CKsLVak_oPAoLSBvKEJaKSt17quZCP8LCC' }
    let type = 'text'
    if (Array.isArray(content)){ //如果content是一个数组的话
        type = 'news'
    }

    if (!content) {  //如果content是一个空值
        content = 'Empty News'
    }
    if (content && content.type) {  //如果content是一个空值  content.type也没有
        type = content.type
    }


    let info = Object.assign({},{
        content: content,
        creatTime: new Date().getTime(),
        msgType:type || 'text',
        toUserName:message.FromUserName,
        fromUserName:message.ToUserName
    })
    console.log("info:",info)
    return template(info)
}

function createNonce () {  //生成随机字符串
    return Math.random().toString(36).substr(2, 15)
}
  
function createTimestamp () {  //生成时间戳
    return parseInt(new Date().getTime() / 1000, 0) + ''
}
function raw (args) { //排序的方法
    let keys = Object.keys(args) //拿到所有的key
    let newArgs = {}
    let str = ''
  
    keys = keys.sort()  //排序
    keys.forEach((key) => {  //对keys数组进行遍历
      newArgs[key.toLowerCase()] = args[key]  //toLowerCase变成小写  生成一个新的对象
    })
  
    for (let k in newArgs) {
      str += '&' + k + '=' + newArgs[k]
    }
  
    return str.substr(1)
}
function signIt (nonce,ticket,timestamp,url) {
    //首先进行字典排序
    const ret = {
        jsapi_ticket: ticket,
        nonceStr: nonce,
        timestamp: timestamp,
        url: url
    }
    
    const string = raw(ret)
    const sha = sha1(string)
    
    return sha
}

function sign (ticket,url) { //签名算法
    const nonce = createNonce()
    const timestamp = createTimestamp()
    const signature = signIt(nonce,ticket,timestamp,url)
    return {
        noncestr:nonce,
        timestamp:timestamp,
        signature:signature
    }
}


//通过export暴露出去这个message

export {
    formatMessage,
    parseXML,
    tpl,
    sign
}