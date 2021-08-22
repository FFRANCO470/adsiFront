<template>
    <div class="ex2">
        <canvas id="myChart"></canvas>
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
                    type:'bar',
                    data:{
                        labels:me.datos,
                        datasets:[{
                            label:'Articulos',
                            data:me.stock,
                            backgroundColor:[
                                'rgba(255,99,132,0.2)', 
                            ],
                            borderColor:[
                                'rgba(255,99,132,1)', 
                            ],
                            borderWidth:1
                        }]
                    },
                    options:{
                        scales:{
                            yAxes:[{
                                ticks:{
                                    beginAtZero:true
                                }
                            }]
                        }
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