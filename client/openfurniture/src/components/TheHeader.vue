<template>
  <div class="header">
    <div>
      <b-navbar type="dark" variant="primary" toggleable>
        <b-navbar-brand>OpenFurniture</b-navbar-brand>
        <b-navbar-toggle target="nav_dropdown_collapse"></b-navbar-toggle>
        <b-collapse is-nav id="nav_dropdown_collapse">
          <b-navbar-nav>
            <b-nav-item to="/">Home</b-nav-item>
            <b-button variant="danger" v-if="isAdmin" @click="$router.push('/dashboard')" class="my-sm-0 ml-3">Admin dashboard</b-button>
            <b-button @click="$router.push('/controll')" v-if="isProfileLoaded" variant="success" size="sm" class="my-sm-0 ml-3">Controll state</b-button>
            <b-button @click="$router.push('/rooms')" v-if="isProfileLoaded" variant="success" size="sm" class="my-sm-0 ml-3">Buy rooms</b-button>
            <!-- Navbar dropdowns -->
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item v-if="!isAuthenticated" to="/login">Sign In</b-nav-item>
             <b-nav-item v-if="!isAuthenticated" to="/register">Sign Up</b-nav-item>
            <b-nav-item-dropdown text="Lang" right>
              <b-dropdown-item href="#">EN</b-dropdown-item>
              <b-dropdown-item href="#">UA</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown
              v-if="isProfileLoaded"
              :text="getProfile.login"
              right
            >
              <b-dropdown-item to="/account">Account</b-dropdown-item>
              <b-dropdown-item to="/logout">Logout</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "TheHeader",
  data() {
    return {};
  },
  computed: {
    getProfile() {
      return this.$store.getters.getProfile;
    },
    ...mapGetters(["isAuthenticated", "isProfileLoaded", "isAdmin"])
  }
};
</script>

<style scoped>
</style>