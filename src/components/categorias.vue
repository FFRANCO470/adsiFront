<template>
  <v-app>
  <v-snackbar  v-model="mensajeError"  :timeout="timeout" >
  <!--  <v-alert type="error" v-if="mensajeError==true"  >{{msgError}} </v-alert>-->
  </v-snackbar>
    <v-container>
      <template>
        <v-data-table class="mx-auto mt-5 elevation-15" max-width="900" :headers="columnas" :items="categorias"  :search="search">
          <template v-slot:top>
            <v-toolbar  flat>

              <v-toolbar-title>Categorias</v-toolbar-title>

              <v-spacer></v-spacer>
              <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details  ></v-text-field>
              <v-divider class="mx-4"   inset vertical></v-divider>

              <v-spacer></v-spacer>
              <v-dialog v-model="dialog"  max-width="500px"  >

                <template v-slot:activator="{ on, attrs }">
                  <v-btn  color="primary"  dark class="mb-2" v-bind="attrs"  v-on="on" >   Añadir  </v-btn>
                  <v-icon  medium class="mr-4"   @click="crearPDF()" >  mdi-{{icons[3]}} </v-icon>
                </template>

                <v-card >
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

          <template v-slot:[`item.actions`]="{ item }">

            <v-icon   small  class="mr-2" @click="editar(item)" >  mdi-{{icons[0]}} </v-icon>

            <template v-if="item.estado">
              <v-icon small class="mr-2"  @click="activarDesactivarItem(2,item)"  > mdi-{{icons[1]}} </v-icon>
            </template>
            <template v-else>
              <v-icon  small  @click="activarDesactivarItem(1,item)" > mdi-{{icons[2]}} </v-icon>
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
      mensajeError:false,
      msgError:'',
      icons: ['pencil','check','block-helper','download'],
      drawer:false,
      search: '',
      timeout: 2000,

      bd:0,
      dialog: false,
      dialogDelete: false,

      rulesNombre: [
        value => !!value || 'Required.',
        value => (value && value.length <= 50) || 'Max 3 caracteres',
      ],
      rulesDescripcion:[
        value => (value && value.length <= 255) || 'Max 255 caracteres'
      ],

      columnas: [
        { text: 'Nombre', value: 'nombre' },
        { text: 'Descripcion', value: 'descripcion' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      
      editedIndex: -1,

      categorias: [{estado:'', nombre:'', descripcion:''}],

      editedItem: {  estado:'', nombre: '', descripcion: '' },

      defaultItem: {  estado:'', nombre: '', descripcion: '' },
    }),

    created(){
      this.obtenerCategorias();
    },

    methods: {
      msjcompra:function(tata){
        Swal.fire({
          position: 'top',
          icon: 'error',
          title: tata,
          showConfirmButton: false,
          //5000 son 5 seg
          timer: 2000})
      },
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
      },

      reset(){
        this.editedItem.nombre=''
        this.editedItem.descripcion=''
      },

      activarDesactivarItem (accion , item) {
        let id = item._id;
        console.log(accion);
        if(accion == 2){
          console.log(id);
          let me = this
          let header = {headers:{"token" : this.$store.state.token}};
          axios.put(`categoria/desactivar/${id}`,{estado:0}, header)
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
          console.log(id);
          let me = this
          let header = {headers:{"token" : this.$store.state.token}};
          axios.put(`categoria/activar/${id}`,{estado:1},header)
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
      },

      guardar(){
        if (this.bd == 0 ){
          console.log('estoy guardando'+this.bd);
          let header = {headers:{"token" : this.$store.state.token}};
          const me = this;
          axios.post('categoria',{ nombre:this.editedItem.nombre,descripcion:this.editedItem.descripcion},header)
            .then((response)=>{
              console.log(response);
              me.obtenerCategorias(),
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
        }else{
          console.log('estoy enviando'+this.bd);
          let header = {headers:{"token" : this.$store.state.token}};
          const me = this;
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
      },
      editar(item){
        console.log(item);
        this.bd = 1;
        this.id= item._id;
        this.editedItem.nombre=item.nombre;
        this.editedItem.descripcion=item.descripcion;
        this.dialog=true;
      },
      
      crearPDF(){
        var columns =[
          {title:"Nombre",dataKey:"nombre"},
          {title:"Descripcion",dataKey:"descripcion"},
          {title:"Estado",dataKey:"estado"},
        ];
        var rows=[];
        this.categorias.map(function(x){
          rows.push({
            nombre: x.nombre,
            descripcion: x.descripcion,
            estado: x.estado
          });
        });
        var doc = new jsPDF("p","pt");
        doc.autoTable(
          columns, 
          rows,{
          headerStyles: { fillColor: '#23323a', textColor: '#B9F6CA',  halign: 'left'  },
          margin:{top:60},
          addPageContent:function () { doc.text("Lista de Categorias",40,30); }
          }
        );
        doc.save("Categorias.pdf");
      }
    },
  }
</script>