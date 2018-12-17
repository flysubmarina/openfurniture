<template>
  <div>
    
    <b-alert :show="show" variant="primary">{{msg}}</b-alert>
    <input type="text" name="login" id="login" v-model="login">
    <input type="password" name="password" id="password" v-model="password">
    <button @click="handleLogin">Ввійти</button>
  </div>
</template>

<script>
import Error from '../components/Error.vue'
import api from "../api/api";
export default {
  name: "profile",
  data() {
    return {
      login: "",
      password: "",
      show: false,
      msg: ""
    };
  },
  components: {
    Error
  },
  created() {

  },
  methods: {
    handleLogin() {
      api()
        .post(
          "/user/login",
          {
            login: this.login,
            password: this.password,
            confirmPassword: this.password
          },
          { withCredentials: true }
        )
        .then(res => {
          if (res.statusText == "OK") this.$router.push({ path: "/account" });
          else this.showError(res.data.err);
        });
    },
    showError(err) {
      this.msg = err;
    }
  }
};
</script>

<style scoped>
</style>