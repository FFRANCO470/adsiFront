<template>
  <v-app>
    <v-container fluid>
      <template>
        <!--tabla de categorias-->
        <v-data-table   class="ancho-tabla elevation-15 "  :headers="columnas" :items="categorias"  :search="search">
          <template v-slot:top>
            <v-toolbar  flat>
              <v-toolbar-title>Categorias</v-toolbar-title>
              <!--barra para buscar-->
              <v-spacer></v-spacer>
              <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar por nombre o descripción" single-line hide-details  ></v-text-field>
              <v-divider class="mx-4"   inset vertical></v-divider>
              <!--Botones descargar agregar-->
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog"  max-width="500px"  >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn  depressed dark class="mb-2" v-bind="attrs"  @click="nuevo" >   Añadir  </v-btn>
                  <v-btn  depressed dark class="mb-2" style="margin-right:10px" v-bind="attrs"   @click="crearPDF()" >   
                    Descargar PDF <v-icon  medium class="mr-4" >mdi-download </v-icon> 
                  </v-btn>
                  
                </template>
                <!--Formuario para almacenar o editar-->
                <v-card >
                <v-card-title><span class="text-h5">Categorias</span></v-card-title>
                  <v-card-text>
                    <v-text-field  v-model="editedItem.nombre" :counter="50" label="Nombre" :rules="rulesNombre" required ></v-text-field>
                    <v-text-field  v-model="editedItem.descripcion" :counter="255" label="Descripcion" :rules="rulesDescripcion" ></v-text-field>
                    <v-btn  color="blue darken-1" text class="mr-4" @click="guardar" > Guardar </v-btn>
                    <v-btn  color="blue darken-1" text class="mr-4" @click="reset"> Limpiar </v-btn>
                    <v-btn  color="red darken-1" text class="mr-4" @click="dialog=false"> Cancelar </v-btn>
                  </v-card-text>    
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          

          <!--estado-->
          <template v-slot:[`item.estado`]="{ item }">
            <div v-if="item.estado">
              <span class="black--text">Activo</span>
            </div>
            <div v-else>
              <span class="red--text">Inactivo</span>
            </div>
          </template>

          <!--editar activar desactibar-->
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon   small  class="mr-2" @click="editar(item)" >mdi-pencil</v-icon>
            <template v-if="item.estado">
              <v-icon small class="mr-2"  @click="activarDesactivarItem(2,item)"  >mdi-check</v-icon>
            </template>
            <template v-else>
              <v-icon  small  @click="activarDesactivarItem(1,item)" > mdi-block-helper </v-icon>
            </template>
          </template>
        </v-data-table>
      </template>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import Swal from 'sweetalert2'
  export default {
    data: () => ({      
      drawer:false,
      dialog:false,
      msgError:'',
      search: '',
      bd:0,//agregar o editar
      rulesNombre: [
        value => !!value || 'Required.',
        value => (value && value.length <= 50) || 'Max 3 caracteres',
      ],
      rulesDescripcion:[
        value => (value && value.length <= 255) || 'Max 255 caracteres'
      ],
      columnas: [
        { text: 'Nombre', value: 'nombre'  , class:'teal accent-4 white--text'},
        { text: 'Descripcion', value: 'descripcion', class:'teal accent-4 white--text' },
        { text: 'Estado', value: 'estado', class:'teal accent-4 white--text' },
        { text: 'Actions', value: 'actions' , class:'teal accent-4 white--text',width:'10%',sortable: false }
      ],
      categorias: [{estado:'', nombre:'', descripcion:''}],//columnas de tablas
      editedItem: {nombre: '', descripcion: '' },//objeto para enviar o editar
    }),//data

    created(){
      this.obtenerCategorias();
    },

    methods: {
      //msg de alerta
      msjcompra:function(tata){
        Swal.fire({
          position: 'top',
          icon: 'error',
          title: tata,
          showConfirmButton: false,
          //5000 son 5 seg
          timer: 3000})
      },
      //Traer todas las categorias
      obtenerCategorias(){
        let header = {headers:{"token" : this.$store.state.token}};
        axios.get("categoria",header)
        .then(response =>{
          console.log(response);
          this.categorias = response.data.categoria
        })
        .catch((error) =>{
          console.log(error);
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
          //window.setInterval(() => {this.mensajeError = false; console.log("hide alert after 3 seconds");}, 3000) 
        })
      },//obtenerCategorias
      //Limpiar el formulario despues de enviar o editar
      reset(){
        this.editedItem.nombre=''
        this.editedItem.descripcion=''
      },
      nuevo(){
        this.reset()
        this.dialog=true;
        this.bd=0;
      },
      //para editar la categoria
      editar(item){
        console.log(item);
        this.bd = 1;
        this.id= item._id;
        this.editedItem.nombre=item.nombre;
        this.editedItem.descripcion=item.descripcion;
        this.dialog=true;
      },//editar
      //para almacenar o editar la categoria
      guardar(){
        if (this.bd == 0 ){
          console.log('estoy guardando'+this.bd+'almacenar');
          let header = {headers:{"token" : this.$store.state.token}};
          const me = this;
          if(this.editedItem.nombre.trim()=='' || this.editedItem.descripcion.trim()=='' ){
            this.msgError = 'Nombre y descripcion obligatorios'
            this.msjcompra(this.msgError);
          }else if(this.editedItem.nombre.length>50 || this.editedItem.descripcion.length>255){
            this.msgError = 'Nombre y descripcion han superado el limite max de caracteres'
            this.msjcompra(this.msgError);
          }else{
            axios.post('categoria',{ nombre:this.editedItem.nombre,descripcion:this.editedItem.descripcion},header)
              .then((response)=>{
                console.log(response);
                me.obtenerCategorias(),
                me.reset();
                this.dialog=false;
              })
              .catch((error)=>{
                console.log(error.response);
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
          
        }else{
          console.log('estoy enviando'+this.bd+'editar');
          let header = {headers:{"token" : this.$store.state.token}};
          const me = this;
          if(this.editedItem.nombre.trim()=='' || this.editedItem.descripcion.trim()=='' ){
            this.msgError = 'Nombre y descripcion obligatorios'
            this.msjcompra(this.msgError);
          }else if(this.editedItem.nombre.length>50 || this.editedItem.descripcion.length>255){
            this.msgError = 'Nombre y descripcion han superado el limite max de caracteres'
            this.msjcompra(this.msgError);
          }else{
            axios.put(`categoria/${this.id}`,{ nombre:this.editedItem.nombre, descripcion:this.editedItem.descripcion }, header )
              .then((response)=>{
                console.log(response);
                me.obtenerCategorias(),
                this.dialog=false;
              })
              .catch((error)=>{
                console.log(error.response);
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
        }
      },//guardar
      //activar o desactivar
      activarDesactivarItem (accion , item) {
        let id = item._id;
        if(accion == 2){
          console.log(id);
          let me = this
          let header = {headers:{"token" : this.$store.state.token}};
          axios.put(`categoria/desactivar/${id}`,{}  , header)
          .then(function(){
            me.obtenerCategorias();
          })
          .catch(function(error){
            console.log(error);
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
          });
        }else if (accion==1){
          let me = this
          let header = {headers:{"token" : this.$store.state.token}};
          axios.put(`categoria/activar/${id}`,{},header)
          .then(function(){
            me.obtenerCategorias();
          })
          .catch(function(error){
            console.log(error);
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
          });
        }
      },//activarDesactivarItem
      //Crear pdf de todas las categorias
      crearPDF(){
        var rows=[];
        this.categorias.map(function(x){
          rows.push({
            nombre: x.nombre,
            descripcion: x.descripcion,
            estado: x.estado
          });
        });
        var doc = new jsPDF();
        doc.autoTable({
          didDrawPage:function(){
            doc.text("Lista de Categorias",14,10);
          },
          columnStyles: {
            0: {cellWidth: 50},
            1: {cellWidth: 'auto'},
            2: {cellWidth: 17},
          },
          headStyles: { fillColor: '#23323a', textColor: '#B9F6CA',  halign: 'left'  },
          body:rows,
          columns:[
            {title:"Nombre",dataKey:"nombre"},
            {title:"Descripcion",dataKey:"descripcion"},
            {title:"Estado",dataKey:"estado"},
          ],
        });
        doc.save("Categorias.pdf");
      }//crearPDF
    },//methods
  }
</script>
<style>
  .ancho-tabla table{
    table-layout: fixed;
  }
</style>