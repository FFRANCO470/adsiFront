<template>
  <v-app>
    <v-container fluid>
      <template>
        <v-data-table class="ancho-tabla elevation-15"  :headers="columnas" :items="usuarios" :search="search" >
          <template v-slot:top>
            <v-toolbar  flat >
              <v-toolbar-title>Usuarios</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-text-field  v-model="search" append-icon="mdi-magnify" label="Buscar por nombre, email o rol" single-line hide-details ></v-text-field>
              <v-divider  class="mx-4"  inset  vertical  ></v-divider>
              <v-spacer></v-spacer>
              <v-dialog  v-model="dialog" max-width="700px"  >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn depressed dark  class="mb-2"  v-bind="attrs" @click="nuevo()" >Añadir </v-btn>
                  <v-icon medium class="mr-4"  @click="crearPDF()"> mdi-download</v-icon>
                </template>
                <v-card>
                  <v-card-title><span class="text-h5">Usuarios</span></v-card-title>
                  <v-form v-model="valid">
                    <v-col><v-autocomplete v-model="editedItem.rol"  :items="items"  dense  filled label="Seleccione Rol" ></v-autocomplete></v-col>
                    <v-col><v-text-field  v-model="editedItem.nombre"   :counter="50" :rules="rulesName" label="Nombre" required   prepend-icon="mdi-account-circle"  ></v-text-field></v-col>
                    <v-col><v-text-field v-model="editedItem.email" label="E-mail" :counter="50" :rules="rulesEmail" required  prepend-icon="mdi-email"  ></v-text-field></v-col>
                    <v-col><v-text-field v-model="editedItem.password"  label="Contraseña" prepend-icon="mdi-lock" :counter="50" :rules="rulesPass"
                       :type=" mostrarContraseña ? 'text' : 'password'"
                        :append-icon="mostrarContraseña ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="mostrarContraseña =! mostrarContraseña"/></v-col>
                
                    <v-card-actions>
                      <v-col><v-btn color="blue darken-1" text @click="guardar()" >Guardar</v-btn></v-col>
                      <v-col><v-btn color="blue darken-1" text @click="reset"> Limpiar</v-btn></v-col>
                      <v-col><v-btn color="red darken-1" text @click="dialog=false"> Cancelar</v-btn></v-col>
                    </v-card-actions>
                  </v-form>
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

          <!--activar desactivar editar-->
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon  small  class="mr-2"  @click="editar(item)" >  mdi-pencil</v-icon>
            
            <template v-if="item._id != $store.state.idUser">
              <template v-if="item.estado">
                <v-icon  small class="mr-2" @click="activarDesactivarItem(2,item)" > mdi-check</v-icon>
              </template>
              <template v-else>
                <v-icon  small  @click="activarDesactivarItem(1,item)" >  mdi-block-helper </v-icon>
              </template>
            </template>


          </template>


        </v-data-table>
      </template>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
  export default {
    data: () => ({   
      items: ['ALMACENISTA_ROL', 'VENDEDOR_ROL', 'ADMIN_ROL'],
      value: null,
      mostrarContraseña:false,
      valid: false,
      drawer:false,
      search: '',
      dialog: false,
      //id:'',
      bd: 0,
      msgError:'',
      rulesName: [
        value => !!value || 'Required.',
        value => (value && value.length <= 50) || 'Max 50 caracteres',
      ],
      rulesEmail: [
        value => !!value || 'Required.',
        value => (value && value.length <= 50) || 'Max 50 caracteres',
      ],
      rulesPass: [
        value => !!value || 'Required.',
        value => (value && value.length <= 50) || 'Max 50 caracteres',
      ],
      columnas: [
        { text: 'Nombre', value: 'nombre' , class:'teal accent-4 white--text'},
        { text: 'Email', value: 'email' , class:'teal accent-4 white--text'},
        { text: 'Rol', value: 'rol', class:'teal accent-4 white--text' },
        { text: 'Estado', value: 'estado', class:'teal accent-4 white--text' },
        { text: 'Actions', value: 'actions' , class:'teal accent-4 white--text',width:'10%', sortable: false }
      ],
      usuarios: [{ nombre:'',  email:'', estado:'', password:'', rol:''}],
      editedItem: { nombre:'', email:'',estado:'', password:'',rol:'' },
    }),//data

    created(){
      this.obtenerUsuarios();
    },

    methods: {
      //msg alerta
      msjcompra:function(tata){
        Swal.fire({
          position: 'top',
          icon: 'error',
          title: tata,
          showConfirmButton: false,
          timer: 3000})
      },
      //traer usuarios
      obtenerUsuarios(){
        let header = {headers:{"token" : this.$store.state.token}};
        axios.get("usuario",header)
        .then(response =>{
          console.log(response.data);
          this.usuarios = response.data.usuarios
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
      },//obtenerUsuarios
      nuevo(){
        this.reset();
        this.dialog=true;
        this.bd=0;
      },
      //limpiar formulario
      reset(){
        this.editedItem.rol='',
        this.editedItem.nombre=''
        this.editedItem.email=''
        this.editedItem.password=''
      },
      //variables a editar
      editar(item){
        console.log(item);
        this.bd = 1;
        this.id= item._id;
        this.editedItem.nombre=item.nombre;
        this.editedItem.email=item.email
        this.editedItem.rol=item.rol
        this.dialog=true;
      },
      //almacenar o editar
      guardar(){
        if (this.bd == 0 ){
          console.log('estoy guardando'+this.bd);
          let header = {headers:{"token" : this.$store.state.token}};
          const me = this;
          if(this.editedItem.nombre.trim()==='' || this.editedItem.email.trim()==='' || this.editedItem.rol.trim()==='' || this.editedItem.password.trim()==='' ){
            this.msjcompra("Nombre, email, rol y contraseña son campos obligatorios");
          }else if(this.editedItem.nombre.length>50 || this.editedItem.email.length>50 || this.editedItem.rol.length>50 || this.editedItem.password.length>50){
            this.msjcompra("Un campo supero en numero maximo de caracteres");
          }else{
            axios.post('usuario',{
            nombre:this.editedItem.nombre,
            email:this.editedItem.email,
            rol:this.editedItem.rol,
            password:this.editedItem.password
            },
            header
            )
            .then((response)=>{
              console.log(response);
              me.obtenerUsuarios(),
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
          
        }else{
          console.log('estoy enviando'+this.bd);
          let header = {headers:{"token" : this.$store.state.token}};
          const me = this;
          axios.put(`usuario/${this.id}`,{
            nombre:this.editedItem.nombre,
            email:this.editedItem.email,
            rol:this.editedItem.rol,
            password:this.editedItem.password
            },
            header
            )
            .then((response)=>{
              console.log(response);
              me.obtenerUsuarios(),
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
      //activar o desactivar
      activarDesactivarItem (accion , item) {
        let id = item._id;
        console.log(accion);
        if(accion == 2){
          console.log(id);
          let me = this
          let header = {headers:{"token" : this.$store.state.token}};
          axios.put(`usuario/desactivar/${id}`, {}, header)
          .then(function(){
            me.obtenerUsuarios();
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
          axios.put(`usuario/activar/${id}`,  {},  header)
          .then(function(){
            me.obtenerUsuarios();
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
      crearPDF(){
        var rows=[];
        this.usuarios.map(function(x){
          rows.push({
            nombre: x.nombre,
            email: x.email,
            rol: x.rol,
            estado: x.estado
          });
        });
        var doc = new jsPDF();

        doc.autoTable({
          didDrawPage:function(){
            doc.text("Lista de Usuarios",14,10);
          },
          columnStyles:{
            0:{cellWidth:50},
            1:{cellWidth:60},
            2:{cellWidth:50},
            3:{cellWidth:'auto'}
          },
          headStyles: { fillColor: '#23323a', textColor: '#B9F6CA',  halign: 'left'  },
          body:rows,
          columns :[
          {title:"Nombre",dataKey:"nombre"},
          {title:"E-mail",dataKey:"email"},
          {title:"Rol",dataKey:"rol"},
          {title:"Estado",dataKey:"estado"},
          ]
        });
        doc.save("Usuarios.pdf");
      }//crear pdf
    },//methods
  }//export defaul
</script>

<style>
  .ancho-tabla table{
    table-layout: fixed;
  }
</style>