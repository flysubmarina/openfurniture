<template>
  <div>
    <b-jumbotron>
      <template slot="header">Hello {{getProfile.login?getProfile.login:'guest'}}</template>
      <template slot="lead">Welcome to OpenFurniture</template>
      <hr class="my-4">
      <p>We can help you to customize your space in hotel {{getNumber}}</p>
      <b-btn @click="handleClick" variant="success" size="lg">Get Started</b-btn>
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
    console.log();
    if (this.isAuthenticated) this.handleUserRequest();
    //else console.log("bad error");
  },
  computed: {
    ...mapGetters(["getProfile", "isAuthenticated"]),
    getNumber(){
      return this.$store.state.number
    }
  },
  methods: {
    handleUserRequest() {
      this.$store.dispatch(USER_REQUEST);
    },
    handleClick(e) {
      localStorage.setItem('number', 10)
    }
  }
};
</script>

<style scoped>
</style>