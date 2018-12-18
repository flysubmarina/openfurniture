<template>
  <div>
    
  </div>
</template>

<script>
import Error from '../components/Error.vue'
import api from "../api/api";
export default {
  name: "Account",
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