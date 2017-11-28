import mongoose, { model } from 'mongoose'
import config from '../config'
import fs from 'fs'
import {resolve} from 'path'

const models = resolve(__dirname,'../database/schema')  //找到所有的schema所在的目录

//同步读取这些模型文件
fs.readdirSync(models)  //读取所有的文件
.filter(file => ~file.search(/^[^\.].*js$/))  ///^[^\.].*js$/筛选出以.js文件的文件
.forEach(file => require(resolve(models,file)))  //遍历引入到当前的模块内

//暴露出去这个database
export const database = app => {
    mongoose.set('debug',true)  //开发模式下开启debug

    mongoose.connect(config.db)  //数据库名字

    mongoose.connection.on('disconnected', () => { //当连接中断就重新连接数据库
        mongoose.connect(config.db)
    }) 
    mongoose.connection.on('error', err => { //数据库报错的时候
        console.error(err)
    })  
    mongoose.connection.on('open', async => { //数据库打开的时候 设置成异步函数
        console.log("Connected to MongoDb",config.db)
    })  

}