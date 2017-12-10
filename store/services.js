
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
    /**
     * 查询单个人物详情
     * @param {Number} id
     * @return {Promise}
     */
    focusCharacter (id) {
        //console.log("有人吗 id是",id)
        return axios.get(`${apiUrl}/wiki/characters/${id}`)
    }
    fetchHouse (id){  //请求人物数据
        //console.log("id是",id)
        return axios.get(`${apiUrl}/wiki/houses/${id}`)
    }
    /**
     * 查询所有手办商品
     * @return {Promise}
     */
    allProducts () {
        return axios.get(`${apiUrl}/api/products`)
    }

    /**
     * 查询单个手办商品详情
     * @param {Number} id
     * @return {Promise}
     */
    focusProduct (id) {
        return axios.get(`${apiUrl}/api/products/${id}`)
    }

}

export default new Services()