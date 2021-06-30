import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
// aqui tenemos las variables y metodos de manejo global
    state:{
        token:"",
        rol:"",
    },
    mutations:{
        setToken(state,value){
            state.token=value
        },
        setRol(state,value){
            state.rol=value
        }
    },
    actions:{
        setToken(context,value){
            context.commit("setToken",value)
        },
        setRol(context,value){
            context.commit("setRol",value)
        }
    }
})