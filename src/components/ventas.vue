<template>
  <v-app>
    <v-container fluid>
      <template>
        <!--tabla se muestra en la vista inicial-->
        <v-data-table v-if="muestra == 0" class="ancho-tabla elevation-15" :headers="columnas" :items="ventas" :search="search" >
          <template v-slot:top>
            <!--parte alta de la tabla-->
            <v-toolbar flat >
              <v-toolbar-title>Ventas: {{totalVentas}}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-text-field  v-model="search"  append-icon="mdi-magnify" label="Buscar" single-line  hide-details ></v-text-field>
              <v-divider  class="mx-4"   inset  vertical ></v-divider>
              <!--Boton descargar y cambio de vista apara agregar venta-->
              <v-spacer></v-spacer>
               <v-icon  medium   class="mr-4" @click="crearPDF()"  >mdi-download</v-icon>
              <v-btn depressed dark  class="mb-2"    @click="cambioPage(1,false)" >Añadir</v-btn>
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
          <!--opciones sober las ventas-->
          <template v-slot:item.actions="{ item }">
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
      <!--cambiar de vista para generar factura-->
      <template>
        <div v-if="muestra==1" class="container-fluid pa-4 white grid-list-sm">
            <v-container fluid>
              <v-row> 
                <v-btn   @click="guardar2()"  depressed dark   class="mb-2"> Generar venta</v-btn>
                <v-spacer></v-spacer>
                <v-btn   @click="cambioPage(0,false)"  color="red" dark class="mb-2"> Cancelar</v-btn>
              </v-row>
              <!--formulario-->
              <v-row>
                <v-col cols="4"><v-autocomplete v-model="editedItem.tipoComprobante"  :items="tiposComprobantaVenta"   label="Tipo Comprobante" ></v-autocomplete></v-col>
                <v-col cols="4"> <v-text-field  v-model="editedItem.serieComprobante"  label="Serie comprobante"></v-text-field></v-col>
                <v-col cols="4"><v-text-field  type="number" min="0" v-model="editedItem.numComprobante"  label="Numero comprobante"></v-text-field></v-col>
              </v-row>
              <v-row>
                <v-col cols="8"> <v-autocomplete  v-model="editedItem.persona" :items="clientes"  label="Cliente"  ></v-autocomplete> </v-col>
                <v-col cols="4">  <v-text-field  type="number" min="0" v-model="editedItem.impuesto" default=0 label="Impuesto"></v-text-field></v-col>
              </v-row>
              <v-row>
                  <div  style="margin: 30px 50px 10px 20px;"><span class="black--text">Total parcial : {{totalVendido}}</span></div>        
              </v-row>              
              <v-row>
                  <div  style="margin: 30px 50px 10px 20px;"><span class="black--text">Total impuesto : {{TotalFinalImpuesto}}</span></div> 
              </v-row>              
              <v-row>
                  <div  style="margin: 30px 50px 10px 20px;"><span class="black--text">Total neto : {{totalVendido+TotalFinalImpuesto}}</span></div>        
              </v-row>              
                
            </v-container>                
        </div>
        <div v-if="muestra==1" style="margin-top:10px; margin-left:40px; margin-right:7%" class="container-fluid">
          <v-row>  
              <!--tabla con todos los articulos-->            
                <v-col>
                  <v-data-table class="ancho-tabla elevation-15"  :headers="mostradorArticulosTitle" :items="mostradorArticulos" :search="search" >
                    <template v-slot:top>
                      <v-toolbar flat >
                        <v-toolbar-title>Todos</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-text-field  v-model="search"  append-icon="mdi-magnify" label="Buscar" single-line  hide-details ></v-text-field>
                        <v-divider  class="mx-4"   inset  vertical ></v-divider>
                      </v-toolbar>
                    </template>
                    <!--opcion para agregar al array para vender-->
                    <template  v-slot:item.actions="{ item }">
                      <v-icon  small  class="mr-2" @click="facturar(item)" >mdi-cart </v-icon>
                    </template>
                  </v-data-table>  
                </v-col>
                <!--tabla con los articulos vendidos-->
                <v-col>
                  <v-data-table class="ancho-tabla elevation-15" :headers="facturaArticulosTitle" :items="facturaArticulos"   >
                    <template v-slot:top>
                      <v-toolbar flat >
                        <v-toolbar-title>Vendidos</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-text-field  v-model="search"  append-icon="mdi-magnify" label="Buscar" single-line  hide-details ></v-text-field>
                        <v-divider  class="mx-4"   inset  vertical ></v-divider>
                      </v-toolbar>
                    </template>
                    <!--modificar las cantidades-->
                    <template  v-slot:item.cantidad="props">
                      <v-text-field  v-model="props.item.cantidad"  min=0 name="quantity"  outlined type="number"></v-text-field>
                    </template>

                    <template v-slot:[`item.subtotal`]="{ item }">
                      {{item.precio*item.cantidad}}
                    </template>
                    <!--opcion para quitar el articulo del array de venta-->
                    <template v-slot:[`item.actions`]="{ item }">
                      <v-icon  small  class="mr-2" @click="desfacturar(item)" >mdi-delete </v-icon>
                    </template>
                  </v-data-table> 
                </v-col>  
              </v-row>
        </div>
      </template>
      <template>
        <!--para mostar a detalle la factura-->
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
              <div  style="margin: 30px 50px 10px 20px;"><span class="black--text">Fecha : {{ventaConDetalleFecha}} </span></div>
              <div style="margin: 30px 0 0 20px;"><span class="black--text">Estado : {{ventaConDetalleEstado}}</span></div>
            </v-row>
            <v-row>
              <div style="margin: 30px 0 0 20px;">
              <p align="left">
                <strong>Cliente :</strong>{{ventaConDetalleCliente.nombre}}<br>
                <strong>Tipo documento :</strong>{{datosCliente.tipoDocumento}}<br>
                <strong>Num documento :</strong>{{datosCliente.numDocumento}}<br>
                <strong>Email:</strong>{{datosCliente.email}}<br>
                <strong>Telefono:</strong>{{datosCliente.telefono}}<br>
                <strong>Direccion:</strong>{{datosCliente.direccion}}<br><br>
                <strong>Vendedor : </strong> {{ventaConDetalleVendedor.nombre}}<br>
                <strong>Tipo Comprobante :</strong> {{ventaConDetalleTipoComp}}<br>
                <strong>Serie :</strong> {{ventaConDetalleSerie}}<br>
                <strong># Comprobante :</strong> {{ventaConDetalleNumComp}}<br><br>
                <strong>Total parcial : </strong>{{ventaConDetalleTotal}}<br>
                <strong>Total impuesto ({{ventaConDetalleImpuesto*100}}%):</strong>{{ventaConDetalleTotal*ventaConDetalleImpuesto}} <br>
                <strong>Total Neto:</strong> {{ventaConDetalleTotal+(ventaConDetalleTotal*ventaConDetalleImpuesto)}}  
              </p>
              </div>
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
        numComprobante:'', impuesto:0,total:0, detalles:'', createAt:'',
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
      datosCliente:{},//almacenar datos del cliente
      articulosVendidos:[
        { text: 'Nombre', value: 'nombre',class:'teal accent-4 white--text' },
        { text: 'Cantidad', value: 'cantidad',class:'teal accent-4 white--text' },
        { text: 'Precio uni.', value: 'precio',class:'teal accent-4 white--text' },
        { text: 'Precio total', value: 'precioTotal',class:'teal accent-4 white--text' },
      ],
      artiVendidos:[{_id:'',nombre:'',cantidad:'',precio:''}],
      articuloIncluido:[{_id:'',nombre:'',cantidad:'',precio:'',precioTotal:''}],
      editedItem:{
        persona:'',  tipoComprobante:'', serieComprobante:'',
        numComprobante:'', impuesto:'',total:'', detalles:[],
      },
      tiposComprobantaVenta:["FACTURA","NOTA DEBITO","NOTA CREDITO"],
      clientes:[],
      mostradorArticulosTitle:[
        {text:'Codigo',value:'codigo',class:'teal accent-4 white--text',sortable: false},
        {text:'Nombre',value:'nombre',class:'teal accent-4 white--text',sortable: false},
        {text:'Cantidad',value:'cantidad',class:'teal accent-4 white--text',sortable: false},
        {text:'Precio',value:'precio',class:'teal accent-4 white--text',sortable: false},
        {text:'Agregar',value:'actions',class:'teal accent-4 white--text',sortable: false}
      ],
      mostradorArticulosLlegar:[{_id:'',estado:'',codigo:'',nombre:'',precio:0,cantidad:0}],
      mostradorArticulos:[{_id:'',codigo:'',nombre:'',precio:0,cantidad:0}],

      facturaArticulosTitle:[
        {text:'Nombre',value:'nombre',class:'black accent-4 white--text',sortable: false},
        {text:'Cantidad',value:'cantidad',class:'black accent-4 white--text',sortable: false},
        {text:'Precio',value:'precio',class:'black accent-4 white--text',sortable: false},
        {text:'Sub total',value:'subtotal',class:'black accent-4 white--text',sortable: false},
        {text:'Eliminar',value:'actions',class:'black accent-4 white--text',sortable: false}
      ],
      facturaArticulos:[  ],
      editedIndex: -1,




    }),
    created(){
      this.obtenerVenta();
    },
    methods: {
      //msg de alerta
      msjcompra:function(tata){ Swal.fire({ position: 'top', icon: 'error', title: tata, showConfirmButton: false, timer: 2000})  },
      listo:function(){ Swal.fire({ position: 'top', icon: 'success', title: 'Venta realizada', showConfirmButton: false, timer: 2000})  },
      //cambiar vistas
      cambioPage(num,item){
        if(num==0){
          this.muestra=num;
        }else if(num==1){
          this.muestra=num;
          this. obtenerPersonas();
          this.obtenerArtirticulos();
        }else{
          this.muestra=num;
          this.traerVentaDetalle(item);
        }
      },//cambioPage
      //llenar tabla de ventas
      obtenerVenta(){
        let header = {headers:{"token" : this.$store.state.token}};
        axios.get("venta",header)
        .then(response =>{
          console.log(response.data);
          this.ventas = response.data.venta
          console.log(this.ventas);
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
      },//obtenerVenta
      
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
      },//activarDesactivarItem
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
      },//crearPDF
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
            this.traerCliente(this.ventaConDetalleCliente)
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
      },//traerVentaDetalle
      traerCliente(item){
        let id = item._id;
        let header = {headers:{"token" : this.$store.state.token}};
        axios.get(`persona/byid/${id}`,header)
          .then(response =>{
            console.log('cliente');
            console.log(response);
            this.datosCliente=response.data.persona;
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
      },//meter
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
        doc.setFontSize(11);
        doc.text(`Fecha : ${this.ventaConDetalleFecha}`,15,15);
        doc.text(`Estado : ${this.ventaConDetalleEstado}`,150,15);
        doc.text(`Cliente :                 ${this.ventaConDetalleCliente.nombre}`,15,35);
        doc.text(`Tipo documento :   ${this.datosCliente.tipoDocumento}`,15,40);
        doc.text(`Num documento :   ${this.datosCliente.numDocumento}`,15,45);
        doc.text(`Email :                     ${this.datosCliente.email}`,15,50);
        doc.text(`Telefono :                ${this.datosCliente.telefono}`,15,55);
        doc.text(`Direccion :               ${this.datosCliente.direccion}`,15,60);
        doc.text(`Vendedor :               ${this.ventaConDetalleVendedor.nombre}`,15,70);
        doc.text(`Tipo comprobante :  ${this.ventaConDetalleTipoComp}`,15,75);
        doc.text(`Serie :                      ${this.ventaConDetalleSerie}`,15,80);
        doc.text(`# Comprobante :      ${this.ventaConDetalleNumComp}`,15,85);
        doc.text(`Total parcial:           ${this.ventaConDetalleTotal} `,15,95);
        doc.text(`Impuesto (${this.ventaConDetalleImpuesto}) :            ${this.ventaConDetalleTotal*this.ventaConDetalleImpuesto}`,15,100);
        doc.text(`Total Neto:              ${this.ventaConDetalleTotal+(this.ventaConDetalleTotal*this.ventaConDetalleImpuesto)}`,15,105);
        doc.autoTable({
          didDrawPage:function(){
            doc.text("Articulos vendidos:",15,115);
          },
          startY: 120,
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
      },//crearPDFVenta
      //traer los clientes para colocarlos en la venta
      obtenerPersonas(){
        let me = this;
        let clientesArray=[];
        let header = {headers:{"token" : this.$store.state.token}};
        axios.get("persona/listClientes",header)
          .then(response =>{
            console.log(response.data);
            clientesArray = response.data.persona;
            clientesArray.map(function(x){
              if(x.estado==1){
                me.clientes.push({text:x.nombre,value:x._id})
              }
            })
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
      },//obtenerPersonas
      //alista los articulos para venderlos
      meterArticulos(mostradorArticulosLlegar){
        var pepe=[];
        mostradorArticulosLlegar.map(function(x){
          if(x.estado!=0 && x.stock>0){
            pepe.push({
              _id:x._id,
              codigo:x.codigo,
              nombre:x.nombre,
              precio:x.precio,
              cantidad:x.stock
            })
          }
        })
        console.log(pepe);
        this.mostradorArticulos=pepe;
      },//meterArticulos
      //trae los articulos para venderlos
      obtenerArtirticulos(){
        let header = {headers:{"token" : this.$store.state.token}};
        axios.get("articulo",header)
        .then(response =>{   
          console.log(response);  
          this.mostradorArticulosLlegar = response.data.articulos
          this.meterArticulos(this.mostradorArticulosLlegar);
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
      },//obtenerArtirticulos
      //agrega el articulo a la venta
      facturar(item){
        this.editedIndex=this.mostradorArticulos.indexOf(item);
        this.facturaArticulos.push(item);
        this.mostradorArticulos.splice(this.editedIndex,1);
        console.log(this.facturaArticulos);
        console.log(this.editedIndex);
      },//facturar
      //quita el articulo de la venta
      desfacturar(item){
        this.editedIndex=this.facturaArticulos.indexOf(item)
        this.mostradorArticulos.push(item)
        this.facturaArticulos.splice(this.editedIndex,1)
        console.log(this.facturaArticulos);
        console.log(this.editedIndex);
      },//desfacturar
      //alista las variables para mandarlas a la bd online
      guardar2(){
        var usuario=this.$store.state.idUser;
        var persona=this.editedItem.persona;
        var tipoComprobante=this.editedItem.tipoComprobante;
        var serieComprobante=this.editedItem.serieComprobante;
        var numComprobante=this.editedItem.numComprobante;
        var impuesto=this.editedItem.impuesto/100;
        var total= this.totalVendido;
        var detalles=this.facturaArticulos;
        console.log(usuario);
        console.log(persona);
        console.log(tipoComprobante);
        console.log(serieComprobante);
        console.log(numComprobante);
        console.log(impuesto);
        console.log(total);
        console.log(detalles);
        this.guardar(usuario,persona,tipoComprobante,serieComprobante,numComprobante,impuesto,total,detalles)
      },//guardar1
      //agrega la venta a la bd online
      guardar(user,person,tipo,serie,num,imp,total,deta){
        console.log('estoy guardando'+this.bd);
        let header = {headers:{"token" : this.$store.state.token}};
        axios.post('venta',{
          usuario:user,
          persona:person,
          tipoComprobante:tipo,
          serieComprobante:serie,
          numComprobante:num,
          impuesto:imp,
          total:total,
          detalles:deta
          },header)
            .then((response)=>{
              console.log(response);
              this.obtenerVenta();
              this. obtenerPersonas();
              this.obtenerArtirticulos();
              this.reset();
              this.listo();
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
      },//guardar
      //limpia la ventanilla para generarfactura
      reset(){
        this.editedItem.persona='';
        this.editedItem.tipoComprobante='';
        this.editedItem.serieComprobante='';
        this.editedItem.numComprobante='';
        this.editedItem.impuesto='';
        this.editedItem.total='';
        this.facturaArticulos=[]
      },//reset
    },
    computed:{
      
      totalVentas(){
          return this.ventas.reduce((suma,venta)=>{
            return suma + parseFloat(venta.total)
          },0)
      },
      totalVendido(){
          return this.facturaArticulos.reduce((suma,articulo)=>{
            return suma + (parseInt(articulo.cantidad)*articulo.precio)
          },0)
      },
      TotalFinalImpuesto(){
        if(!this.editedItem.impuesto)return 0
        var totalImpues =this.totalVendido*this.editedItem.impuesto/100 
        var mandar = parseFloat(totalImpues.toFixed(2))
        return mandar
      },
    }
  }
</script>

<style>
  .ancho-tabla table{
    table-layout: fixed;
  }
</style>