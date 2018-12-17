<template>
  <b-container class="bv-example-row">
    <b-row>
      <b-col cols="6">
        <b-form novalidated class="login" @submit.prevent="handleLogin">
          <h1>Sign in</h1>
          <b-form-group
            horizontal
            :label-cols="2"
            label-size="sm"
            label="Small"
            label-for="login"
          >
            <b-form-input
              id="login"
              size="sm"
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
            label-size="sm"
            label="Password"
            label-for="password"
          >
            <b-form-input
              id="password"
              size="sm"
              autocomplete="on"
              required
              v-model="password"
              type="password"
              placeholder="Enter your password"
            />
          </b-form-group>
        <b-form-group
            horizontal
            :label-cols="2"
            label-size="sm"
            label="Confirm password"
            label-for="confirmPassword"
          >
            <b-form-input
              id="confirmPassword"
              size="sm"
              autocomplete="on"
              required
              v-model="confirmPassword"
              type="password"
              placeholder="Confirm your password"
            />
        </b-form-group>
          <hr>
          <b-button type="submit">Login</b-button>
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
      login: "",
      password: "",
      confirmPassword: ""
    };
  },
  methods: {
    handleLogin() {
      const { login, password, confirmPassword } = this;
      this.$store
        .dispatch(AUTH_REQUEST, { login, password, confirmPassword })
        .then(result => {
          if (result.err) {
          }
          this.$router.push("/");
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