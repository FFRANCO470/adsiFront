<template>
  <v-app>
    <v-container fluid>

      <template>
        <v-data-table v-if="muestra == 0" class="ancho-tabla elevation-15" :headers="columnas" :items="ventas" :search="search" >
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
                  <v-autocomplete v-model="editedItem.serieComprobante" :items="ventas" dense label="Serie Comprobante" ></v-autocomplete>
                </v-col>
                <v-col cols="4">
                  <v-autocomplete v-model="editedItem.numComprobante" :items="ventas" dense label="Número Comprobante"  ></v-autocomplete>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="8">
                  <v-autocomplete  v-model="editedItem.persona" :items="ventas" dense label="Proveedor"  ></v-autocomplete>
                </v-col>
                <v-col cols="4">
                  <v-autocomplete v-model="editedItem.impuesto" :items="ventas"  dense label="Impuesto" ></v-autocomplete>
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
              <div style="margin: 30px 0 0 20px;"><span class="black--text">Vendedor : {{ventaConDetalleVendedor.nombre}}</span></div>
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
                <v-data-table class="ancho-tabla elevation-15 "  :headers="articulosVendidos"   :items="articuloIncluido" >
                  <template v-slot:top>
                    <v-toolbar  flat >
                      <v-toolbar-title>Articulos vendidos</v-toolbar-title>
                    </v-toolbar>
                  </template>
                </v-data-table>
              </v-col >
            </v-row>
            {{ventaConDetalleDetalles}}
          </template>
        </div>
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
      drawer:false,
      search: '',
      muestra :0,
      msgError:'',
      columnas: [
        { text: 'Fecha', value: 'createAt',class:'teal accent-4 white--text' },
        { text: 'Vendedor', value: 'usuario.nombre' ,class:'teal accent-4 white--text',width:'10%'},
        { text: 'Cliente', value: 'persona.nombre' ,class:'teal accent-4 white--text'},
        { text: 'Tipo Comprobante', value: 'tipoComprobante' ,class:'teal accent-4 white--text',width:'10%'},
        { text: 'Serie Comprobante', value: 'serieComprobante',class:'teal accent-4 white--text',width:'10%' },
        { text: 'Número Comprobante', value: 'numComprobante',class:'teal accent-4 white--text',width:'10%' },
        { text: 'Impuesto', value: 'impuesto' ,class:'teal accent-4 white--text',width:'10%'},
        { text: 'Total', value: 'total',class:'teal accent-4 white--text',width:'10%' },
        { text: 'Acciones', value: 'actions', sortable: false,class:'teal accent-4 white--text',width:'10%' }
      ],
      ventas: [
        {
        usuario:'', persona:'',  tipoComprobante:'', serieComprobante:'',
        numComprobante:'', impuesto:'',total:'', detalles:'', createAt:'',
        }
      ],
      ventaConDetalleFecha:'',
      ventaConDetalleEstado:'',
      ventaConDetalleCliente:'',
      ventaConDetalleVendedor:'',
      ventaConDetalleTipoComp:'',
      ventaConDetalleSerie:'',
      ventaConDetalleNumComp:'',
      ventaConDetalleImpuesto:'',
      ventaConDetalleTotal:'',
      ventaConDetalleDetalles:[],
      articulosVendidos:[
        { text: 'Nombre', value: 'nombre',class:'teal accent-4 white--text' },
        { text: 'Cantidad', value: 'cantidad',class:'teal accent-4 white--text' },
        { text: 'Precio uni.', value: 'precio',class:'teal accent-4 white--text' },
        { text: 'Precio total', value: 'precioTotal',class:'teal accent-4 white--text' },
      ],
      artiVendidos:[{_id:'',nombre:'',cantidad:'',precio:''}],
      articuloIncluido:[{_id:'',nombre:'',cantidad:'',precio:'',precioTotal:''}],




      editedIndex: -1,
      editedItem:{
        usuario:'', persona:'',  tipoComprobante:'', serieComprobante:'',
        numComprobante:'', impuesto:'',total:'', detalles:'', createAt:'',
      },
      serieC:[],
      numC:[],
    }),
    created(){
      this.obtenerVenta();
    },
    methods: {
      //msg de alerta
      msjcompra:function(tata){ Swal.fire({ position: 'top', icon: 'error', title: tata, showConfirmButton: false, timer: 2000})  },
      //llenar tabla de ventas
      obtenerVenta(){
        let header = {headers:{"token" : this.$store.state.token}};
        axios.get("venta",header)
        .then(response =>{
          console.log(response.data);
          this.ventas = response.data.venta
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
      //cambiar vistas
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
      //activar desactivar venta
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
          axios.put(`venta/activar/${id}`,{},header)
            .then(function(){
              me.obtenerVenta();
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
      //imprimer todas las ventas
      crearPDF(){
        var rows=[];
        this.ventas.map(function(x){
          rows.push({
            createAt: x.createAt,
            usuario: x.usuario.nombre,
            persona: x.persona.nombre,
            tipoComprobante: x.tipoComprobante,
            serieComprobante: x.serieComprobante,
            numComprobante: x.numComprobante,
            impuesto: x.impuesto,
            total: x.total
          });
        });
        var doc = new jsPDF();
        doc.autoTable({
          didDrawPage:function(){
            doc.text("Lista de Ventas",14,10);
          },
          columnStyles: {
            0: {cellWidth:22 },
            1: {cellWidth:'auto' },
            2: {cellWidth:'auto' },
            3: {cellWidth:'auto' },
            4: {cellWidth:'auto' },
            5: {cellWidth:'auto' },
            6: {cellWidth:'auto' },
            7: {cellWidth: 'auto'},
          },
          headStyles: { fillColor: '#23323a', textColor: '#B9F6CA',  halign: 'left'  },
          body: rows,
          columns :[
            {title:"CreatedAt",dataKey:"createAt"},
            {title:"Usuario",dataKey:"usuario"},
            {title:"Persona",dataKey:"persona"},
            {title:"Tipo Comprobante",dataKey:"tipoComprobante"},
            {title:"Serie Comprobante",dataKey:"serieComprobante"},
            {title:"# Comprobante",dataKey:"numComprobante"},
            {title:"Impusto",dataKey:"impuesto"},
            {title:"Total",dataKey:"total"},
          ]
        })
        doc.save("Ventas.pdf");
      },
      //traer venta con detalles
      traerVentaDetalle(item){
        let id = item._id;
        let header = {headers:{"token" : this.$store.state.token}};
        axios.get(`venta/${id}`,header)
          .then(response =>{
            console.log(response);
            this.ventaConDetalleFecha=response.data.venta.createAt
            this.ventaConDetalleEstado=response.data.venta.estado
            this.ventaConDetalleCliente=response.data.venta.persona
            this.ventaConDetalleVendedor=response.data.venta.usuario
            this.ventaConDetalleTipoComp=response.data.venta.tipoComprobante
            this.ventaConDetalleSerie=response.data.venta.serieComprobante
            this.ventaConDetalleNumComp=response.data.venta.numComprobante
            this.ventaConDetalleImpuesto=response.data.venta.impuesto
            this.ventaConDetalleTotal=response.data.venta.total
            this.ventaConDetalleDetalles=response.data.venta.detalles
            this.artiVendidos=this.ventaConDetalleDetalles
            this.meter(this.ventaConDetalleDetalles)
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
      //agregar precio total
      meter(ventaConDetalleDetalles){
        console.log(ventaConDetalleDetalles);
        var pepe=[];
        ventaConDetalleDetalles.map(function(x){
          pepe.push({
            _id:x._id,
            nombre:x.nombre,
            cantidad:x.cantidad,
            precio:x.precio,
            precioTotal:x.cantidad*x.precio,
          })
        });
        console.log(pepe);
        this.articuloIncluido=pepe
      },
      //imprimir la venta
      crearPDFVenta(){
        const doc = new  jsPDF();
        let rows =[];
        this.ventaConDetalleDetalles.map(function(x){
          rows.push({
            nombre : x.nombre,
            cantidad : x.cantidad,
            precio : x.precio,
            precioSub : x.precio*x.cantidad
          })
        })
        doc.setFontSize(12);
        doc.text(`Fecha : ${this.ventaConDetalleFecha}`,15,15);
        doc.text(`Estado : ${this.ventaConDetalleEstado}`,150,15);
        doc.text(`Cliente : ${this.ventaConDetalleCliente.nombre}`,15,25);
        doc.text(`Vendedor : ${this.ventaConDetalleVendedor.nombre}`,15,35);
        doc.text(`Tipo comprobante : ${this.ventaConDetalleTipoComp}`,15,45);
        doc.text(`Serie : ${this.ventaConDetalleSerie}`,15,55);
        doc.text(`# Comprobante : ${this.ventaConDetalleNumComp}`,15,65);
        doc.text(`Total : ${this.ventaConDetalleTotal}`,15,75);
        doc.text(`Impuesto : ${this.ventaConDetalleImpuesto}`,15,85);
        doc.autoTable({
          didDrawPage:function(){
            doc.text("Articulos vendidos:",15,100);
          },
          startY: 105,
          columnStyles: {
            0: {cellWidth: 40},
            1: {cellWidth: 40},
            2: {cellWidth: 40},
            3: {cellWidth: 'auto'},
          },
          headStyles: { fillColor: '#23323a', textColor: '#B9F6CA',  halign: 'left'  },
          body:rows,
          columns :[
          {header:"Articulo",dataKey:"nombre"},
          {header:"Cantidad",dataKey:"cantidad"},
          {header:"Precio Uni",dataKey:"precio"},
          {header:"Precio Total",dataKey:"precioSub"},
          ],
          cursor: { x: 15, y: 115 }
        }),
        doc.save("Factura de venta.pdf");
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
      
      
      guardar(){
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
      
      
      
      
    }
  }
</script>

<style>
  .ancho-tabla table{
    table-layout: fixed;
  }
</style>