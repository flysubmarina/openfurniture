<template>
  <div>
    <b-table striped hover :items="provider"></b-table>
  </div>
</template>

<script>
import api from "../api/api";
export default {
  name: "DBTable",
  props: {
    byIdComboBox: {
      type: Object,
      default: () => null
      // {text: 'text_field', bind: 'id'}
    },
    fields: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {};
  },
  mounted() {
    if (this.byIdComboBox) {
      console.log("boxed");
    }
  },
  methods: {
    provider(ctx) {}
  }
};
</script>

<style scoped>
</style>