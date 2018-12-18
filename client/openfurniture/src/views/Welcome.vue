<template>
  <div>
    <Error v-for="(err, index) in errors" :key="index" :ref="index" :msg="err.msg"/>
    <b-jumbotron>
      <template slot="header">Hello {{getProfile.login?getProfile.login:'guest'}}</template>
      <template slot="lead">Welcome to OpenFurniture</template>
      <hr class="my-4">
      <p>We can help you to customize your space in hotel</p>
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
      errors:[
        {
          msg: 'Invalid'
        },
        {
          msg: 'Invalid'
        },
        {
          msg: 'Invalid'
        }
      ]
    };
  },
  components: {
    Error
  },
  created() {
    if (this.isAuthenticated) this.handleUserRequest();
   console.log(this.$refs);
  },
  computed: {
    ...mapGetters(["getProfile", "isAuthenticated"])
  },
  methods: {
    handleUserRequest() {
      this.$store.dispatch(USER_REQUEST);
    },
    handleClick(e){
      console.log(e);
       this.$refs[0][0].showAlert();
       this.$refs[1][0].showAlert();
       this.$refs[2][0].showAlert();
    }
  }
};
</script>

<style scoped>
</style>