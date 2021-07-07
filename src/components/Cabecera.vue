
<!--

<template>
  <div>
    <v-navigation-drawer v-model="drawer" absolute temporary bottom expand-on-hover> 
      <v-list v-if="this.$store.state.token != ''">
        
        <template v-if="this.$store.state.rol =='ADMIN_ROL' || this.$store.state.rol =='ALMACENISTA_ROL'">
          <v-list-item :to="{path:'/articulo'}">
            <v-list-item-action>
              <v-icon>mdi-{{icons[1]}}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Articulos</v-list-item-title>
            </v-list-item-content>
          </v-list-item>          
        </template>
    
        <template v-if="this.$store.state.rol =='ADMIN_ROL' || this.$store.state.rol =='ALMACENISTA_ROL'">
          <v-list-item :to="{path:'/categoria'}">
            <v-list-item-action>
              <v-icon>mdi-{{icons[2]}}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Categorias</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        <template v-if="this.$store.state.rol =='ADMIN_ROL' || this.$store.state.rol =='ALMACENISTA_ROL'">
          <v-list-item :to="{path:'/compra'}">
            <v-list-item-action>
              <v-icon>mdi-{{icons[3]}}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Compras</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        <template v-if="this.$store.state.rol =='ADMIN_ROL' || this.$store.state.rol =='ALMACENISTA_ROL'">
          <v-list-item :to="{path:'/venta'}">
            <v-list-item-action>
              <v-icon>mdi-{{icons[4]}}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Ventas</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        <template v-if="this.$store.state.rol =='ADMIN_ROL' || this.$store.state.rol =='ALMACENISTA_ROL'">
          <v-list-item :to="{path:'/persona'}">
            <v-list-item-action>
              <v-icon>mdi-{{icons[5]}}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Personas</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        <template v-if="this.$store.state.rol =='ADMIN_ROL' || this.$store.state.rol =='ALMACENISTA_ROL'">
          <v-list-item :to="{path:'/usuario'}">
            <v-list-item-action>
              <v-icon>mdi-{{icons[6]}}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Usuarios</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        <template v-if="this.$store.state.rol =='ADMIN_ROL' || this.$store.state.rol =='ALMACENISTA_ROL'">
          <v-list-item :to="{path:'/login'}">
            <v-list-item-action>
              <v-icon>mdi-{{icons[7]}}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Salir</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>


    <v-card class="mx-auto overflow-hidden" height="100%" width="100%">
      <v-system-bar color="#128E75"></v-system-bar>

      <v-app-bar color="#17A589">
        <v-app-bar-nav-icon @click="drawer = true" class="white--text"></v-app-bar-nav-icon>
      </v-app-bar>
    </v-card>
    
  </div>

  
</template>

-->
<template>
  <!--si no hay token no muestra el menu-->
  <div v-if="this.$store.state.token != ''" >
    <!--barra superior-->
    <v-card class="mx-auto overflow-hidden" height="100%" width="100%">
      <v-app-bar color="#17A589">
        <v-app-bar-nav-icon @click="drawer = true" class="white--text"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <v-btn @click="cerrarSesion()" style=" position: left" > <v-icon>mdi-logout</v-icon>Salir</v-btn>
      </v-app-bar>
    </v-card>
    <!--Barra lateral derecha-->
    <v-navigation-drawer v-model="drawer" absolute temporary bottom expand  >
      <v-list>
        <v-list-item :to="{path:'/home'}">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title >Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>   
        <!--Almacen:articulos and categorias-->
        <template v-if="this.$store.state.rol =='ADMIN_ROL'">
            <v-list-group  v-for="item in items"  :key="item.title" v-model="item.active" :prepend-icon="item.action" no-action  >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title v-text="item.title" ></v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item v-for="child in item.items" :key="child.title" :to="child.ruta">
                <v-list-item-content >           
                  <v-list-item-title v-text="child.title"></v-list-item-title>
                </v-list-item-content>           
              </v-list-item>
            </v-list-group>
        </template>
        <!--compras:compras and proveedores-->
        <template v-if="this.$store.state.rol =='ADMIN_ROL' || this.$store.state.rol =='ALMACENISTA_ROL'">
          <v-list-group  v-for="item in items2"  :key="item.title" v-model="item.active" :prepend-icon="item.action" no-action  >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-text="item.title" ></v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item v-for="child in item.items" :key="child.title" :to="child.ruta">
              <v-list-item-content >           
                <v-list-item-title v-text="child.title"></v-list-item-title>
              </v-list-item-content>           
            </v-list-item>
          </v-list-group>
        </template>
        <!--ventas:ventas and clientes-->
        <template v-if="this.$store.state.rol =='ADMIN_ROL' || this.$store.state.rol =='VENDEDOR_ROL'">
          <v-list-group  v-for="item in items3"  :key="item.title" v-model="item.active" :prepend-icon="item.action" no-action  >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-text="item.title" ></v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item v-for="child in item.items" :key="child.title" :to="child.ruta">
              <v-list-item-content >           
                <v-list-item-title v-text="child.title"></v-list-item-title>
              </v-list-item-content>           
            </v-list-item>
          </v-list-group>
        </template>
        <!--consultas:consultar compras and consultar ventas-->
        <template v-if="this.$store.state.rol =='ADMIN_ROL'">
          <v-list-group  v-for="item in items4"  :key="item.title" v-model="item.active" :prepend-icon="item.action" no-action  >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-text="item.title" ></v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item v-for="child in item.items" :key="child.title" :to="child.ruta">
              <v-list-item-content >           
                <v-list-item-title v-text="child.title"></v-list-item-title>
              </v-list-item-content>           
            </v-list-item>
          </v-list-group>
        </template>
        <!--acceso:usuarios-->
        <template v-if="this.$store.state.rol =='ADMIN_ROL'">
          <v-list-group  v-for="item in items5"  :key="item.title" v-model="item.active" :prepend-icon="item.action" no-action  >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-text="item.title" ></v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item v-for="child in item.items" :key="child.title" :to="child.ruta">
              <v-list-item-content >           
                <v-list-item-title v-text="child.title"></v-list-item-title>
              </v-list-item-content>           
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
 export default {
   name: 'App',
    data(){
      return {
        drawer:false,
        token:'',
        items: [
          {action: 'mdi-sitemap',
          title: 'Almacen',
          items: [{ title: 'Categorías',ruta: {path:'/categoria'}}, {title:'Articulos',ruta:{path:'/articulo'}}],
          //active:true
          }
        ],
        items2: [
          { action: 'mdi-shopping',
            title: 'Compras',
            items: [ { title: 'Compras' ,ruta:{path:'/compra'}}, { title: 'Proveedores',ruta:{path:'/listarProveedores'} }],
          }
        ],
        items3: [
          { action: 'mdi-cart',
            title: 'Ventas',
            items: [{ title: 'Ventas' ,ruta:{path:'/venta'}}, { title: 'Clientes' ,ruta:{path:'/listarClientes'}}]  
          }
        ],
        items4: [
          { action: 'mdi-chart-line',
            title: 'Consultas',
            items: [{ title: 'Consultar compras',ruta:{path:'/consultarCompras'} }, { title: 'Consultar ventas',ruta: {path:'/consultarVentas'}} ],
          }
        ],
        items5: [
          { action: 'mdi-account-multiple',
            title: 'Acceso',
            items: [{ title: 'Usuarios',ruta:{path:'/usuario'} } ]
          }
        ],
      }//return
    },//data
    methods:{
      //Deja la bariable golbal token igual a nada y oculta el menu
      cerrarSesion(){
        this.$router.push("/");
        this.$store.dispatch("setToken", this.token);
      }
    }//methods
  };//export
</script>

