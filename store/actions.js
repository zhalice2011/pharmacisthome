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
        //console.log("fetchHouses",JSON.stringify(res.data[0].data))
        
        state.houses = res.data[0].data
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
    async focusCharacter ({ state }, _id) {
        //console.log("focusCharacter 后台接受的id",_id)
        if (_id === state.focusCharacter._id) return
        const res = await Services.focusCharacter(_id)
        //console.log("focusCharacter",JSON.stringify(res.data))
        state.focusCharacter = res.data.data
        return res
    },

    //请求家族数据
    async currentHouse ({state},_id) {
        //先拿到这个id  进行判断 如果说
        if(_id === state.currentHouse._id) return //如果id相同就返回
        console.log("_id",_id)
        //console.log("state.currentHouse._id",state.currentHouse._id)
        
        const res = await Services.fetchHouse(_id)
        //console.log("currentHouse.res._id",JSON.stringify(res.data[0].data))
        
        state.currentHouse = res.data[0].data
        return res
    },
    async fetchProducts ({ state }) {
        const res = await Services.allProducts()
    
        console.log(res.data)
        state.products = res.data
        return res
    },
    
    async focusProduct ({ state }, _id) {
        if (_id === state.focusProduct._id) return
        const res = await Services.focusProduct(_id)
        state.focusProduct = res.data
        return res
    }

} 