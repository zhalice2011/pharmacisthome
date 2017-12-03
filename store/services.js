
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
}

export default new Services()