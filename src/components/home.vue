<template>
    
    <div>

        

        <v-row>
            <v-col>
                <v-card style="margin-top:60px; margin-left:20%;width:250px; height:250px">
                    <img src="../assets/logo.png" style="margin-left:10px; margin-top:10px" alt="" contain  height="90%" width="90%">
                </v-card>
                
            </v-col>
            <v-col>

                <div class="form-group row texto" style="margin-top:150px;margin-left:-20%">
                     <label  class="col-form-label">BIENVENIDO: {{this.$store.state.name}}</label>
                </div>
            

            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <div class="form-group row texto" style="margin-top:150px;margin-left:20px">
                     <label  class="col-form-label">Total comprado: $ {{totalCompras}}</label>
                </div>
            </v-col>
            <v-col>
                <div class="form-group row texto" style="margin-top:150px;margin-left:0">
                     <label  class="col-form-label">Total vendido: $ {{totalVentas}}</label>
                </div>
            </v-col>
        </v-row>
    </div>
    
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            compras: [
                {
                usuario:'', persona:'',  tipoComprobante:'', serieComprobante:'',
                numComprobante:'', impuesto:0,total:0, detalles:'', createAt:'',
                }
            ],
            ventas: [
                {
                usuario:'', persona:'',  tipoComprobante:'', serieComprobante:'',
                numComprobante:'', impuesto:0,total:0, detalles:'', createAt:'',
                }
            ],
        }
    },
    created(){
      this.obtenerCompras();
      this.obtenerVenta();
    },
    methods:{
        obtenerCompras(){
            let header = {headers:{"token" : this.$store.state.token}};
            axios.get("compra",header)
            .then(response =>{
            console.log(response.data);
            this.compras = response.data.compra
            console.log(this.compras);
            })
            .catch((error) =>{
            console.log(error.response);
            if(!error.response.data.msg){
                console.log(error.response);
                this.msgError = error.response.data.errors[0].msg;
                this.msjcompra(this.msgError);
            }else{
                this.msgError = error.response.data.msg;
                console.log(error.response.data.msg);
                this.msgError =error.response.data.msg;
                this.msjcompra(this.msgError);
            }
            })
        },//obtenerVenta
        obtenerVenta(){
            let header = {headers:{"token" : this.$store.state.token}};
            axios.get("venta",header)
            .then(response =>{
            console.log(response.data);
            this.ventas = response.data.venta
            console.log(this.ventas);
            })
            .catch((error) =>{
            console.log(error.response);
            if(!error.response.data.msg){
                console.log(error.response);
                this.msgError = error.response.data.errors[0].msg;
                this.msjcompra(this.msgError);
            }else{
                this.msgError = error.response.data.msg;
                console.log(error.response.data.msg);
                this.msgError =error.response.data.msg;
                this.msjcompra(this.msgError);
            }
            })
        },//obtenerVenta
    },//metodos
    computed:{
      
      totalCompras(){
          return this.compras.reduce((suma,venta)=>{
            return suma + parseFloat(venta.total)
          },0)
      },
      totalVentas(){
          return this.ventas.reduce((suma,venta)=>{
            return suma + parseFloat(venta.total)
          },0)
      },
    }
}
</script>

<style scoped>
    .texto{
        font-family: 'calibri';
        color: #00000;
        font-size: 50px;
        text-align:left;
    }
</style>