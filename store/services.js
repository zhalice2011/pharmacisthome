
//接口服务相关的


import axios from 'axios'

const baseUrl = ''
const apiUrl = 'http://rap.taobao.org/mockjsdata/25102'

class Services {
    getWechatSignture(url){
        return axios.get(`${baseUrl}/wechat-signature?url=${url}`)
    }
    getUserByOAuth(url){
        return axios.get(`${baseUrl}/wechat-oauth?url=${url}`)
    }
    fetchHouses (){
        return axios.get(`${apiUrl}/wiki/houses`)
    }
    fetchCities (){
        return axios.get(`${apiUrl}/wiki/cities`)
    }
    fetchCharacters (){
        return axios.get(`${apiUrl}/wiki/characters`)
    }
    fetchHouse (id){  //请求人物数据
        console.log("id是")
        return axios.get(`${apiUrl}/wiki/houses/${id}`)
    }
}

export default new Services()