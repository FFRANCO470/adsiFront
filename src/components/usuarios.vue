<template>
  <v-app>
    <v-container>
      <template>
        <v-data-table class="mx-auto mt-5 elevation-15" max-width="900"  :headers="columnas" :items="usuarios" :search="search" >
          <template v-slot:top>
            <v-toolbar  flat >
              <v-toolbar-title>Usuarios</v-toolbar-title>

              <v-spacer></v-spacer>
              <v-text-field  v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details ></v-text-field>
              <v-divider  class="mx-4"  inset  vertical  ></v-divider>

              <v-spacer></v-spacer>

              <v-dialog  v-model="dialog" max-width="700px"  >

                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary"  dark  class="mb-2"  v-bind="attrs" v-on="on">Añadir </v-btn>
                  <v-icon medium class="mr-4"  @click="crearPDF()"> mdi-{{icons[3]}} </v-icon>
                </template>

                <v-card>
                  <v-card-title><span class="text-h5">Usuarios</span></v-card-title>
        
                  <v-form ref="form" lazy-validation >
        
                    <v-col>
                      <v-autocomplete v-model="editedItem.rol"  :items="items"  dense  filled label="Seleccione Rol" ></v-autocomplete>
                    </v-col>

                    <v-col >
                      <v-text-field  v-model="editedItem.nombre"   :counter="50" :rules="rulesName" label="Nombre" required   prepend-icon="mdi-account-circle"  ></v-text-field>
                    </v-col>

                    <v-col >
                      <v-text-field v-model="editedItem.email" label="E-mail" :counter="50" :rules="rulesEmail" required  prepend-icon="mdi-email"  ></v-text-field>
                    </v-col>

                    <v-col>
                      <v-text-field v-model="editedItem.password"  label="Contraseña" prepend-icon="mdi-lock" :counter="50" :rules="rulesPass"
                       :type=" mostrarContraseña ? 'text' : 'password'"
                        :append-icon="mostrarContraseña ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="mostrarContraseña =! mostrarContraseña"/>
                    </v-col>

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

          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2"  @click="editar(item)" >  mdi-{{icons[0]}} </v-icon>
            <template v-if="item.estado">
              <v-icon   small  class="mr-2"  @click="activarDesactivarItem(2,item)"  > mdi-{{icons[1]}} </v-icon>
            </template>
            <template v-else>
              <v-icon  small  @click="activarDesactivarItem(1,item)" > mdi-{{icons[2]}}</v-icon>
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
      icons: ['pencil','check','block-helper','download'],
      value: null,
      mostrarContraseña:false,
      
      drawer:false,
      search: '',
      dialog: false,
      dialogDelete: false,

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

      id:'',
      bd: 0,
      columnas: [
        { text: 'Nombre', value: 'nombre' },
        { text: 'Email', value: 'email' },
        { text: 'Rol', value: 'rol' },
        { text: 'Estado', value: 'estado' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      usuarios: [{ nombre:'',  email:'', estado:'', password:'', rol:''}],

      editedIndex: -1,

      editedItem: { nombre:'', email:'',estado:'', password:'',rol:'' },

      defaultItem: { nombre:'',  email:'', estado:'', password:'', rol:'' },

      msgError:'',
    }),

    created(){
      this.obtenerUsuarios();
    },

    methods: {
      msjcompra:function(tata){
        Swal.fire({
          position: 'top',
          icon: 'error',
          title: tata,
          showConfirmButton: false,
          timer: 2000})
      },

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
      },
      activarDesactivarItem (accion , item) {
        let id = item._id;
        console.log(accion);
        if(accion == 2){
          console.log(id);
          let me = this
          let header = {headers:{"token" : this.$store.state.token}};
          axios.put(`usuario/desactivar/${id}`, {estado:0}, header)
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
          axios.put(`usuario/activar/${id}`,  {estado:1},  header)
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
      },
      guardar(){
        if (this.bd == 0 ){
          console.log('estoy guardando'+this.bd);
          let header = {headers:{"token" : this.$store.state.token}};
          const me = this;
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
              this.limpiar
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
              this.limpiar
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
      },
      editar(item){
        console.log(item);
        this.bd = 1;
        this.id= item._id;
        this.editedItem.nombre=item.nombre;
        this.editedItem.email=item.email
        this.editedItem.rol=item.rol
        this.dialog=true;
      },
      reset(){
        this.editedItem.rol='null',
        this.editedItem.nombre=''
        this.editedItem.email=''
        this.editedItem.password=''
      },

      crearPDF(){
        var columns =[
          {title:"Nombre",dataKey:"nombre"},
          {title:"E-mail",dataKey:"email"},
          {title:"Rol",dataKey:"rol"},
          {title:"Estado",dataKey:"estado"},
        ];
        var rows=[];
        this.usuarios.map(function(x){
          rows.push({
            nombre: x.nombre,
            email: x.email,
            rol: x.rol,
            estado: x.estado
          });
        });
        var doc = new jsPDF("p","pt");
        doc.autoTable(columns, rows,{
          headerStyles: { fillColor: '#23323a', textColor: '#B9F6CA',  halign: 'left'  },
          margin:{top:60},
          addPageContent:function(){
            doc.text("Lista de Usuarios",40,30);
          },
        });
        doc.save("Usuarios.pdf");
      }
    },
  }
</script>