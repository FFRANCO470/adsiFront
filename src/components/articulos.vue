<template>
  <v-app>
    <v-container fluid>
      <template>
        <v-data-table class="ancho-tabla elevation-15 "  :headers="columnas" :objetos="categorias"   :items="articulos" :search="search">
          <template v-slot:top>
            <!--parte superior de la tabla-->
            <v-toolbar  flat >
              <v-toolbar-title>Articulos</v-toolbar-title>
              <!--barra para buscar-->
              <v-text-field   v-model="search"   
                              append-icon="mdi-magnify" 
                              style="margin-left:50px;width:30%" 
                              label="Buscar por categoría, código o nombre"
                              single-line hide-details>
              </v-text-field>
              
              <v-divider  class="mx-4"  inset  vertical ></v-divider>
              <!--Botones descargar anadir-->
              <v-spacer></v-spacer>
              <v-dialog  v-model="dialog" width="700px" >
                <template v-slot:activator="{ on, attrs }">            
                  <v-btn  depressed dark class="mb-2"  v-bind="attrs" @click="nuevo()" > Añadir </v-btn>
                  <v-btn  depressed dark class="mb-2" style="margin-right:10px" v-bind="attrs"   @click="crearPDF()" >   
                    Descargar PDF <v-icon  medium class="mr-4" >mdi-download </v-icon> 
                  </v-btn>
                </template>
                <!--Formulario-->
                <v-card>
                  <v-card-title><span class="text-h5">Articulos</span></v-card-title>
                  <v-card-text>
                    <v-form  ref="form" lazy-validation >
                      <v-row > <v-col>  <v-select  v-model="editedItem.categoria"  :items="categorias" :rules="rulesCategoria"  label="Categoria" ></v-select>  </v-col> </v-row>
                      <v-row>
                        <v-col > <v-text-field  v-model="editedItem.codigo" :counter="64" label="Codigo" :rules="rulesCodigo" required  ></v-text-field>  </v-col>
                        <v-col > <v-text-field  v-model="editedItem.nombre"   :counter="50"  label="Nombre" :rules="rulesNombre" required ></v-text-field> </v-col>
                      </v-row>  
                      <v-row>  <v-col >   <v-text-field  v-model="editedItem.descripcion"  :counter="255" label="Descripción" :rules="rulesDescripcion"></v-text-field> </v-col>  </v-row>
                      <v-row>
                        <v-col > <v-text-field  type="number" min="0" v-model="editedItem.costo"  label="Costo"  required ></v-text-field> </v-col>
                        <v-col >  <v-text-field type="number"  min="0" v-model="editedItem.precio"  label="Precio"  required ></v-text-field> </v-col>
                        <v-col > <v-text-field type="number"  min="0" v-model="editedItem.stock"  label="stock"  required  ></v-text-field>  </v-col>
                      </v-row>
                      <v-card-actions>
                        <v-col ><v-btn color="blue darken-1" text class="mr-4" @click="guardar()" >Guardar</v-btn> </v-col >
                        <v-col > <v-btn color="blue darken-1" text @click="reset"> Limpiar</v-btn></v-col >
                        <v-col ><v-btn color="red darken-1" text @click="dialog=false"> Cancelar</v-btn> </v-col >
                      </v-card-actions>
                    </v-form>
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
          <!--botones para editar activar desactivar-->
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small  class="mr-2"  @click="editar(item)"  > mdi-pencil </v-icon>
            <template v-if="item.estado">
              <v-icon small  class="mr-2" @click="activarDesactivarItem(2,item)" > mdi-check </v-icon> 
            </template>
            <template v-else>
              <v-icon small  @click="activarDesactivarItem(1,item)"  > mdi-block-helper</v-icon>
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
      search: '',
      msgError:'',
      bd:0,
      dialog: false,
      rulesCategoria: [
        value => !!value || 'Required.',
      ],
      rulesCodigo: [
        value => !!value || 'Required.',
        value => (value && value.length <= 60) || 'Max 60 caracteres',
      ],
      rulesNombre: [
        value => !!value || 'Required.',
        value => (value && value.length <= 50) || 'Max 50 caracteres',
      ],
      rulesDescripcion:[ value => (value.length <= 255) || 'Max 255 caracteres' ],
      columnas: [
        { text: 'Categoria', value: 'categoria.nombre', class:'teal accent-4 white--text'},
        { text: 'Codigo', value: 'codigo' , class:'teal accent-4 white--text' },
        { text: 'Nombre', value: 'nombre', class:'teal accent-4 white--text' },
        { text: 'Descripcion', value: 'descripcion', class:'teal accent-4 white--text' ,width:'20%' },
        { text: 'Precio', value: 'precio',  class:'teal accent-4 white--text',width:'9%'},
        { text: 'Costo', value: 'costo' , class:'teal accent-4 white--text',width:'9%'},
        { text: 'stock', value: 'stock', class:'teal accent-4 white--text' ,width:'9%'},
        { text: 'Estado', value: 'estado', class:'teal accent-4 white--text'},
        { text: 'Actions', value: 'actions', class:'teal accent-4 white--text',width:'10%',sortable: false   }
      ],
      articulos: [ {  codigo:'',  precio:'', costo:'', stock:'',  nombre:'',  estado:'',  descripcion:''}],//filas de la tabla
      categorias: [ ],//lista desplegable de categorias
      editedItem: {  categoria:'', estado:'', precio:'',  costo:'',  codigo:'',  stock:'', nombre:'',   descripcion:'',},//agtegar o editar
    }),//data
    created(){
      this.obtenerArticulos();
      this.selectCategoria();
    },
    methods: {
      //msg de alerta
      msjcompra:function(tata){ Swal.fire({ position: 'top', icon: 'error', title: tata, showConfirmButton: false, timer: 2000})  },
      //traer articulos
      obtenerArticulos(){
        let header = {headers:{"token" : this.$store.state.token}};
        axios.get("articulo",header)
          .then(response =>{   
            console.log(response);  
            this.articulos = response.data.articulos
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
      },//obtenerArticulos
      nuevo(){
        this.reset()
        this.dialog=true;
        this.bd=0;
      },
      //traer categorias para colocarlas en la lista desplegable
      selectCategoria() {
        let me = this;
        let categoriaArray = [];
        let header = { headers: { "token": this.$store.state.token } };
        axios.get("categoria", header)
          .then(function (response) {
            categoriaArray = response.data.categoria;
            categoriaArray.map(function (x) {
              if(x.estado==1){
                me.categorias.push({ text: x.nombre, value: x._id });
              }
            });
            console.log(me.categorias);
          })
          .catch(function (error) {
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
      },//selectCategoria
      //activar o desactivar articulos
      activarDesactivarItem (accion , item) {
        let id = item._id;
        console.log(accion);
        if(accion == 2){
          console.log(id);
          let me = this;
          let header = {headers:{"token" : this.$store.state.token}};
          axios.put(`articulo/desactivar/${id}`,{estado:0}, header)
            .then(function(){
              me.obtenerArticulos();
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
          axios.put(`articulo/activar/${id}`, {estado:1}, header)
            .then(function(){
              me.obtenerArticulos();
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
      },//selectCategoria
      //limpiar formulario despues de agregar
      reset(){
        this.editedItem.categoria=''
        this.editedItem.codigo=''
        this.editedItem.nombre=''
        this.editedItem.precio=''
        this.editedItem.costo=''
        this.editedItem.stock=''
        this.editedItem.descripcion=''
      },
      //variables para enviar a almacenar o editar
      editar(item){
        console.log(item);
        this.bd = 1;
        this.id= item._id;
        this.editedItem.nombre=item.nombre;
        this.editedItem.precio=item.precio
        this.editedItem.costo=item.costo
        this.editedItem.descripcion=item.descripcion
        this.editedItem.codigo=item.codigo
        this.editedItem.stock=item.stock
        this.dialog=true;
      },
      //almacenar o editar
      guardar(){
        if (this.bd == 0 ){
          console.log('estoy guardando'+this.bd);
          let header = {headers:{"token" : this.$store.state.token}};
          const me = this;
          if(this.editedItem.categoria.trim()==='' || this.editedItem.codigo.trim()==='' || this.editedItem.nombre.trim()==='' ){
            this.msgError = "Categoria, Codigo y Nombre obligatorias"
            this.msjcompra(this.msgError);
          }else if (this.editedItem.codigo.length>60 ){
            this.msgError = "Codigo supero los 60 caracteres"
            this.msjcompra(this.msgError);
          }else if (this.editedItem.nombre.length>50 ){
            this.msgError = "Nombre supero los 50 caracteres"
            this.msjcompra(this.msgError);
          }else{
            axios.post('articulo',{
              categoria:this.editedItem.categoria,
              codigo:this.editedItem.codigo,
              nombre:this.editedItem.nombre,
              descripcion:this.editedItem.descripcion,
              precio:this.editedItem.precio,
              costo:this.editedItem.costo,
              stock:parseFloat(this.editedItem.stock)
              },
              header
              )
              .then((response)=>{
                console.log(response);
                me.obtenerArticulos();
                me.reset();
                this.dialog=false;
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
          axios.put(`articulo/${this.id}`,{
            categoria:this.editedItem.categoria,
            nombre:this.editedItem.nombre,
            precioventa:this.editedItem.precio,
            codigo:this.editedItem.codigo,
            stock:parseFloat(this.editedItem.stock),
            descripcion:this.editedItem.descripcion
            },
            header
            )
            .then((response)=>{
              console.log(response);
              me.obtenerArticulos(),
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
      //crear el pdf
      crearPDF(){
        var rows=[];
        this.articulos.map(function(x){
          rows.push({
            categoria: x.categoria.nombre,
            codigo: x.codigo,
            nombre: x.nombre,
            descripcion: x.descripcion,
            precio: x.precio,
            costo: x.costo,
            stock: x.stock,
            estado: x.estado
          });
        });
        var doc = new jsPDF();
        doc.autoTable({
          didDrawPage:function(){
            doc.text("Lista de Articulos",14,10);
          },
          columnStyles: {
            0: {cellWidth: 26},
            1: {cellWidth: 26},
            2: {cellWidth: 25},
            3: {cellWidth: 54},
            4: {cellWidth: 17},
            5: {cellWidth: 17},
            6: {cellWidth: 'auto'},
          },
          headStyles: { fillColor: '#23323a', textColor: '#B9F6CA',  halign: 'left'  },
          body: rows,
          columns :[
          {header:"Categoria",dataKey:"categoria"},
          {header:"Codigo",dataKey:"codigo"},
          {header:"Nombre",dataKey:"nombre"},
          {header:"Descripcion",dataKey:"descripcion"},
          {header:"Precio",dataKey:"precio"},
          {header:"stock",dataKey:"stock"},
          {header:"Estado",dataKey:"estado"},
          ],
        })
        doc.save("Articulos.pdf");
      }//crearPDF
    },//methods
  }//export default
</script>
<style>
  .ancho-tabla table{
    table-layout: fixed;
  }
</style>