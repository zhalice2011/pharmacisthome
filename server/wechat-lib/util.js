
//解析xml 和 合成xml的自定义工具类

import xml2js from 'xml2js'

//暴露出去一个解析xml的函数
export function parseXML (xml){
    return new Promise((resolve,reject) =>{
        xml2js.parseString(xml,{trim:true},(err,content)=>{
            if(err) reject(err)
            else resolve(content)  //解析没错直接返回content
        })
    })
}