import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const createStore = () =>{
    return new Vuex.Store({
        state:{
            currentHouse:{},
            focusCharacter:{},
            houses:[],
            cities:[],
            products:[],

            characters:[]
        },
        getters,
        actions,
        mutations
    })
}

//最后吧这个store暴露出去
export default createStore