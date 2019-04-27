<i18n>
{
  "en": {
    "Home": "Home",
    "Admin dashboard": "Admin dashboard",
    "Controll state":"Controll state",
    "Buy rooms": "Buy rooms",
    "Sign In": "Sign In",
    "Sign Up": "Sign Up",
    "Account":"Account",
    "Logout":"Logout",
    "Lang":"Lang",
    "UA":"UA",
    "EN":"EN"
  },
  "ua": {
    "Set User Height": "Встановити висоту користувача",
    "Home": "Домашня сторiнка",
    "Admin dashboard": "Панель адмiнicтрування",
    "Controll state":"Керування станом",
    "Buy rooms": "Покупка кімнати",
    "Sign In": "Вхід",
    "Sign Up": "Реєстрація",
    "Account":"Акаунт",
    "Logout":"Вихід",
    "Lang":"Мова",
    "UA":"Українська",
    "EN":"Англійська"
  }
}
</i18n>


<template>
  <div class="header">
    <div>
      <b-navbar type="dark" variant="primary" toggleable>
        <b-navbar-brand>OpenFurniture</b-navbar-brand>
        <b-navbar-toggle target="nav_dropdown_collapse"></b-navbar-toggle>
        <b-collapse is-nav id="nav_dropdown_collapse">
          <b-navbar-nav>
            <b-nav-item to="/">{{$t('Home')}}</b-nav-item>
            <b-button
              variant="danger"
              v-if="isAdmin"
              @click="$router.push('/dashboard')"
              class="my-sm-0 ml-3"
            >{{$t('Admin dashboard')}}</b-button>
            <b-button
              @click="$router.push('/controll')"
              v-if="isProfileLoaded"
              variant="success"
              size="sm"
              class="my-sm-0 ml-3"
            >{{$t('Controll state')}}</b-button>
            <b-button
              @click="$router.push('/rooms')"
              v-if="isProfileLoaded"
              variant="success"
              size="sm"
              class="my-sm-0 ml-3"
            >{{$t("Buy rooms")}}</b-button>
            <b-button
              @click="$router.push('/userheight')"
              v-if="isProfileLoaded"
              variant="success"
              size="sm"
              class="my-sm-0 ml-3"
            >{{$t("Set User Height")}}</b-button>
            <!-- Navbar dropdowns -->
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item v-if="!isAuthenticated" to="/login">{{$t("Sign In")}}</b-nav-item>
            <b-nav-item v-if="!isAuthenticated" to="/register">{{$t('Sign Up')}}</b-nav-item>
            <b-nav-item-dropdown :text="$t('Lang')" right>
              <b-dropdown-item @click="setLocale('en')">{{$t('EN')}}</b-dropdown-item>
              <b-dropdown-item @click="setLocale('ua')">{{$t('UA')}}</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown v-if="isProfileLoaded" :text="getProfile.login" right>
              <b-dropdown-item to="/account">{{$t('Account')}}</b-dropdown-item>
              <b-dropdown-item to="/logout">{{$t('Logout')}}</b-dropdown-item>
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
    return {
      locale: "en"
    };
  },
  mounted() {
    this.$parent.$refs.footer.logLocale();
  },
  computed: {
    getProfile() {
      return this.$store.getters.getProfile;
    },
    ...mapGetters(["isAuthenticated", "isProfileLoaded", "isAdmin"])
  },
  methods: {
    showLocaleFooter() {
      this.$parent.$refs.footer.logLocale();
    },
    setLocale(locale) {
      this.locale = locale;
      this.$parent.$refs.footer.logLocale()
    }
  },
  watch: {
    locale(newValue, oldValue) {
      this.$root.$i18n.locale = newValue
    }
  }
};
</script>

<style scoped>
</style>