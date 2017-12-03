
//用来存放jssdk临时票据

const mongoose = require('mongoose')
const Schema = mongoose.Schema


const TicketSchema = new mongoose.Schema({
    name: String,
    ticket: String,
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
TicketSchema.pre('save',function(next){
    //console.log("我到这里了哦this",this)

    if (this.isNew){ //如果这条数据是新增的数据 更新一下这个时间
        this.meta.createdAt = this.meta.updatedAt = Date.now()
    } else {
        this.meta.updatedAt = Date.now()
    }

    next() //调用next往下走
})

//新增一个静态方法  是在mode
TicketSchema.statics = {
    async getTicket() {
        const ticket = await this.findOne({
            name: 'ticket'
        }).exec()
        //判断
        if (ticket && ticket.ticket){
            ticket.ticket = ticket.ticket
        }

        return ticket

    },
    //保存ticket的方法
    async saveTicket(data) {
        //console.log("存储票据--->saveAccessticket",data)
        let ticket = await this.findOne({
            name:'ticket'
        }).exec()
        //如果能查询到更新  否则就新生成一条数据
        if (ticket) {
            ticket.ticket = data.ticket
            ticket.expires_in = data.expires_in
        } else {
            ticket = new Ticket({
                name : 'ticket',
                ticket : data.ticket,
                expires_in : data.expires_in
            })
        }
        try {
            await ticket.save()
            console.log("ticket存储完毕")
        
        } catch (e) {
            console.log('存储失败')
            console.log(e)
        }
        return data 
    }
}

//拿到这个数据模型 然后new方法生成一个数据的实例
const Ticket = mongoose.model('Ticket',TicketSchema)

// const mongoose = require('mongoose')
// const Schema = mongoose.Schema

// const TicketSchema = new mongoose.Schema({
//   name: String,
//   ticket: String,
//   expires_in: Number,
//   meta: {
//     createAt: {
//       type: Date,
//       default: Date.now()
//     },
//     updateAt: {
//       type: Date,
//       default: Date.now()
//     }
//   }
// })

// TicketSchema.pre('save', function (next) {
//   if (this.isNew) {
//     this.meta.createAt = this.meta.updateAt = Date.now()
//   } else {
//     this.meta.updateAt = Date.now()
//   }

//   next()
// })

// TicketSchema.statics = {
//   async getTicket () {
//     const ticket = await this.findOne({ name: 'ticket' }).exec()

//     return ticket
//   },

//   async saveTicket (data) {
//     let ticket = await this.findOne({ name: 'ticket' }).exec()
//     if (ticket) {
//       ticket.ticket = data.ticket
//       ticket.expires_in = data.expires_in
//     } else {
//       ticket = new Ticket({
//         name: 'ticket',
//         expires_in: data.expires_in,
//         ticket: data.ticket
//       })
//     }

//     try {
//       await ticket.save()
//     } catch (e) {
//       console.log('存储失败')
//       console.log(e)
//     }

//     return data
//   }
// }

// const Ticket = mongoose.model('Ticket', TicketSchema)
