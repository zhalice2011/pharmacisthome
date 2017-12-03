import Services from './services'
export default {
    getWechatSignture({commit},url){  //通过他来进行请求签名值的操作
        return Services.getWechatSignture(url)
    },

    getUserByOAuth({commit},url){  //通过他来进行请求网页授权
        return Services.getUserByOAuth(url)
    },

    async fetchHouses ({state}) {
        const res = await Services.fetchHouses()
        state.houses = res.data.data
        return res
    },

    async fetchCharacters ({state}) {
        const res = await Services.fetchCharacters()
        state.characters = res.data.data  //更新state上面的数据
        return res
    },

    async fetchCities ({state}) {
        const res = await Services.fetchCities()
        state.houses = res.data.data
        return res
    }

}