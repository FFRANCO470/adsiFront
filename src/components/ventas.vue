<template>
  <v-app>
    <v-container fluid>
      <template>
        <v-data-table v-if="muestra == 0" class="ancho-tabla elevation-15" :headers="columnas" :items="compras" :search="search" >
          <template v-slot:top>
            <v-toolbar flat >
              <v-toolbar-title>Ventas</v-toolbar-title>
              
              <v-spacer></v-spacer>
              <v-text-field  v-model="search"  append-icon="mdi-magnify" label="Buscar" single-line  hide-details ></v-text-field>
              <v-divider  class="mx-4"   inset  vertical ></v-divider>
              
              <v-spacer></v-spacer>
                  <v-icon  medium   class="mr-4" @click="crearPDF()"  >mdi-download</v-icon>
                  <v-btn color="primary"  dark  class="mb-2"    @click="cambioPage(1,false)" >Añadir</v-btn>
                  
            </v-toolbar>
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <v-icon  small  class="mr-2" @click="cambioPage(2,item)" >mdi-clipboard-outline </v-icon>
            <template v-if="item.estado">
              <v-icon small class="mr-2"  @click="activarDesactivarItem(2,item)" >mdi-check</v-icon>
            </template>
            <template v-else>
              <v-icon  small  @click="activarDesactivarItem(1,item)"  >mdi-block-helper</v-icon>
            </template>
          </template>

        </v-data-table>
      </template>
      <template>
        <div v-if="muestra==1" class="container pa-4 white grid-list-sm">
          <div class="container fill-height fluid">
            <v-container>
              <v-row><v-btn   @click="cambioPage(0,false)"  color="Error"   dark  class="mb-2"> Cancelar</v-btn></v-row>
              <v-row>
                <v-col cols="4">
                  <v-autocomplete v-model="editedItem.tipoComprobante"  :items="tipoC" dense  label="Tipo Comprobante" ></v-autocomplete>
                </v-col>
                <v-col cols="4">
                  <v-autocomplete v-model="editedItem.serieComprobante" :items="compras" dense label="Serie Comprobante" ></v-autocomplete>
                </v-col>
                <v-col cols="4">
                  <v-autocomplete v-model="editedItem.numComprobante" :items="compras" dense label="Número Comprobante"  ></v-autocomplete>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="8">
                  <v-autocomplete  v-model="editedItem.persona" :items="compras" dense label="Proveedor"  ></v-autocomplete>
                </v-col>
                <v-col cols="4">
                  <v-autocomplete v-model="editedItem.impuesto" :items="compras"  dense label="Impuesto" ></v-autocomplete>
                </v-col>
              </v-row>
              
            </v-container>                
          </div>
        </div>
      </template>
      <template>
        <div v-if="muestra==2" class="container pa-4 white grid-list-sm">
          <v-container>
            <v-row>
              <v-btn   @click="cambioPage(0,false)"  color="Error"   dark  class="mb-2" >Volver</v-btn>
              <v-spacer></v-spacer>
              <v-icon  medium   class="mr-4" @click="crearPDFVenta()"  >mdi-download</v-icon>
            </v-row>
          </v-container>
          <template>
            <v-row>
              <div  style="margin: 30px 50px 10px 20px;"><span class="black--text">Fecha : {{ventaConDetalleFecha}}</span></div>
              <div style="margin: 30px 0 0 20px;"><span class="black--text">Estado : {{ventaConDetalleEstado}}</span></div>
            </v-row>
            <v-row>
              <div style="margin: 30px 0 0 20px;"><span class="black--text">Cliente : {{ventaConDetalleCliente.nombre}}</span></div>
            </v-row>
            <v-row>
              <div style="margin: 30px 0 0 20px; "><span class="black--text">Tipo Comprobante : {{ventaConDetalleTipoComp}}</span></div>
              <div style="margin: 30px 0 0 100px;"><span class="black--text">Serie : {{ventaConDetalleSerie}}</span></div>
              <div style="margin: 30px 0 0 100px;"><span class="black--text"># Comprobante : {{ventaConDetalleNumComp}}</span></div>
            </v-row>
            <v-row>
              <div style="margin: 30px 0 0 20px;"><span class="black--text">Impuesto : {{ventaConDetalleImpuesto}}</span></div>
              <div style="margin: 30px 0 0 100px;"><span class="black--text">Total : {{ventaConDetalleTotal}}</span></div>
            </v-row>
            <v-row>
              <v-col >
                <v-data-table class="ancho-tabla elevation-15 "  :headers="articulosVendidos"   :items="artiVendidos" >
                  <template v-slot:top>
                    <v-toolbar  flat >
                      <v-toolbar-title>Ventas</v-toolbar-title>
                    </v-toolbar>
                  </template>
                </v-data-table>
              </v-col >
            </v-row>
            <v-col >{{ventaConDetalleDetalles}}</v-col>

            
            
          </template>
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
      drawer:false,
      search: '',
      muestra :0,
      bd:0,
      ventaConDetalleFecha:'',
      ventaConDetalleEstado:'',
      ventaConDetalleCliente:'',
      ventaConDetalleTipoComp:'',
      ventaConDetalleSerie:'',
      ventaConDetalleNumComp:'',
      ventaConDetalleImpuesto:'',
      ventaConDetalleTotal:'',
      ventaConDetalleDetalles:[],
      dialogDelete: false,
      articulosVendidos:[
        { text: 'id', value: '_id',class:'teal accent-4 white--text' },
        { text: 'nombre', value: 'cantidad',class:'teal accent-4 white--text' },
        { text: 'cantidad', value: 'cantidad',class:'teal accent-4 white--text' },
        { text: 'precio', value: 'precio',class:'teal accent-4 white--text' },
      ],
      artiVendidos:[{_id:'',cantidad:'',precio:''}],
      columnas: [
        { text: 'Fecha', value: 'createAt',class:'teal accent-4 white--text' },
        { text: 'Usuario', value: 'usuario.nombre' ,class:'teal accent-4 white--text',width:'10%'},
        { text: 'Cliente', value: 'persona.nombre' ,class:'teal accent-4 white--text'},
        { text: 'Tipo Comprobante', value: 'tipoComprobante' ,class:'teal accent-4 white--text',width:'10%'},
        { text: 'Serie Comprobante', value: 'serieComprobante',class:'teal accent-4 white--text',width:'10%' },
        { text: 'Número Comprobante', value: 'numComprobante',class:'teal accent-4 white--text',width:'10%' },
        { text: 'Impuesto', value: 'impuesto' ,class:'teal accent-4 white--text',width:'10%'},
        { text: 'Total', value: 'total',class:'teal accent-4 white--text',width:'10%' },
        { text: 'Acciones', value: 'actions', sortable: false,class:'teal accent-4 white--text',width:'10%' }
      ],
      tipoC:[],
      serieC:[],
      numC:[],
      compras: [
        {
        usuario:'', persona:'',  tipoComprobante:'', serieComprobante:'',
        numComprobante:'', impuesto:'',total:'', detalles:'', createAt:'',
        }
      ],
      editedIndex: -1,
      editedItem:{
        usuario:'', persona:'',  tipoComprobante:'', serieComprobante:'',
        numComprobante:'', impuesto:'',total:'', detalles:'', createAt:'',
      },
      defaultItem: {
        usuario:'', persona:'',  tipoComprobante:'', serieComprobante:'',
        numComprobante:'', impuesto:'',total:'', detalles:'', createAt:'',
      },
    }),
    created(){
      this.obtenerVenta();
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
      obtenerVenta(){
        let header = {headers:{"token" : this.$store.state.token}};
        axios.get("venta",header)
        .then(response =>{
          console.log(response.data);
          this.compras = response.data.venta
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
          axios.put(`venta/desactivar/${id}`, {}, header)
            .then(function(){
              me.obtenerVenta();
            })
            .catch(function(error){
              console.log(error);
            });
        }else if (accion==1){
          console.log(id);
          let me = this
          let header = {headers:{"token" : this.$store.state.token}};
          axios.put(`venta/activar/${id}`,{},header)
            .then(function(){
              me.obtenerVenta();
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
              me.obtenerVenta(),
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
              me.obtenerVenta(),
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
          {tittle:"CreatedAt",dataKey:"createAt"},
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
            createAt: x.createAt,
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
      cambioPage(num,item){
        if(num==0){
          this.muestra=num;
        }else if(num==1){
          this.muestra=num;
        }else{
          this.muestra=num;
          
        this.traerVentaDetalle(item);
        }
      },
      traerVentaDetalle(item){
        let id = item._id;
        let header = {headers:{"token" : this.$store.state.token}};
        axios.get(`venta/${id}`,header)
        .then(response =>{
          console.log(response);
          this.ventaConDetalleFecha=response.data.venta.createAt
          this.ventaConDetalleEstado=response.data.venta.estado
          this.ventaConDetalleCliente=response.data.venta.persona
          this.ventaConDetalleTipoComp=response.data.venta.tipoComprobante
          this.ventaConDetalleSerie=response.data.venta.serieComprobante
          this.ventaConDetalleNumComp=response.data.venta.numComprobante
          this.ventaConDetalleImpuesto=response.data.venta.impuesto
          this.ventaConDetalleTotal=response.data.venta.total
          this.ventaConDetalleDetalles=response.data.venta.detalles
          this.artiVendidos=this.ventaConDetalleDetalles
        })
        .catch((error) =>{
          console.log(error.response);
        })
        
      },
      crearPDFVenta(){

      }
    }
  }
</script>

<style>
  .ancho-tabla table{
    table-layout: fixed;
  }
</style>