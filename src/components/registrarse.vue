<template>
  <v-app>
    <v-main>
      <v-card width="500" class="mx-auto mt-9">

        <v-form ref="form" lazy-validation  >

          <v-col cols="12">
            <v-autocomplete v-model="rol" :items="items" dense filled label="Seleccione Rol" ></v-autocomplete>
          </v-col>

          <v-col cols="12">
            <v-text-field  v-model="name" :counter="50"  label="Nombre" required  prepend-icon="mdi-account-circle" ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-text-field v-model="email" label="E-mail" required prepend-icon="mdi-email" ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-text-field v-model="password" label="Contraseña"  :type=" mostrarContraseña ? 'text' : 'password'" prepend-icon="mdi-lock"
                          :append-icon="mostrarContraseña ? 'mdi-eye' : 'mdi-eye-off'"
                          @click:append="mostrarContraseña =! mostrarContraseña"/>
          </v-col>
          <v-card-actions>
            <v-btn color="success" class="mr-4" @click="registrarse" >Registrarse</v-btn>
            <v-btn color="info" @click="reset"> Limpiar</v-btn>
            <v-btn color="error" to="/"> Cancelar</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-main>

    <template>
      <v-footer dark padless >
        <v-card class="flex" flat tile >
          <v-card-title dark>
            <strong class="subheading"></strong>
           <v-spacer></v-spacer>
          </v-card-title>
          <v-card-text class="py-2 white--text text-center">
            {{ new Date().getFullYear() }} — <strong>Proyecto</strong>
          </v-card-text>
        </v-card>
      </v-footer>
    </template>
  </v-app> 
</template>


<script>
import axios from 'axios'
  export default {
    data() {
        return {
          rol:'',
          name:'',
          email:'',
            items: ['ALMACENISTA_ROL', 'VENDEDOR_ROL', 'ADMIN_ROL'],
            value: null,
            mostrarContraseña:false,
            password:""
        }
    },
    methods:{
      registrarse(){
        let header = {headers:{"token" : this.$store.state.token}};
        axios.post("usuario",header)
        .then(response =>{
          console.log(response);
          this.ventas = response.data.usuario
        })
        .catch((error) =>{
          console.log(error.response);
        })
      },
      reset(){
        this.rol='null',
        this.name=''
        this.email=''
        this.password=''
      }
      
    }
}
</script>