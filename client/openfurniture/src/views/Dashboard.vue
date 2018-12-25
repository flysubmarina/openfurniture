<template>
  <b-container class="bv-example-row">
    <b-row>
      <b-col class="my-4 mx-auto" cols="8">
        <h1>Admin dashboard</h1>
          <DBTable :by-id-combo-box="msg"/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import DBTable from "../components/DBTable.vue";
export default {
  name: "Dashboard",
  data() {
    return {
        msg:{
            text: 'name',
            bind: 'IdFurniture'
        }
    };
  },
  components: {
    DBTable
  }
};
</script>

<style scoped>
</style>