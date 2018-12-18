<template>
  <b-container class="bv-example-row">
      
    <b-row >
      <b-col cols="8" >
        <b-form novalidated @submit.prevent="handleRegister" >
          <h1>Sign up</h1>
          <b-form-group
            horizontal
            :label-cols="2"
            label-size="lg"
            label="Small"
            label-for="login"
          >
            <b-form-input
              id="login"
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
        <b-form-group
            horizontal
            :label-cols="2"
            label-size="lg"
            label="Confirm password"
            label-for="confirmPassword"
          >
            <b-form-input
              id="confirmPassword"
              size="lg"
              autocomplete="on"
              required
              v-model="confirmPassword"
              type="password"
              placeholder="Confirm your password"
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
import { REGISTER_REQUEST } from "../store/actions/register";
export default {
  name: "login",
  data() {
    return {
      login: "",
      password: "",
      confirmPassword: "",
      validationErrors: ''
    };
  },
  methods: {
    handleRegister() {
      const { login, password, confirmPassword } = this;
      this.$store
        .dispatch(REGISTER_REQUEST, { login, password, confirmPassword, type:'user' })
        .then(result => {
          if (result.err) {
              alert(err)
          }else
          this.$router.push("/login");
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