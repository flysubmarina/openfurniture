<template>
  <div>
    <b-jumbotron>
  <template slot="header">
    Hello {{getProfile.login?getProfile.login:'guest'}}
  </template>
  <template slot="lead">
    Welcome to OpenFurniture
  </template>
  <hr class="my-4">
  <p>
    We can help you to customize your space in hotel
  </p>
  <b-btn variant="success" size="lg" href="#">Get Started</b-btn>
</b-jumbotron>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { USER_REQUEST } from "../store/actions/user";
export default {
  name: "Welcome",
  data() {
    return {};
  },
  created(){
    if(this.isAuthenticated)  this.handleUserRequest()
  },
  computed: {
    ...mapGetters(["getProfile", "isAuthenticated"])
  },
  methods: {
    handleUserRequest() {
      this.$store.dispatch(USER_REQUEST)
    }
  }
};
</script>

<style scoped>
</style>