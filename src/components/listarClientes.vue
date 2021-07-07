<template>
  <v-app>
    <v-container fluid>
      <template>
        <v-data-table  class="ancho-tabla elevation-15 " :headers="columnas" :items="personas" :search="search">
          <template v-slot:top>
            <!--parte arriba tabla-->
            <v-toolbar flat  >
              <v-toolbar-title>Clientes</v-toolbar-title>
              <!--buscar-->
              <v-spacer></v-spacer>
              <v-text-field   v-model="search"  append-icon="mdi-magnify"  label="Buscar"  single-line hide-details></v-text-field>
              <v-divider  class="mx-4" inset  vertical ></v-divider>
              
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px"  >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn  depressed dark  class="mb-2"  v-bind="attrs"  v-on="on"  >  Añadir </v-btn>
                  <v-icon  medium  class="mr-4"  @click="crearPDF()" >  mdi-download </v-icon>
                </template>
                <!--formulario-->
                <v-card >
                <v-card-title><span class="text-h5">Clietnes</span></v-card-title>
                  <v-card-text>
                    <v-form  v-model="valid">
                      <v-text-field  v-model="editedItem.nombre" :counter="50" :rules="rulesNombre" label="Nombre*"  required ></v-text-field>
                      <v-text-field  v-model="editedItem.tipoDocumento" :counter="20" :rules="rulesTipoDocumento" label="Tipo de Documento"   ></v-text-field>
                      <v-text-field  v-model="editedItem.numDocumento" :counter="20" :rules="rulesNumDocumento" label="Número de Documento"   ></v-text-field>
                      <v-text-field  v-model="editedItem.direccion" :counter="70" :rules="rulesDireccion"  label="Dirección"  ></v-text-field>
                      <v-text-field  v-model="editedItem.telefono"  :counter="15" :rules="rulesTelefono"  label="Telefono"   ></v-text-field>
                      <v-text-field  v-model="editedItem.email" :counter="50" :rules="rulesEmail" label="Email*"  required  ></v-text-field>
                      <v-btn color="blue darken-1" text class="mr-4"  @click="guardar"  > Guardar </v-btn>
                      <v-btn color="blue darken-1" text class="mr-4"  @click="reset">  Limpiar </v-btn>
                      <v-btn color="red darken-1" text class="mr-4" @click="dialog=false"> Cancelar </v-btn>
                    </v-form >
                  </v-card-text>    
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <!--activar desactivar editar-->
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon  small  class="mr-2"  @click="editar(item)" >  mdi-pencil</v-icon>
            <template v-if="item.estado">
              <v-icon  small class="mr-2" @click="activarDesactivarItem(2,item)" > mdi-check</v-icon>
            </template>
            <template v-else>
              <v-icon  small  @click="activarDesactivarItem(1,item)" >  mdi-block-helper </v-icon>
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
      search: '',
      valid: false,
      bd:0,
      dialog: false,
      rulesNombre: [
        value => !!value || 'Required.',
        value => (value && value.length <= 50) || 'Max 50 caracteres',
      ],
      rulesEmail: [
        value => !!value || 'Required.',
        value => (value && value.length <= 50) || 'Max 50 caracteres',
      ],
      rulesTipoDocumento: [value => ( value.length <= 20) || 'Max 20 caracteres' ],
      rulesNumDocumento: [value => (value.length <= 20) || 'Max 20 caracteres' ],
      rulesDireccion: [value => ( value.length <= 70) || 'Max 70 caracteres' ],
      rulesTelefono: [value => (value.length <= 15) || 'Max 15 caracteres' ],
      columnas: [
        { text: 'Nombre', value: 'nombre', class:'teal accent-4 white--text' },
        { text: 'Tipo Documento', value: 'tipoDocumento' , class:'teal accent-4 white--text'},
        { text: 'Número Documento', value: 'numDocumento', class:'teal accent-4 white--text' },
        { text: 'Dirección', value: 'direccion' , class:'teal accent-4 white--text'},
        { text: 'Telefono', value: 'telefono', class:'teal accent-4 white--text',width:'10%' ,sortable: false },
        { text: 'Email', value: 'email', class:'teal accent-4 white--text' },
        { text: 'Actions', value: 'actions' , class:'teal accent-4 white--text',width:'10%',sortable: false }
      ],
      personas: [
        {
          tipoPersona:'',  nombre:'',  tipoDocumento:'', numDocumento:'',
          direccion:'',  telefono:'', estado:'',  email:''
        },  
      ],
      editedItem: {
        tipoPersona:'', nombre:'', tipoDocumento:'', numDocumento:'',
        direccion:'', estado:'', telefono:'',  email:''
      }
    }),//data
    created(){
      this.obtenerPersonas();
    },
    methods: {
      //msg alerta
      msjcompra:function(tata){
        Swal.fire({
          position: 'top',
          icon: 'error',
          title: tata,
          showConfirmButton: false,
          timer: 2000})
      },
      //traerse los clientes
      obtenerPersonas(){
        let header = {headers:{"token" : this.$store.state.token}};
        axios.get("persona/listClientes",header)
          .then(response =>{
            console.log(response.data);
            this.personas = response.data.persona
          })
          .catch((error) =>{
            console.log(error.response);
            if(!error.response.data.msg){
              this.msgError = error.response.data.errors[0].msg;
              this.msjcompra(this.msgError);
            }else{
              this.msgError =error.response.data.msg;
              this.msjcompra(this.msgError);
            }
          })
      },//obtenerPersonas
      //limpiar formulario despues de editar o agregar
      reset(){
        this.editedItem.nombre=''
        this.editedItem.tipoPersona='',
        this.editedItem.tipoDocumento=''
        this.editedItem.numDocumento=''
        this.editedItem.direccion=''
        this.editedItem.telefono=''
        this.editedItem.email=''
      },
      //Alistar variables para editar
      editar(item){
        console.log(item);
        this.bd = 1;
        this.id= item._id;
        this.editedItem.nombre=item.nombre;
        this.editedItem.tipoPersona='cliente'
        this.editedItem.tipoDocumento=item.tipoDocumento
        this.editedItem.numDocumento=item.numDocumento
        this.editedItem.direccion=item.direccion
        this.editedItem.telefono=item.telefono
        this.editedItem.email=item.email
        this.dialog=true;
      },
      //agregar o editar
      guardar(){
        if (this.bd == 0 ){
          console.log('estoy guardando'+this.bd+'ALMACENAR');
          let header = {headers:{"token" : this.$store.state.token}};
          const me = this;
          axios.post('persona',{
            nombre:this.editedItem.nombre,
            tipoPersona:'cliente',
            tipoDocumento:this.editedItem.tipoDocumento,
            numDocumento:this.editedItem.numDocumento,
            direccion:this.editedItem.direccion,
            telefono:this.editedItem.telefono,
            email:this.editedItem.email,
            },
            header
            )
            .then((response)=>{
              console.log(response);
              me.obtenerPersonas(),
              me.reset();
              this.dialog=false
            })
            .catch((error)=>{
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
        }else{
          console.log('estoy enviando'+this.bd+'EDITAR');
          let header = {headers:{"token" : this.$store.state.token}};
          const me = this;
          axios.put(`persona/${this.id}`,{
            nombre:this.editedItem.nombre,
            tipoPersona:'cliente',
            tipoDocumento:this.editedItem.tipoDocumento,
            numDocumento:this.editedItem.numDocumento,
            direccion:this.editedItem.direccion,
            telefono:this.editedItem.telefono,
            email:this.editedItem.email,
            },
            header
            )
            .then((response)=>{
              console.log(response);
              me.obtenerPersonas(),
              this.dialog=false
            })
            .catch((error)=>{
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
        }
      },//guardar
      //desactivar o activar
      activarDesactivarItem (accion , item) {
        let id = item._id;
        console.log(accion);
        if(accion == 2){
          console.log(id);
          let me = this
          let header = {headers:{"token" : this.$store.state.token}};
          axios.put(`persona/desactivar/${id}`,{}, header)
          .then(function(){
            me.obtenerPersonas();
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
          axios.put(`persona/activar/${id}`,  {},header)
          .then(function(){
            me.obtenerPersonas();
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
      //crear pdf
      crearPDF(){
        var rows=[];
        this.personas.map(function(x){
          rows.push({
            nombre: x.nombre,
            tipoDocumento: x.tipoDocumento,
            numDocumento: x.numDocumento,
            direccion: x.direccion,
            telefono: x.telefono,
            email: x.email,
            estado: x.estado
          });
        });
        var doc = new jsPDF();

        doc.autoTable({
          didDrawPage:function(){
            doc.text("Lista de Clientes",14,10);
          },
          columnStyles:{
            0:{cellWidth:25},
            1:{cellWidth:25},
            2:{cellWidth:25},
            3:{cellWidth:25},
            4:{cellWidth:25},
            5:{cellWidth:15},
            6:{cellWidth:'auto'}
          },
          headStyles: { fillColor: '#23323a', textColor: '#B9F6CA',  halign: 'left'  },
          body:rows,
          columns :[
          {title:"Nombre",dataKey:"nombre"},
          {title:"Tipo Documento",dataKey:"tipoDocumento"},
          {title:"Número Documento",dataKey:"numDocumento"},
          {title:"Direccion",dataKey:"direccion"},
          {title:"Telefono",dataKey:"telefono"},
          {title:"Estado",dataKey:"estado"},
          {title:"E-mail",dataKey:"email"},
          ]
        });
        doc.save("Clientes.pdf");
      }//crearPDF
    },//methods
  }//export defauld
</script>
<style>
  .ancho-tabla table{
    table-layout: fixed;
  }
</style>