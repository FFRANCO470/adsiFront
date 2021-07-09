<template>
    
    <div>
        <!--<v-img  src="../assets/logo.png" styele="max-width:50px;max-height:50px;"></v-img>-->
          <img srcset="../assets/logo.png 320w,
             ../assets/logo.png 480w,
             ../assets/logo.png 800w"  sizes="(max-width: 320px) 280px,   (max-width: 480px) 440px,   800px"  src="../assets/logo.png" >
    </div>
    
</template>

<script>

export default {
    data() {
        return {
        }
    },
}
</script>
<style>