
//用来存放全局票据

const mongoose = require('mongoose')
const Schema = mongoose.Schema


const TokenSchema = new mongoose.Schema({
    name: String,
    token: String,
    expires_in:Number,
    meta:{  
        createdAt:{  //创建时间 默认时间是当前时间
            type:Date,
            default:Date.now()
        },
        updatedAt:{ //更新的时间
            type:Date,
            default:Date.now()
        }
    }
})

//绑定一个中间件,就是在每一条数据保存之前都经过这个中间件来进行处理
TokenSchema.pre('save',function(next){
    console.log("我到这里了哦this",this)

    if (this.isNew){ //如果这条数据是新增的数据 更新一下这个时间
        this.meta.createdAt = this.meta.updatedAt = Date.now()
    } else {
        this.meta.updatedAt = Date.now()
    }

    next() //调用next往下走
})

//新增一个静态方法  是在mode
TokenSchema.statics = {
    async getAccessToken() {
        const token = await this.findOne({
            name: 'access_token'
        }).exec()
        //.exec()是执行  返回token

        //判断
        if (token && token.token){
            token.access_token = token.token
        }

        return token

    },
    //保存token的方法
    async saveAccessToken(data) {
        console.log("存储票据--->saveAccessToken",data)
        let token = await this.findOne({
            name:'access_token'
        }).exec()
        //如果能查询到更新  否则就新生成一条数据
        if (token) {
            token.token = data.access_token
            token.expires_in = data.expires_in
        } else {
            token = new Token({
                name : 'access_token',
                token : data.access_token,
                expires_in : data.expires_in
            })
        }
        console.log("存储票据--->saveAccessToken2",data)
        
        //无论是更新还是新增  都让这个token保存一下
        await token.save()
        console.log("accessToken存储完毕")
        return data
    }
}

//拿到这个数据模型 然后new方法生成一个数据的实例
const Token = mongoose.model('Token',TokenSchema)