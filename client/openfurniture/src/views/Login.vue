<template>
  <b-container class="bv-example-row">
    <b-alert variant="danger" :show="!!err" v-for="(err, index) in errors" :key="index">{{err.msg}}</b-alert>
    <b-row>
      <b-col cols="8">
        <b-form novalidate class="form-signin" @submit.prevent="handleLogin">
          <h1 class="form-signin-heading">Sign in</h1>
          <b-form-group
            horizontal
            :label-cols="2"
            label-size="lg"
            label="Small"
            label-for="validationCustomLogin"
          >
            <b-form-input
              id="validationCustomLogin"
              size="lg"
              autocomplete="on"
              required
              v-model="login"
              type="text"
              placeholder="Enter your login"
            />
          </b-form-group>
          <b-form-group
            horizontal
            :label-cols="2"
            label-size="lg"
            label="Password"
            label-for="password"
          >
            <b-form-input
              id="password"
              size="lg"
              autocomplete="on"
              required
              v-model="password"
              type="password"
              placeholder="Enter your password"
            />
          </b-form-group>
          <hr>
          <b-button variant="success" class="float-right" size="lg" type="submit">Sign In</b-button>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { AUTH_REQUEST } from "../store/actions/auth";
export default {
  name: "login",
  data() {
    return {
      errors: [],
      login: "",
      password: ""
    };
  },
  methods: {
    handleLogin() {
      const { login, password } = this;
      this.$store
        .dispatch(AUTH_REQUEST, { login, password })
        .then(result => {
          if (result.message !="Success login") {
            this.errors = [];
            this.errors.push({ msg: result.err.message });
          } else this.$router.push("/");
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped>
</style>