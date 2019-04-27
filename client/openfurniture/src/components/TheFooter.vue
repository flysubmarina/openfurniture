<i18n>
{
  "en": {
    "Hello": "Hello",
    "WelcometoOpenFurniture": "Welcome to OpenFurniture"
  },
  "ua": {
    "Hello": "Добрий день, ",
    "WelcometoOpenFurniture": "Раді бачити вас в OpenFurniture"
  }
}
</i18n>



<template>
  <div></div>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
        
    };
  },
  mounted() {},
  methods: {
    logLocale() {
      console.log(this.$i18n.locale);
    }
  }
};
</script>

<style scoped>
</style>