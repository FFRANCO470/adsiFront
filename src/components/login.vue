<template>
    <v-app>
    <!--<v-alert type="error" v-if="mensajeError==true" >{{msgError}} </v-alert>-->
      <v-main>
          <v-form v-model="valid" width="500" class="form-registro mx-auto mt-9">
            <v-card-title class="titulo">Ingreso de Usuario</v-card-title>
            <v-card-text>
              <v-text-field v-model="email" id="caja"   class="form-input" label="Usuario" color="#1DE9B6"  required  :rules="nameRules" prepend-icon="mdi-account-circle"/>
              <v-text-field v-model="pass" id="caja" class="form-input"  label="Contraseña" color="#1DE9B6" required  :rules="passRules" :type=" mostrarContraseña ? 'text' : 'password'"
                      prepend-icon="mdi-lock"
                      :append-icon="mostrarContraseña ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="mostrarContraseña =! mostrarContraseña"/>
            </v-card-text>
            <!-- <div v-if="mensajeError==true" class="flex red--text"> {{msgError}} </div>-->    
            <v-divider></v-divider>
            <v-card-actions >
              <input  class="boton" type="button" @click="login()" value="Ingresar">                   
            </v-card-actions>
          </v-form >
      </v-main>
      
      <template>
        <v-footer dark padless >

          <v-card  class="flex" flat  tile >
            <v-card-title >
              <strong class="subheading"></strong>
              <v-spacer></v-spacer>
            </v-card-title>

            <v-card-text  class="py-2 white--text text-center">
              {{ new Date().getFullYear() }} — <strong>Proyecto</strong>
            </v-card-text>
          </v-card>

        </v-footer>
      </template>
    </v-app>
    
</template>
<script>

import axios from "axios"
import Swal from 'sweetalert2'

export default {
    data() {
        return {
            mostrarContraseña:false,
            email:"",
            pass:"",
            mensajeError:false,
            msgError:'',
            nameRules: [
                v => !!v || 'Email requerido',
                v => v.length <= 20 || 'Email supero los 20 caracteres',
            ],
            passRules: [
                v => !!v || 'Contraseña requerida',
                v => v.length <= 20 || 'Contraseña supera los 20 caracteres',
            ],
            valid: false,
        }
    },
    methods:{
      msjcompra:function(tata){
        Swal.fire({
          position: 'top',
          icon: 'error',
          title: tata,
          showConfirmButton: false,
          //5000 son 5 seg
          timer: 2000})
      },
      login(){
        if (!this.email || !this.pass) {
          this.msgError = 'Email / contraseña  oblicagorios';
          //this.mensajeError = true;
          this.msjcompra(this.msgError);
        }else{        
          axios.post("usuario/login",{email:this.email, password:this.pass})
          .then(response =>{
            this.$store.dispatch("setToken", response.data.token);
            this.$store.dispatch("setRol", response.data.usuario.rol);
            this.$router.push("/home");
            console.log('token' + response.data.token);
            return console.log(response);
          }).catch((error)=>{
            //this.mensajeError=true        
            if(!error.response.data.msg){
              console.log(error.response);
              this.msgError = error.response.data.errors[0].msg
              this.msjcompra(this.msgError);
            }else{
              this.msgError = error.response.data.msg
              console.log(error.response.data.msg);
              this.msjcompra(this.msgError);
            }
          })
        }
      },
       
    }
}
</script>

<style>

.form-registro{
    margin: auto;
    width: 400px;
    background: #23323a;
    /* pardding margen interno */
    padding: 30px;
    border-radius: 4px;
    font-family: 'calibri';
    color: #87909c;
    box-shadow: 7px 13px 37px #52515198;
}

.titulo{
  color:#64FFDA
}

.form-input .v-label{
    color: #64FFDA;
    font-size: 18px;
}
.form-input .placeholder{
    color: #64FFDA;
    font-size: 18px;
}

#caja{
  color:#64FFDA
}
.boton{
    width: 100%;
    background: #17A589;
    padding: 10px;
    margin: 16px 0px;
    border-radius: 12px;
    color: #FFFFFF;
}
</style>