<template>
    <div>
    <v-row>
        <div class="form-group row  texto" style="margin-top:50px;margin-left:40%">
            <label  class="col-form-label ">Cantidad de articulos</label>
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
                stock:[],
            };
        },//data
        methods: {
            async graficar(){
                let me = this;
                let categoriaArray = [];
                let header = { headers: { "token": this.$store.state.token } };
                await axios.get("articulo",header)
                    .then(response =>{   
                        console.log(response);  
                        categoriaArray = response.data.articulos;
                        categoriaArray.map(function(x){
                            me.datos.push(x.nombre);
                            me.stock.push(x.stock);
                        });

                    })
                    
                let ctx = document.getElementById('myChart');
                const myChart = new Chart(ctx,{
                    type:'pie',
                    data:{
                        labels:me.datos,
                        datasets:[{
                            label:'Articulos',
                            data:me.stock,
                            backgroundColor:[
                                'rgba(255,99,132,0.2)', 
                                'rgba(254,251,38,0.2)', 
                                'rgba(114,235,44,0.2)', 
                                'rgba(44,235,206,0.2)', 
                                'rgba(44,108,235,0.2)', 
                                'rgba(189,44,235,0.2)', 
                            ],
                            borderColor:[
                                'rgba(255,99,132,1)', 
                                'rgba(254,251,38,1)', 
                                'rgba(114,235,44,1)', 
                                'rgba(44,235,206,1)', 
                                'rgba(44,108,235,1)', 
                                'rgba(189,44,235,1)', 
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