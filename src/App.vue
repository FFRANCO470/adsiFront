<template>
  <v-app>
    <Cabecera/>
    <v-main>
      <router-view>
      </router-view>
    </v-main>
  </v-app>
</template>

<script>
import Cabecera from "./components/Cabecera.vue"
// import axios from 'axios'


export default {
  name: 'App',
  
  components: {
    Cabecera
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
