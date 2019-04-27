<template>
  <b-container class="bv-example-row">
    <b-row>
       <b-col>User height</b-col> 
      <b-col cols="8">
        <b-form-input type="range" id="user_height" v-model="height" min="0" max="200"/> {{height}}cm
      </b-col>
      <b-col>
          <b-button
                  variant="success"
                  @click="sendHeight"
                >{{$t('Set user height')}}</b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import api from "../api/api";
export default {
  name: "UserHeight",
  data() {
    return {
      height: 0
    };
  },
  methods: {
      sendHeight() {
          api.put("room/setparams", {height: this.height}).then(res=>{
              alert(res)
          }).catch(err=>{
              alert(err)
          })
      },
  },
};
</script>

<style scoped>
</style>