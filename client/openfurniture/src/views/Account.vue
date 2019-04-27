<template>
  <div class="mt-5">
    <b-alert
      :variant="err.variant"
      :show="!!err"
      v-for="(err, index) in errors"
      :key="index"
    >{{err.msg}}</b-alert>
    <b-container class="bv-example-row">
      <b-row>
        <b-col class="mx-auto" cols="8">
          <b-form novalidated @submit.prevent="handleRegister">
            <h1>Edit user profile up</h1>
            <b-form-group
              horizontal
              :label-cols="2"
              label-size="lg"
              label="Login"
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
                placeholder="Enter new password"
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
                placeholder="Confirm new password"
              />
            </b-form-group>
            <b-form-group
              horizontal
              :label-cols="2"
              label-size="lg"
              label="Admin"
              label-for="usertype"
            >
              <b-form-checkbox
                size="lg"
                id="usertype"
                v-model="type"
                value="admin"
                unchecked-value="user"
              />
            </b-form-group>
            <hr>
            <b-button variant="success" class="float-right" size="lg" type="submit">Save changes</b-button>
          </b-form>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import api from "../api/api";
import { USER_UPDATE } from "../store/actions/user";
import { mapGetters } from "vuex";
export default {
  name: "login",
  data() {
    return {
      errors: [],
      type: "user",
      login: "",
      password: "",
      confirmPassword: "",
      validationErrors: ""
    };
  },
  computed: {
    ...mapGetters(["getProfile", "isAuthenticated"])
  },
  methods: {
    handleRegister() {
      const { login, password, confirmPassword } = this;
      this.$store
        .dispatch(USER_UPDATE, {
          login,
          password,
          confirmPassword
        })
        .then(result => {
          this.errors = [];
          console.log("Result: ", result);
          if (result.err) {
            if (result.err == "Validation errors") {
              const { validationErrors } = result;
              validationErrors.forEach(element => {
                this.errors.push({ msg: element.msg, variant: "danger" });
              });
            } else {
              this.errors.push({ msg: result.err, variant: "danger" });
            }
          } else {
            this.errors.push({ msg: "Success updated", variant:'success' });
          } // else saved success
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