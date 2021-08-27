<template>
    <div>
    <v-row>
        <div class="form-group row  texto" style="margin-top:50px;margin-left:40%">
            <label  class="col-form-label ">Ventas realizadas</label>
        </div>
    </v-row>

    <v-row>
        <v-card style="margin-top:60px; margin-left:5%;width:90%; height:90%">
            <div class="ex2">
                <canvas id="myChart"></canvas>
            </div>
        </v-card>
    </v-row>
</div>
</template>

<script>
    import axios from "axios";
    import Chart from 'chart.js'
    export default {
        data(){
            return{
                datos:[],
                total:[],
            };
        },//data
        methods: {
            async graficar(){
                let me = this;
                let categoriaArray = [];
                let header = { headers: { "token": this.$store.state.token } };
                await axios.get("venta",header)
                    .then(response =>{   
                        console.log(response);  
                        categoriaArray = response.data.venta;
                        categoriaArray.map(function(x){
                            var fecha = x.createAt.split("T");
                            var fechaLimpia = fecha[0]
                            me.datos.push(fechaLimpia);
                            me.total.push(x.total);
                        });

                    })
                    
                let ctx = document.getElementById('myChart');
                const myChart = new Chart(ctx,{
                    type:'line',
                    data:{
                        labels:me.datos,
                        datasets:[{
                            label:'Ventas',
                            data:me.total,
                            backgroundColor:[
                                'rgba(99,189,108,0.2)', 
                            ],
                            borderColor:[
                                'rgba(99,189,108,1)', 
                            ],
                            borderWidth:1
                        }]
                    },
                    options:{
                        animation:{
                            animateScale:true
                        },
                        scales:{
                            yAxes:[{
                                ticks:{
                                    beginAtZero:true
                                }
                            }]
                        },
                        
                    }
                })
                console.log(myChart);
            }
        },//methods
        mounted() {
            this.graficar();
        },
    }
</script>
<style scoped>
    .texto{
        font-family: 'calibri';
        color: #00000;
        font-size: 50px;
        text-align:left;
    }
</style>