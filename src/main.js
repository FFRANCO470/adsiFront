import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import {routes} from './routes/routes.js'
import vuetify from './plugins/vuetify'
import {store} from './store/store.js'
import axios from 'axios'
import Swal from 'sweetalert2'

Vue.use(VueRouter);
Vue.config.productionTip = false

// axios.defaults.baseURL="https://adsi2067725v1.herokuapp.com/api/"
axios.defaults.baseURL="https://proyectosemilla.herokuapp.com/api/"
//axios.defaults.baseURL="https://127.0.0.1:8082/api/"
//axios.defaults.baseURL="https://localhost:8082/api/"

const router = new VueRouter({
  // en este bloque escribimos las rutas
  routes,                     
  mode:"history"
})

new Vue({
  render: h => h(App),
  axios,
  vuetify,
  router,
  store,
  Swal,
}).$mount('#app')

// router.beforeEach((to, from, next) =>{
//   if (!store.state.token && to.path != "/login"){
//     next("/login");
//   }else{
//     next();
//   }
// })