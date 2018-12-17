<template>
  <div>
    <b-alert :show="show">{{message}}</b-alert>
  </div>
</template>

<script>
export default {
  name: "Error",
  data() {
    return {
      show: false
    };
  },
  props: {
    msg: {
      type: String,
      default: "Error"
    }
  },
  methods: {
    fade() {
      setTimeout(() => {
        this.show = false;
      }, 2000);
    }
  },
  computed: {
    message() {
      return "Error: " + this.props.msg;
    }
  }
};
</script>

<style scoped>
</style>