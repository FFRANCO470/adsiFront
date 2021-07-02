<template>
  <v-app>
    <v-container fluid>
      <template>
        <v-data-table :headers="columnas" :items="personas" :search="search" sort-by="calories" >
          <template v-slot:top>
            <v-toolbar flat  >
              <v-toolbar-title>Proveedores</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-text-field   v-model="search"  append-icon="mdi-magnify"  label="Search"  single-line hide-details></v-text-field>
              <v-divider  class="mx-4" inset  vertical ></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px"  >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn  color="primary"  dark  class="mb-2"  v-bind="attrs"  v-on="on"  >  Añadir </v-btn>
                  <v-icon  medium  class="mr-4"  @click="crearPDF()" >  mdi-{{icons[3]}} </v-icon>
                </template>
                <v-card width="500" class="mx-auto mt-9">
                  <v-card-text>
                    <v-autocomplete   v-model="editedItem.tipoPersona"  :items="items"  dense filled label="Seleccione Tipo" ></v-autocomplete>
                    <v-text-field  v-model="editedItem.nombre" :counter="20"  label="Nombre"  required ></v-text-field>
                    <v-text-field  v-model="editedItem.tipoDocumento" label="Tipo de Documento" required  ></v-text-field>
                    <v-text-field  v-model="editedItem.numDocumento" label="Número de Documento"  required ></v-text-field>
                    <v-text-field  v-model="editedItem.direccion" label="Dirección" required ></v-text-field>
                    <v-text-field  v-model="editedItem.telefono"  label="Telefono" required  ></v-text-field>
                    <v-text-field  v-model="editedItem.email" label="Email"  required  ></v-text-field>
                    <v-btn color="success" class="mr-4"  @click="guardar"  > Guardar </v-btn>
                    <v-btn color="info" class="mr-4"  @click="reset">  Limpiar </v-btn>
                    <v-btn color="error" class="mr-4" @click="dialog=false"> Cancelar </v-btn>
                  </v-card-text>    
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon  small  class="mr-2"  @click="editar(item)" >  mdi-{{icons[0]}} </v-icon>
            <template v-if="item.estado">
              <v-icon  small class="mr-2" @click="activarDesactivarItem(2,item)" > mdi-{{icons[2]}} </v-icon>
            </template>
            <template v-else>
              <v-icon  small  @click="activarDesactivarItem(1,item)" >  mdi-{{icons[1]}} </v-icon>
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
  export default {
    data: () => ({      
      items: ['Proveedor', 'Cliente'],
      icons: ['pencil','check','block-helper','download'],
      drawer:false,
      search: '',
      bd:0,
      dialog: false,
      dialogDelete: false,
      columnas: [
        { text: 'Tipo', value: 'tipoPersona'},
        { text: 'Nombre', value: 'nombre' },
        { text: 'Tipo Documento', value: 'tipoDocumento' },
        { text: 'Número Documento', value: 'numDocumento' },
        { text: 'Dirección', value: 'direccion' },
        { text: 'Telefono', value: 'telefono' },
        { text: 'Email', value: 'email' },
        { text: 'Estado', value: 'estadoP' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      personas: [
        {
        tipoPersona:'',
        nombre:'',
        tipoDocumento:'',
        numDocumento:'',
        direccion:'',
        telefono:'',
        estadoP:'',
        email:''},  
      ],
      editedIndex: -1,
      editedItem: {
        tipoPersona:'', nombre:'', tipoDocumento:'', numDocumento:'',
        direccion:'', estadoP:'', telefono:'',  email:''
      },
      defaultItem: {
        tipoPersona:'', nombre:'', tipoDocumento:'', numDocumento:'',
        direccion:'',estadoP:'', telefono:'', email:''
      },
    }),
    created(){
      this.obtenerPersonas();
    //   this.cambioEstado();
    },
    methods: {
      cambioEstado(){
        if (this.estado == 1){
          this.personas.estadoP="Activo"
        }else{
          this.personas.estadoP="Inactivo"
        }
      },
      obtenerPersonas(){
        let header = {headers:{"token" : this.$store.state.token}};
        axios.get("persona/listProveedores",header)
        .then(response =>{
          console.log(response.data);
          this.personas = response.data.persona
        })
        .catch((error) =>{
          console.log(error.response);
        })
      },
       activarDesactivarItem (accion , item) {
        let id = item._id;
        console.log(accion);
        if(accion == 2){
          console.log(id);
          let me = this
          let header = {headers:{"token" : this.$store.state.token}};
          axios.put(`persona/desactivar/${id}`,
          {estado:0},
          header)
          .then(function(){
            me.obtenerPersonas();
          })
          .catch(function(error){
            console.log(error);
          });
        }else if (accion==1){
          console.log(id);
          let me = this
          let header = {headers:{"token" : this.$store.state.token}};
          axios.put(`persona/activar/${id}`,
          {estado:1},
          header)
          .then(function(){
            me.obtenerPersonas();
          })
          .catch(function(error){
            console.log(error);
          });
        }
      },
      guardar(){
        if (this.bd == 0 ){
          console.log('estoy guardando'+this.bd);
          let header = {headers:{"token" : this.$store.state.token}};
          const me = this;
          axios.post('persona',{
            nombre:this.editedItem.nombre,
            tipoPersona:this.editedItem.tipoPersona,
            tipoDocumento:this.editedItem.tipoDocumento,
            numDocumento:this.editedItem.nombre,
            direccion:this.editedItem.direccion,
            telefono:this.editedItem.telefono,
            email:this.editedItem.email,
            },
            header
            )
            .then((response)=>{
              console.log(response);
              me.obtenerPersonas(),
              this.limpiar
            })
            .catch((error)=>{
              console.log(error.response);
            })
        }else{
          console.log('estoy enviando'+this.bd);
          let header = {headers:{"token" : this.$store.state.token}};
          const me = this;
          axios.put(`persona/${this.id}`,{
            nombre:this.editedItem.nombre,
            tipoPersona:this.editedItem.tipoPersona,
            tipoDocumento:this.editedItem.tipoDocumento,
            numDocumento:this.editedItem.nombre,
            direccion:this.editedItem.direccion,
            telefono:this.editedItem.telefono,
            email:this.editedItem.email,
            },
            header
            )
            .then((response)=>{
              console.log(response);
              me.obtenerPersonas(),
              this.limpiar
            })
            .catch((error)=>{
              console.log(error.response);
            })
        }
      },
      editar(item){
        console.log(item);
        this.bd = 1;
        this.id= item._id;
        this.editedItem.nombre=item.nombre;
        this.editedItem.tipoPersona=item.tipoPersona
        this.editedItem.tipoDocumento=item.tipoDocumento
        this.editedItem.numDocumento=item.numDocumento
        this.editedItem.direccion=item.direccion
        this.editedItem.telefono=item.telefono
        this.editedItem.email=item.email
        this.dialog=true;
      },
      reset(){
        this.editedItem.nombre=''
        this.editedItem.tipoPersona='',
        this.editedItem.tipoDocumento=''
        this.editedItem.numDocumento=''
        this.editedItem.direccion=''
        this.editedItem.telefono=''
        this.editedItem.email=''
      },
      crearPDF(){
        var columns =[
          {tittle:"Tipo",dataKey:"tipo"},
          {tittle:"Nombre",dataKey:"nombre"},
          {tittle:"TipoDocumento",dataKey:"tipoDocumento"},
          {tittle:"NúmeroDocumento",dataKey:"numDocumento"},
          {tittle:"Direccion",dataKey:"direccion"},
          {tittle:"Telefono",dataKey:"telefono"},
          {tittle:"Estado",dataKey:"estado"},
          {tittle:"E-mail",dataKey:"email"},
        ];
        var rows=[];
        this.personas.map(function(x){
          rows.push({
            tipoPersona: x.tipoPersona,
            nombre: x.nombre,
            tipoDocumento: x.tipoDocumento,
            numDocumento: x.numDocumento,
            direccion: x.direccion,
            telefono: x.telefono,
            email: x.email,
            estado: x.estado
          });
        });
        var doc = new jsPDF("p","pt");
        doc.autoTable(columns, rows,{
          margin:{top:60},
          addPageContent:function(){
            doc.text("Lista de Personas",40,30);
          },
        });
        doc.save("Personas.pdf");
      }
    },
  }
</script>