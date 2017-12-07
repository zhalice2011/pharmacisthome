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
    },

    //请求家族数据
    async currentHouse ({state},_id) {
        //先拿到这个id  进行判断 如果说
        if(_id === state.currentHouse._id) return //如果id相同就返回
        
        const res = await Services.fetchHouse(_id)
        state.currentHouse = res.data.data
        return res
    }

}