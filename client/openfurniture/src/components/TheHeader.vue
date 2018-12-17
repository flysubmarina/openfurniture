<template>
  <div class="header">
    <div>
      <b-navbar type="dark" variant="primary" toggleable>
        <b-navbar-brand>OpenFurniture</b-navbar-brand>
        <b-navbar-toggle target="nav_dropdown_collapse"></b-navbar-toggle>
        <b-collapse is-nav id="nav_dropdown_collapse">
          <b-navbar-nav>
            <b-nav-item to="/">Home</b-nav-item>
            <b-button v-if="isProfileLoaded" variant="success" size="sm" class="my-2 my-sm-0">My Room</b-button>
            <!-- Navbar dropdowns -->
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item v-if="!isAuthenticated" to="/login">Login</b-nav-item>
            <b-nav-item-dropdown text="Lang" right>
              <b-dropdown-item href="#">EN</b-dropdown-item>
              <b-dropdown-item href="#">UA</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown
              v-if="isProfileLoaded"
              :text="getProfile.login"
              right
            >
              <b-dropdown-item href="#">Account</b-dropdown-item>
              <b-dropdown-item href="#">Settings</b-dropdown-item>
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
    ...mapGetters(["isAuthenticated", "isProfileLoaded"])
  }
};
</script>

<style scoped>
</style>