import compras from '../components/compras.vue';
import ventas from '../components/ventas.vue';
import articulos from '../components/articulos.vue';
import login from '../components/login.vue';
import categorias from '../components/categorias.vue';
import usuarios from '../components/usuarios.vue';
import personas from '../components/personas.vue';
import registrarse from '../components/registrarse.vue';
import home from '../components/home.vue';
import listarProveedores from '../components/listarProveedores.vue';
import listarClientes from '../components/listarClientes.vue';

export const routes = [
    {path:'/compra',component: compras},
    {path:'/venta',component: ventas},
    {path:'/articulo',component:articulos},
    {path:'/categoria',component: categorias},
    {path:'/usuario',component: usuarios},
    {path:'/persona',component: personas},
    {path:'/registrarse',component: registrarse},
    {path:'/listarProveedores',component: listarProveedores},
    {path:'/listarClientes',component: listarClientes},
    {path:'/',component: login},
    {path:'/home',component: home},
]