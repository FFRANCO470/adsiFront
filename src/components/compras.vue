<template>
  <v-app>
     <v-container>
      <template>
  <v-data-table v-if="muestra == 0" class="mx-auto mt-5 elevation-15" max-width="900"
    :headers="columnas"
    :items="compras"
    :search="search"
    sort-by="calories"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Compras</v-toolbar-title>
        <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              @click="cambioPage()"
            >
              Añadir
            </v-btn>
            <v-icon
                medium
                class="mr-4"
                @click="crearPDF()"
              >
                 mdi-{{icons[3]}}
              </v-icon>
          </template>
         <v-card width="3000" class="mx-auto mt-5">
            <div>
            <h5 class="display-1 font-weight-medium">Nuevo Usuario</h5>
            </div>
        <v-form
            ref="form"
            lazy-validation
  >
      <v-col>
        <v-text-field
          v-model="editedItem.usuario"
          label="Usuario"
          outlined
          required>
          </v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="editedItem.persona"
          label="Persona"
          outlined
          required>
          </v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="editedItem.tipoComprobante"
          label="Tipo Comprobante"
          outlined
          required>
          </v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="editedItem.serieComprobante"
          label="Serie comprobante"
          outlined
          type="number"
          required>
          </v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="editedItem.numComprobante"
          label="Número de comprobante"
          outlined
          type="number"
          required>
          </v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="editedItem.impuesto"
          label="Impuesto"
          outlined
          type="number"
          required>
          </v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="editedItem.total"
          label="Total"
          outlined
          type="number"
          required>
          </v-text-field>
      </v-col>           
      <v-col>
        <h1>Detalles de la compra</h1>
      </v-col>
      <v-col>
        <v-text-field
          v-model="editedItem.id"
          label="ID"
          outlined
          required>
        </v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="editedItem.articulo"
          label="Articulo"
          outlined
          required>
        </v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="editedItem.cantidad"
          label="Cantidad"
          outlined
          type="number"
          required>
        </v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="editedItem.precio"
          label="Precio"
          prefix="$"
          outlined
          type="number"
          required>
        </v-text-field>
      </v-col>
        <v-card-actions>
        <v-btn color="success" class="mr-4" @click="guardar()" >Guardar</v-btn>
        <v-btn color="info" @click="reset"> Limpiar</v-btn>
        <v-btn color="error" @click="dialog=false"> Cancelar</v-btn>

    </v-card-actions>

  </v-form>
        </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="cambioPage(item)"
      >
        mdi-{{icons[4]}}
      </v-icon>
          <v-icon
        small
        class="mr-2"
        @click="editar(item)"
      >
        mdi-{{icons[0]}}
      </v-icon>
      <template v-if="item.estado">
      <v-icon
        small
        class="mr-2"
        @click="activarDesactivarItem(2,item)"
      >
        mdi-{{icons[2]}}
      </v-icon>
      </template>
      <template v-else>
      <v-icon
        small
        @click="activarDesactivarItem(1,item)"
      >
        mdi-{{icons[1]}}
      </v-icon>
      </template>
      </template>
    <!-- <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="initialize"
      >
        Reset
      </v-btn>
    </template> -->
  </v-data-table>
</template>
<template>
    <div v-if="muestra==1" class="container pa-4 white grid-list-sm">
      <div class="container fill-height fluid">
        <v-container>
          <v-row>
            <v-col cols="4">
          <v-autocomplete
            v-model="editedItem.tipoComprobante"
            :items="tipoC"
            dense
            label="Tipo Comprobante"
          ></v-autocomplete>
        </v-col>
        <v-col cols="4">
          <v-autocomplete
            v-model="editedItem.serieComprobante"
            :items="compras"
            dense
            label="Serie Comprobante"
          ></v-autocomplete>
        </v-col>
        <v-col cols="4">
          <v-autocomplete
            v-model="editedItem.numComprobante"
            :items="compras"
            dense
            label="Número Comprobante"
          ></v-autocomplete>
        </v-col>
          </v-row>
          <v-row>
            <v-col cols="8">
          <v-autocomplete
            v-model="editedItem.persona"
            :items="compras"
            dense
            label="Proveedor"
          ></v-autocomplete>
        </v-col>
        <v-col cols="4">
          <v-autocomplete
            v-model="editedItem.impuesto"
            :items="compras"
            dense
            label="Impuesto"
          ></v-autocomplete>
        </v-col>
          </v-row>
          <v-btn
              @click="cambiarPagina()"
              color="Error"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              Cancelar
            </v-btn>
        </v-container>                
      </div>
    </div>
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
      icons: ['pencil','check','block-helper','download','clipboard-outline'],
      drawer:false,
      search: '',
      muestra :0,
      bd:0,
      dialog: false,
      dialogDelete: false,
      columnas: [
        { text: 'Usuario', value: 'usuario.nombre' },
        { text: 'Cliente', value: 'persona.nombre' },
        { text: 'Tipo Comprobante', value: 'tipoComprobante' },
        { text: 'Serie Comprobante', value: 'serieComprobante' },
        { text: 'Número Comprobante', value: 'numComprobante' },
        { text: 'Impuesto', value: 'impuesto' },
        { text: 'Total', value: 'total' },
        { text: 'Fecha', value: 'createdAt' },
        { text: 'Acciones', value: 'actions', sortable: false }
      ],
      tipoC:[],
      serieC:[],
      numC:[],
      compras: [
        {
        usuario:'',
        persona:'',
        tipoComprobante:'',
        serieComprobante:'',
        numComprobante:'',
        impuesto:'',
        detalles:'',
        createdAt:'',
        total:''},  
      ],
      editedIndex: -1,
      editedItem: {
        usuario:'',
        detalles:'',
        persona:'',
        tipoComprobante:'',
        serieComprobante:'',
        numComprobante:'',
        impuesto:'',
        createdAt:'',
        total:'',
      },
      defaultItem: {
        usuario:'',
        detalles:'',
        persona:'',
        tipoComprobante:'',
        serieComprobante:'',
        numComprobante:'',
        impuesto:'',
        createdAt:'',
        total:''
      },
    }),
    created(){
      this.obtenerCompras();
      this.selectTipo();
    },
    methods: {
      selectTipo() {
      let me = this;
      let personaArray = [];
      let header = { headers: { "token": this.$store.state.token } };
      axios
        .get("persona", header)
        .then(function (response) {
          personaArray = response.data.persona;
          personaArray.map(function (x) {
            me.tipoC.push({ text: x.tipoComprobante, value: x._id });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
       obtenerPersonas(){
        let header = {headers:{"token" : this.$store.state.token}};
        axios.get("persona",header)
        .then(response =>{
          console.log(response.data);
          this.compras = response.data.persona
        })
        .catch((error) =>{
          console.log(error.response);
        })
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
        })
      },
      obtenerCompras(){
        let header = {headers:{"token" : this.$store.state.token}};
        axios.get("compra",header)
        .then(response =>{
          console.log(response.data);
          this.compras = response.data.compra
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
          axios.put(`compra/desactivar/${id}`,
          {estado:0},
          header)
          .then(function(){
            me.obtenerCompras();
          })
          .catch(function(error){
            console.log(error);
          });
        }else if (accion==1){
          console.log(id);
          let me = this
          let header = {headers:{"token" : this.$store.state.token}};
          axios.put(`compra/activar/${id}`,
          {estado:1},
          header)
          .then(function(){
            me.obtenerCompras();
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
          axios.post('compra',{
            usuario:this.editedItem.usuario,
            persona:this.editedItem.persona,
            tipoComprobante:this.editedItem.tipoComprobante,
            serieComprobante:this.editedItem.serieComprobante,
            numComprobante:this.editedItem.numComprobante,
            impuesto:this.editedItem.impuesto,
            total:this.editedItem.total,
            detalles:this.editedItem.detalles,
            },
            header
            )
            .then((response)=>{
              console.log(response);
              me.obtenerCompras(),
              this.limpiar
            })
            .catch((error)=>{
              console.log(error.response);
            })
        }else{
          console.log('estoy enviando'+this.bd);
          let header = {headers:{"token" : this.$store.state.token}};
          const me = this;
          axios.put(`compra/${this.id}`,{
            usuario:this.editedItem.usuario,
            persona:this.editedItem.persona,
            tipoComprobante:this.editedItem.tipoComprobante,
            serieComprobante:this.editedItem.serieComprobante,
            numComprobante:this.editedItem.numComprobante,
            impuesto:this.editedItem.impuesto,
            total:this.editedItem.total,
            detalles:this.editedItem.detalles,
            },
            header
            )
            .then((response)=>{
              console.log(response);
              me.obtenerCompras(),
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
        this.editedItem.usuario=item.usuario;
        this.editedItem.persona=item.persona
        this.editedItem.tipoComprobante=item.tipoComprobante
        this.editedItem.serieComprobante=item.serieComprobante
        this.editedItem.numComprobante=item.numComprobante
        this.editedItem.impuesto=item.impuesto  
        this.editedItem.total=item.total
        this.editedItem.detalles=item.detalles
        this.dialog=true;
      },
      reset(){
        this.editedItem.usuario='';
        this.editedItem.persona='';
        this.editedItem.tipoComprobante='';
        this.editedItem.serieComprobante='';
        this.editedItem.numComprobante='';
        this.editedItem.impuesto='';
        this.editedItem.total='';
        this.editedItem.detalles=''
      },
      crearPDF(){
        var columns =[
          {tittle:"Usuario",dataKey:"usuario"},
          {tittle:"Detalles",dataKey:"detalles"},
          {tittle:"Persona",dataKey:"persona"},
          {tittle:"TipoComprobante",dataKey:"tipoComprobante"},
          {tittle:"SerieComprobante",dataKey:"serieComprobante"},
          {tittle:"NúmeroComprobante",dataKey:"numComprobante"},
          {tittle:"Impusto",dataKey:"impuesto"},
          {tittle:"CreatedAt",dataKey:"createdAt"},
          {tittle:"Total",dataKey:"total"},
        ];
        var rows=[];
        this.compras.map(function(x){
          rows.push({
            usuario: x.usuario,
            detalles: x.detalles,
            persona: x.persona,
            tipoComprobante: x.tipoComprobante,
            serieComprobante: x.serieComprobante,
            numComprobante: x.numComprobante,
            impuesto: x.impuesto,
            createdAt: x.createdAt,
            total: x.total
          });
        });
        var doc = new jsPDF("p","pt");
        doc.autoTable(columns, rows,{
          margin:{top:60},
          addPageContent:function(){
            doc.text("Lista de Compras",40,30);
          },
        });
        doc.save("Compras.pdf");
      },
      cambioPage(){
        this.muestra =1
      },
      cambiarPagina(){
        this.muestra=0
      }
    },
  }
</script>