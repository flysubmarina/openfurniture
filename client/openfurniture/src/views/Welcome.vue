<i18n>
{
  "en": {
    "Hello": "Hello",
    "WelcometoOpenFurniture": "Welcome to OpenFurniture"
  },
  "ua": {
    "Hello": "Добрий день, ",
    "WelcometoOpenFurniture": "Раді бачити вас в OpenFurniture",
    "We can help you to customize your space in hotel":"Ми можем допомогти вам кастомізувати ваш простір в готелі",
    "Get Started": "Розпочати"
  }
}
</i18n>



<template>
  <div>
    <b-jumbotron>
      <template slot="header">{{$t('Hello')}} {{getProfile.login?getProfile.login:'guest'}}</template>
      <template slot="lead">{{$t('WelcometoOpenFurniture')}}</template>
      <hr class="my-4">
      <p>{{$t('We can help you to customize your space in hotel')}}</p>
      <b-btn @click="handleClick" variant="success" size="lg">{{$t('Get Started')}}</b-btn>
    </b-jumbotron>
  </div>
</template>

<script>
import Error from "../components/Error.vue";
import { mapGetters } from "vuex";
import { USER_REQUEST } from "../store/actions/user";
export default {
  name: "Welcome",
  data() {
    return {
      errors: []
    };
  },
  components: {
    Error
  },
  mounted() {
    console.log(this.$i18n);
    if (this.isAuthenticated) this.handleUserRequest();
  },
  computed: {
    ...mapGetters(["getProfile", "isAuthenticated"]),
    getNumber() {
      return this.$store.state.number;
    }
  },
  methods: {
    handleUserRequest() {
      this.$store.dispatch(USER_REQUEST);
    },
    handleClick(e) {
      localStorage.setItem("number", 10);
      this.$router.push('/rooms')
    }
  }
};
</script>

<style scoped>
</style>