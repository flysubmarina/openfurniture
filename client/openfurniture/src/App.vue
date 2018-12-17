<template>
  <div id="app">
    <Header/>
    <router-view/>
    <Footer/>
  </div>
</template>

<script>
import Header from './components/TheHeader'
import Footer from './components/TheFooter'
export default {
  name: 'app',
  data(){
    return {
      
    }
  },
  components:{
    Header, Footer
  }
}
</script>


<style>
body{
  margin: 0;
  padding: 0;
}
</style>
