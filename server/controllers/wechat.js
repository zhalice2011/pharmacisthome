import * as api from "../api";

//微信业务相关的控制器

// export  async signature() =>{

// }

export async function signature(ctx,next){
    const url = ctx.query.url
    console.log("前台传进来的的url ",url)
    if(!url) ctx.throw(404)
    const params = await api.getSignatureAsync(url)
    console.log("前台出去的params",params)
    ctx.body = {
        success:true,
        params:params
    }

}