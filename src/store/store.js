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
        },
        setIdUser(state,value){
            state.idUser = value
        },
        setName(state,value){
            state.name = value
        }
    },
    actions:{
        setToken(context,value){
            context.commit("setToken",value)
        },
        setRol(context,value){
            context.commit("setRol",value)
        },
        setIdUser(context,value){
            context.commit("setIdUser",value)
        },
        setName(context,value){
            context.commit("setName",value)
        }
    }
})