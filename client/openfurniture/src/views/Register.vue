<i18n>
{
  "en": {
    "Hello": "Hello",
    "WelcometoOpenFurniture": "Welcome to OpenFurniture"
  },
  "ua": {
    "Login":"Логін",
    "Password":"Пароль",
    "Enter your login":"Введіть ваш логін",
    "Enter your password":"Введіть ваш пароль",
    "Sign Up":"Реєстрація",
    "Confirm your password":"Подтвердіть ваш пароль",
    "Confirm password":"Підтвердіть пароль",
    "Admin":"Адміністратор"
  }
}
</i18n>



<template>
  <div class="mt-5">
    <b-alert variant="danger" :show="!!err" v-for="(err, index) in errors" :key="index">{{err.msg}}</b-alert>
    <b-container class="bv-example-row">
      <b-row>
        <b-col class="mx-auto" cols="8">
          <b-form novalidated @submit.prevent="handleRegister">
            <h1>{{$t('Sign Up')}}</h1>
            <b-form-group
              horizontal
              :label-cols="2"
              label-size="lg"
              :label="$t('Login')"
              label-for="login"
            >
              <b-form-input
                id="login"
                size="lg"
                autocomplete="on"
                required
                v-model="login"
                type="text"
                :placeholder="$t('Enter your login')"
              />
            </b-form-group>
            <b-form-group
              horizontal
              :label-cols="2"
              label-size="lg"
              :label="$t('Password')"
              label-for="password"
            >
              <b-form-input
                id="password"
                size="lg"
                autocomplete="on"
                required
                v-model="password"
                type="password"
                :placeholder="$t('Enter your password')"
              />
            </b-form-group>
            <b-form-group
              horizontal
              :label-cols="2"
              label-size="lg"
              :label="$t('Confirm password')"
              label-for="confirmPassword"
            >
              <b-form-input
                id="confirmPassword"
                size="lg"
                autocomplete="on"
                required
                v-model="confirmPassword"
                type="password"
                :placeholder="$t('Confirm your password')"
              />
            </b-form-group>
            <b-form-group
              horizontal
              :label-cols="3"
              label-size="lg"
              :label="$t('Admin')"
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
            <b-button variant="success" class="float-right" size="lg" type="submit">Sign Up</b-button>
          </b-form>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { REGISTER_REQUEST } from "../store/actions/register";
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
  methods: {
    handleRegister() {
      const { login, password, confirmPassword, type } = this;
      this.$store
        .dispatch(REGISTER_REQUEST, {
          login,
          password,
          confirmPassword,
          type
        })
        .then(result => {
          this.errors = [];
          console.log("Result: ", result);
          if (result.err) {
            if (result.err == "Validation errors") {
              const { validationErrors } = result;
              validationErrors.forEach(element => {
                this.errors.push({ msg: element.msg });
              });
            } else {
              this.errors.push({ msg: result.err });
            }
          } else this.$router.push("/login");
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